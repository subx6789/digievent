/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/utils/data/courses";
import { Event } from "@/types/event";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  CircleX,
  CircleCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import StepIndicator from "@/components/Customs/StepIndicator";
import { formSteps } from "@/utils/functions/formSteps";

// Import form sections
import BasicDetailsForm from "@/components/Forms/EventForms/BasicDetailsForm";
import DateTimeForm from "@/components/Forms/EventForms/DateTimeForm";
import LocationForm from "@/components/Forms/EventForms/LocationForm";
import MediaForm from "@/components/Forms/EventForms/MediaForm";
import AudienceForm from "@/components/Forms/EventForms/AudienceForm";
import { useEventFormStore } from "@/store/eventFormStore";
import { useEventsStore } from "@/store/eventsStore";

const RequestEventPage = () => {
  // Get everything from the Zustand form store
  const {
    formData,
    currentStep,
    isFormComplete,
    saveStatus,
    lastSaved,
    setFormData,

    setCurrentStep,
    setIsFormComplete,
    setSaveStatus,
    setLastSaved,
    resetFormData,
  } = useEventFormStore();

  // Get collection management from eventsStore
  const { addEvent } = useEventsStore();

  const router = useRouter();
  const { toast } = useToast();
  const [formKey, setFormKey] = useState(Date.now()); // Add a key for forcing re-render

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Debounce function for auto-save
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      setSaveStatus("saving");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        setSaveStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());
      }, delay);
    };
  };

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((data: Partial<Event>) => {
      setFormData(data);
      localStorage.setItem("eventFormData", JSON.stringify(data));
    }, 1000),
    []
  );

  // Load saved form data on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("eventFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setLastSaved("Previously saved data loaded");
        // Force re-render of form components
        setFormKey(Date.now());
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        setSaveStatus("error");
      }
    }
  }, []);

  // Check if form is complete enough to submit
  useEffect(() => {
    // Basic required fields for all events
    const basicRequiredFields = [
      "title",
      "description",
      "time",
      "duration",
      "coverImage",
      "capacity",
      "category",
    ];

    // Conditional required fields
    const conditionalFields = [];

    // If single day event, date is required
    if (formData.dayType === "single day") {
      conditionalFields.push("date");
    }

    // If multi day event, dateRange is required
    if (formData.dayType === "multi day") {
      conditionalFields.push("dateRange");
    }

    // If not free, price is required
    if (formData.isFree === false) {
      conditionalFields.push("price");
    }

    // If physical event, venue is required
    if (formData.eventType === "physical") {
      conditionalFields.push("venue");
    }

    // If virtual event, virtualLink is required
    if (formData.eventType === "virtual") {
      conditionalFields.push("virtualLink");
    }

    // Check if audience targeting is set
    const hasAudience =
      formData.course &&
      formData.course.length > 0 &&
      formData.department &&
      formData.department.length > 0 &&
      formData.year &&
      formData.year.length > 0;

    // Combine all required fields
    const allRequiredFields = [...basicRequiredFields, ...conditionalFields];

    // Check if all required fields are filled
    const fieldsComplete = allRequiredFields.every((field) => {
      const value = formData[field as keyof Partial<Event>];
      return value !== undefined && value !== "";
    });

    setIsFormComplete(Boolean(fieldsComplete && hasAudience));
  }, [formData]);

  // Update form data and trigger auto-save
  const updateFormData = (data: Partial<Event>) => {
    const updatedData = { ...formData, ...data };

    // Set clubName to "My Club" if not provided
    if (!updatedData.clubName) {
      updatedData.clubName = "My Club";
    }

    setFormData(updatedData);
    debouncedSave(updatedData);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle back navigation
  const handleBackButton = () => {
    router.push("/organizer/dashboard/events");
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Create a new event with the form data
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: formData.title || "",
      description: formData.description || "",
      dayType: formData.dayType || "single day",
      date: formData.date || "",
      dateRange: formData.dateRange || "",
      time: formData.time || "",
      duration: formData.duration || "",
      isFree: formData.isFree || true,
      price: formData.price || "",
      eventType: formData.eventType || "physical",
      venue: formData.venue || "",
      virtualLink: formData.virtualLink || "",
      coverImage: formData.coverImage || "/Placeholder/event-placeholder.jpg",
      clubName: formData.clubName || "My Club",
      category: formData.category || "",
      status: "pending",
      capacity: formData.capacity || "0",
      course: formData.course || [],
      department: formData.department || [],
      year: formData.year || [],
      createdAt: new Date().toISOString(),
      organizer: formData.organizer || {
        id: "3",
        name: "Ananya Roy",
        role: "organizer",
        clubName: "Takshila",
        email: "takshila7890@gmail.com",
        phone: "+91 99876 54321",
        eventCount: 13,
        avatarUrl: "/path/to/ananya-avatar.jpg",
      }, // For backward compatibility
      progress: "none",
      studentsBooked: null,
    };

    console.log("Submitting event:", newEvent);

    // Add the event to the events store
    addEvent(newEvent);

    // Simulate API call success
    // In the future, replace with actual API call
    setTimeout(() => {
      // Show success toast with animation
      toast({
        title: "Event Requested Successfully",
        description: "Your event has been submitted for approval.",
        variant: "default",
        action: (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </motion.div>
        ),
      });

      // Clear form data from localStorage and store
      localStorage.removeItem("eventFormData");
      resetFormData();

      // Redirect to events page
      router.push("/organizer/dashboard/events");
    }, 1000);
  };

  return (
    <section className="dark:bg-gray-950 bg-white min-h-screen">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="container mx-auto px-4 py-6"
      >
        {/* Top navigation with back button and theme toggler */}
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
            Request New Event
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            Fill out the form below to request a new event. All events require
            approval before they are published. Your progress is automatically
            saved.
          </motion.p>
        </div>

        {/* Using StepIndicator component */}
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

        {/* Form content with animations */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
          {/* Auto-save status indicator moved to top right of form area */}
          <div className="flex justify-end pt-4 pr-4">
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
                key={`${currentStep}-${formKey}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="min-h-[400px]"
              >
                {currentStep === 0 && (
                  <BasicDetailsForm
                    key={`basic-${formKey}`}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 1 && (
                  <DateTimeForm
                    key={`datetime-${formKey}`}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 2 && (
                  <LocationForm
                    key={`location-${formKey}`}
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 3 && (
                  <MediaForm
                    formData={formData}
                    key={`media-${formKey}`}
                    updateFormData={updateFormData}
                  />
                )}

                {currentStep === 4 && (
                  <AudienceForm
                    key={`audience-${formKey}`}
                    formData={formData}
                    updateFormData={updateFormData}
                    courses={courses}
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

              {currentStep < formSteps.length - 1 ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleNextStep}
                    className="flex items-center px-8 gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg h-11 hover:scale-105 transition-all duration-150"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isFormComplete ? [1, 1.03, 1] : 1,
                  }}
                  transition={{
                    repeat: isFormComplete ? Infinity : 0,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormComplete}
                    className={`flex items-center px-8 gap-2 rounded-lg h-11 ${
                      isFormComplete
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 transition-all duration-150"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit Request
                    <Save className="h-4 w-4" />
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

export default RequestEventPage;
