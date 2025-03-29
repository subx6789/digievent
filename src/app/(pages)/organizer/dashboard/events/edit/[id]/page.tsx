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

// Import Zustand stores
import { useEventFormStore } from "@/store/eventFormStore";
import { useEventsStore } from "@/store/eventsStore";

// Import form sections
import BasicDetailsForm from "@/components/Forms/EventForms/BasicDetailsForm";
import DateTimeForm from "@/components/Forms/EventForms/DateTimeForm";
import LocationForm from "@/components/Forms/EventForms/LocationForm";
import MediaForm from "@/components/Forms/EventForms/MediaForm";
import AudienceForm from "@/components/Forms/EventForms/AudienceForm";
import { courses } from "@/utils/data/courses";
import Loading from "@/components/Loading/Loading";

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

  // Local UI state
  const [isLoading, setIsLoading] = useState(true);
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);

  // Get state and actions from Zustand stores
  const {
    formData,
    currentStep,
    saveStatus,
    lastSaved,
    setFormData,
    updateField,
    setCurrentStep,
    setSaveStatus,
    setLastSaved,
  } = useEventFormStore();

  const { getEventById, updateEvent } = useEventsStore();

  // When loading the event data, ensure capacity is properly parsed
  useEffect(() => {
    if (formData && originalEvent) {
      // Only update if the capacity format needs to be fixed and we haven't already updated it
      const currentCapacity = formData.capacity;
      const parsedCapacity = currentCapacity
        ? String(parseInt(currentCapacity as string))
        : currentCapacity;

      // Only update if the format is different to avoid infinite loops
      if (currentCapacity && parsedCapacity !== currentCapacity) {
        updateField("capacity", parsedCapacity as string);
      }
    }
  }, [originalEvent, formData]);

  // Fetch event data
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true);
      try {
        // Get event from Zustand store
        let event = getEventById(eventId);

        // If event not found, try to fetch events first
        if (!event) {
          const { fetchEvents } = useEventsStore.getState();
          await fetchEvents();
          // Try to get the event again after fetching
          event = getEventById(eventId);
        }

        if (event) {
          // Set form data in the form store
          setFormData(event);

          // Keep original event for comparison
          setOriginalEvent(JSON.parse(JSON.stringify(event)));
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
  }, [eventId, router, toast, getEventById, setFormData]);

  // Handle form updates without autosave
  const updateFormData = useCallback(
    (data: Partial<Event>) => {
      // Apply updates to form data store only (no auto-save)
      for (const [key, value] of Object.entries(data)) {
        updateField(key as keyof Event, value);
      }
    },
    [updateField]
  );

  // Handle final save
  const handleSave = async () => {
    if (!formData || !originalEvent) return;

    setSaveStatus("saving");
    try {
      // Create final event data with restrictions applied
      const finalEventData = {
        ...formData,
        id: eventId, // Ensure ID is always set
        // Preserve original isFree value
        isFree: originalEvent.isFree,
        // Ensure capacity doesn't decrease
        capacity:
          originalEvent.capacity &&
          formData.capacity &&
          parseInt(formData.capacity as string) <
            parseInt(originalEvent.capacity)
            ? originalEvent.capacity
            : formData.capacity,
      } as Event;

      // Update event in events store
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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (!formData || !formData.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <CircleX className="h-16 w-16 text-red-500" />
          <p className="text-xl font-medium text-black dark:text-white">
            Event not found
          </p>
          <Button
            className="h-11 hover:scale-105 transition-all duration-150 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/organizer/dashboard/events")}
          >
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
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 1 && (
                  <DateTimeForm
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 2 && (
                  <LocationForm
                    formData={formData}
                    updateFormData={updateFormData}
                    editMode={true}
                    restrictions={locationRestrictions}
                  />
                )}

                {currentStep === 3 && (
                  <MediaForm
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 4 && (
                  <AudienceForm
                    formData={formData}
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
