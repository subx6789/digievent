/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types/event";
import {
  ChevronLeft,
  Save,
  ArrowLeft,
  CircleCheck,
  RefreshCw,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import StepIndicator from "@/components/Customs/StepIndicator";
import { formSteps } from "@/utils/functions/formSteps";
import { format } from "date-fns";
import { useEventFormStore } from "@/store/eventFormStore";

// Import form sections
import BasicDetailsForm from "@/components/Forms/EventForms/BasicDetailsForm";
import DateTimeForm from "@/components/Forms/EventForms/DateTimeForm";
import LocationForm from "@/components/Forms/EventForms/LocationForm";
import MediaForm from "@/components/Forms/EventForms/MediaForm";
import AudienceForm from "@/components/Forms/EventForms/AudienceForm";
import { courses } from "@/utils/data/courses";

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">(
    "saved"
  );
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Use Zustand stores instead of services
  const { updateEvent, getEventById } = useEventFormStore();

  // When loading the event data, ensure capacity is properly parsed
  useEffect(() => {
    if (eventData && originalEvent) {
      // Only update if the capacity format needs to be fixed and we haven't already updated it
      const currentCapacity = eventData.capacity;
      const parsedCapacity = currentCapacity
        ? String(parseInt(currentCapacity))
        : currentCapacity;

      // Only update if the format is different to avoid infinite loops
      if (currentCapacity && parsedCapacity !== currentCapacity) {
        setEventData({
          ...eventData,
          capacity: parsedCapacity,
        });
      }
    }
  }, [originalEvent]);

  // Fetch event data
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        // Get event from Zustand store
        const event = getEventById(eventId);

        if (event) {
          setEventData(event);
          setOriginalEvent(JSON.parse(JSON.stringify(event))); // Deep copy for comparison
        } else {
          toast({
            title: "Error",
            description: "Event not found",
            variant: "destructive",
          });
          router.push("/organizer/dashboard/events");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [eventId, router, toast, getEventById]);

  // Debounced save function using Zustand
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;

      return (updatedData: Event) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        setSaveStatus("saving");

        timeoutId = setTimeout(() => {
          try {
            // Preserve original isFree value
            if (originalEvent) {
              updatedData.isFree = originalEvent.isFree;
            }

            // Ensure capacity doesn't decrease
            if (
              originalEvent &&
              originalEvent.capacity &&
              updatedData.capacity &&
              parseInt(updatedData.capacity) < parseInt(originalEvent.capacity)
            ) {
              updatedData.capacity = originalEvent.capacity;

              toast({
                title: "Capacity Restriction",
                description:
                  "Seat capacity cannot be decreased from the current capacity.",
                variant: "destructive",
              });
            }

            // Update event in Zustand store
            updateEvent(updatedData);
            setSaveStatus("saved");
            setLastSaved(format(new Date(), "h:mm a"));
          } catch (error) {
            console.error("Error saving event:", error);
            setSaveStatus("error");
          }
        }, 1500);
      };
    })(),
    [updateEvent, originalEvent, toast]
  );

  // Handle form updates with autosave
  const updateFormData = useCallback(
    (data: Partial<Event>) => {
      if (eventData) {
        const updatedData = { ...eventData, ...data };

        // Preserve original isFree value
        if (originalEvent) {
          updatedData.isFree = originalEvent.isFree;
        }

        setEventData(updatedData);
        debouncedSave(updatedData as Event);
      }
    },
    [eventData, debouncedSave, originalEvent]
  );

  // Handle final save
  const handleSave = async () => {
    if (!eventData || !originalEvent) return;

    setSaveStatus("saving");
    try {
      // Create final event data with restrictions applied
      const finalEventData = {
        ...eventData,
        // Preserve original isFree value
        isFree: originalEvent.isFree,
        // Ensure capacity doesn't decrease
        capacity:
          originalEvent.capacity &&
          eventData.capacity &&
          parseInt(eventData.capacity) < parseInt(originalEvent.capacity)
            ? originalEvent.capacity
            : eventData.capacity,
      };

      // Update event in Zustand store
      updateEvent(finalEventData);
      setSaveStatus("saved");
      setLastSaved(format(new Date(), "h:mm a"));

      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully",
      });

      router.push("/organizer/dashboard/events");
    } catch (error) {
      console.error("Error saving event:", error);
      setSaveStatus("error");

      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  // Handle back button
  const handleBackButton = () => {
    router.push("/organizer/dashboard/events");
  };

  // Handle step navigation
  const handleNextStep = () => {
    setCurrentStep(Math.min(formSteps.length - 1, currentStep + 1));
  };

  const handlePreviousStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  // Define restrictions for forms
  const locationRestrictions = {
    isFree: {
      value: originalEvent?.isFree,
      canEdit: false, // Cannot change free/paid status
    },
  };

  const audienceRestrictions = {
    capacity: {
      minValue: originalEvent?.capacity || "0",
      canEdit: true, // Can edit but with minimum value restriction
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <CircleX className="h-16 w-16 text-red-500" />
          <p className="text-xl font-medium">Event not found</p>
          <Button onClick={() => router.push("/organizer/dashboard/events")}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="dark:bg-gray-950 bg-white min-h-screen">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="container mx-auto px-4 py-6"
      >
        {/* Top navigation */}
        <div className="flex justify-between items-center mb-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleBackButton}
              className="flex items-center gap-2 rounded-lg h-11 bg-transparent dark:text-white text-black hover:scale-105 transition-all duration-150"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="md:block hidden">Back to Events</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, rotate: 15 }}>
            <ModeToggle />
          </motion.div>
        </div>

        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 dark:text-blue-400 text-blue-600"
          >
            Edit Event
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            Update your event details. Some fields may be restricted from
            editing. Your progress is automatically saved.
          </motion.p>
        </div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <StepIndicator
            steps={formSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </motion.div>

        {/* Form content */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          {/* Auto-save status indicator */}
          <div className="flex justify-end p-4 border-b border-gray-100 dark:border-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={saveStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm"
              >
                {saveStatus === "saving" && (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-500" />
                    <span className="text-amber-500">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CircleCheck className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-green-500">Saved</span>
                    {lastSaved && (
                      <span className="text-gray-500 text-xs">
                        at {lastSaved}
                      </span>
                    )}
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <CircleX className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-red-500">Error saving</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="min-h-[400px]"
              >
                {currentStep === 0 && (
                  <BasicDetailsForm
                    formData={eventData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 1 && (
                  <DateTimeForm
                    formData={eventData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 2 && (
                  <LocationForm
                    formData={eventData}
                    updateFormData={updateFormData}
                    editMode={true}
                    restrictions={locationRestrictions}
                  />
                )}

                {currentStep === 3 && (
                  <MediaForm
                    formData={eventData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 4 && (
                  <AudienceForm
                    formData={eventData}
                    updateFormData={updateFormData}
                    courses={courses}
                    editMode={true}
                    restrictions={audienceRestrictions}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons with animations */}
            <motion.div
              className="flex justify-between mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-8 rounded-lg h-11 bg-transparent dark:text-white text-black hover:scale-105 transition-all duration-150"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </motion.div>

              {currentStep === formSteps.length - 1 ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 rounded-lg h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 transition-all duration-150"
                  >
                    <Save className="h-4 w-4" />
                    Update Changes
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-8 rounded-lg h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white hover:scale-105 transition-all duration-150"
                  >
                    Next
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default EditEventPage;
