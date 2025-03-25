"use client";

import React, { useState, useEffect } from "react";
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
  FileText,
  Calendar,
  MapPin,
  Users,
  ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import StepIndicator, { Step } from "@/components/Customs/StepIndicator";

// Import form sections
import BasicDetailsForm from "@/components/Forms/EventForms/BasicDetailsForm";
import DateTimeForm from "@/components/Forms/EventForms/DateTimeForm";
import LocationForm from "@/components/Forms/EventForms/LocationForm";
import MediaForm from "@/components/Forms/EventForms/MediaForm";
import AudienceForm from "@/components/Forms/EventForms/AudienceForm";

// Form steps with Lucide icons
const formSteps: Step[] = [
  { id: "basic-details", label: "Basic Details", icon: <FileText size={16} /> },
  { id: "date-time", label: "Date & Time", icon: <Calendar size={16} /> },
  { id: "location", label: "Location", icon: <MapPin size={16} /> },
  { id: "media", label: "Media", icon: <ImageIcon size={16} /> },
  { id: "audience", label: "Audience", icon: <Users size={16} /> },
];

const RequestEventPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    status: "pending",
    isFree: true,
    dayType: "single day",
    eventType: "physical",
    course: [],
    department: [],
    year: [],
    imageGallery: [],
  });

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

  // Check if form is complete enough to submit
  useEffect(() => {
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "coverImage",
      "eventPoster",
    ];
    const isComplete = requiredFields.every(
      (field) =>
        formData[field as keyof Partial<Event>] &&
        formData[field as keyof Partial<Event>] !== ""
    );
    setIsFormComplete(isComplete);
  }, [formData]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle back navigation
  const handleBack = () => {
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
      eventPoster: formData.eventPoster || "/Placeholder/event-placeholder.jpg",
      clubName: formData.clubName || "",
      category: formData.category || "",
      status: "pending",
      capacity: formData.capacity || "0",
      course: formData.course || [],
      department: formData.department || [],
      year: formData.year || [],
      imageGallery: formData.imageGallery || [],
      createdAt: new Date().toISOString(),
      organizer: formData.clubName || "", // For backward compatibility
    };

    console.log("Submitting event:", newEvent);

    // Show success toast with animation
    toast({
      title: "Event Requested",
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

    // Redirect to events page
    router.push("/organizer/dashboard/events");
  };

  // Update form data
  const updateFormData = (data: Partial<Event>) => {
    setFormData((prev) => ({ ...prev, ...data }));
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
              onClick={handleBack}
              className="flex items-center gap-2 rounded-lg h-11 bg-transparent dark:text-white text-black"
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
            approval before they are published.
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
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-8 rounded-lg h-11 bg-transparent dark:text-white text-black"
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
                    onClick={handleNext}
                    className="flex items-center px-8 gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg h-11"
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
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
