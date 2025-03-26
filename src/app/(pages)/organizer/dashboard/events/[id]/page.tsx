"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  Info,
  UserRound,
  Edit,
  ChevronLeft,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";

// Mock data - in a real app, you would fetch this from an API
import { Event } from "@/types/event";
import { events } from "@/utils/data/events";

const OrganizerEventDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate fetching event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventId = Array.isArray(params.id)
          ? params.id[0]
          : (params.id as string);

        const foundEvent = events.find((e) => String(e.id) === String(eventId));

        if (foundEvent) {
          // Convert foundEvent to unknown first, then cast to Event type
          setEvent(foundEvent as Event);
          setProgress(Math.floor(Math.random() * 60) + 30);
        } else {
          console.log(`Event with ID ${eventId} not found`);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  // Fancy loading animation
  if (loading) {
    return (
      <div className="min-h-screen md:pt-32 pt-28 pb-16 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Loading animation content remains the same */}
            {/* ... existing loading animation ... */}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen md:pt-32 pt-28 pb-16 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md px-6"
        >
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <Info className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Event Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 px-6 py-2 rounded-full"
            onClick={() => router.push("/organizer/dashboard/events")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const handleBackButton = () => {
    router.push("/organizer/dashboard/events");
  };

  const handleViewAttendees = () => {
    router.push(`/organizer/dashboard/events/${event.id}/attendees`);
  };

  const handleEditEvent = () => {
    router.push(`/organizer/dashboard/events/edit/${event.id}`);
  };

  return (
    <section className="dark:bg-gray-950 bg-white min-h-screen">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
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
      </motion.div>

      <main className="pb-16">
        {/* Hero Section - Modern & Minimalistic Approach */}
        <div className="container mx-auto px-4 mb-8">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back button with clean design - improved for mobile */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(59, 130, 246, 0)",
                    "0px 0px 15px rgba(59, 130, 246, 0.5)",
                    "0px 0px 0px rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{
                  boxShadow: { repeat: Infinity, duration: 2 },
                  scale: { type: "spring", stiffness: 400 },
                }}
                className="rounded-full"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBackButton}
                  className="rounded-full bg-white/90 backdrop-blur-md border-transparent hover:bg-white text-gray-800 dark:bg-gray-900/80 dark:hover:bg-gray-900 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12"
                >
                  <motion.div
                    animate={{ x: [0, -2, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {/* Action buttons - Edit button for organizer */}
            <motion.div
              className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    "0px 0px 0px rgba(59, 130, 246, 0)",
                    "0px 0px 15px rgba(59, 130, 246, 0.5)",
                    "0px 0px 0px rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{
                  boxShadow: { repeat: Infinity, duration: 2 },
                  scale: { type: "spring", stiffness: 400 },
                }}
                className="rounded-full"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEditEvent}
                  className="rounded-full bg-white/90 backdrop-blur-md border-transparent hover:bg-white text-gray-800 dark:bg-gray-900/80 dark:hover:bg-gray-900 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                  >
                    <Edit className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Clean image with improved gradient overlay for better title visibility */}
            <div className="relative w-full aspect-video">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              {/* Enhanced gradient overlay only visible on medium screens and up */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 hidden md:block" />

              {/* Additional overlay for white images */}
              <div className="absolute inset-0 bg-black/10" />

              {/* Event title overlay with improved visibility - only visible on medium screens and up */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative max-w-full sm:max-w-3xl">
                  {/* Title shadow for better readability on any background */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-left line-clamp-2">
                    {event.title}
                  </h1>

                  {/* Optional subtitle or date display */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4 mr-1.5 text-blue-300 flex-shrink-0" />
                      <span className="truncate">
                        {event.date === "" ? event.dateRange : event.date}
                      </span>
                    </div>
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 mr-1.5 text-blue-300 flex-shrink-0" />
                      <span className="truncate">{event.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Title Card - Only visible on small screens */}
        <div className="container mx-auto px-4 md:hidden mb-5">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-3">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate max-w-[120px]">
                  {event.date === "" ? event.dateRange : event.date}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate max-w-[120px]">{event.time}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Organizer Action Card - New card for organizer actions */}
        <div className="container mx-auto px-4 mb-5">
          <motion.div
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-blue-800/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row md:items-center place-items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Organizer Controls
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your event and view attendee information
                </p>
              </div>
              <div className="flex gap-3 md:justify-end items-center md:flex-row flex-col w-full md:w-auto">
                <Button
                  onClick={handleEditEvent}
                  className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-200 dark:border-blue-800/50 h-11 hover:scale-105 duration-150 transition-all md:w-auto w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button
                  onClick={handleViewAttendees}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-11 hover:scale-105 duration-150 transition-all md:w-auto w-full"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  View Attendees
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 md:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Description Card - Full Width */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-6 lg:col-span-12 order-1"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                About This Event
              </h3>

              <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed line-clamp-[12] md:line-clamp-none">
                  {event.description}
                </p>
                {event.description.length > 500 && (
                  <button className="text-blue-600 dark:text-blue-400 font-medium mt-2 md:hidden">
                    Read more
                  </button>
                )}
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-3 order-2 md:order-5"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Price
                  </h3>
                  <motion.h2
                    className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: 0.6,
                    }}
                  >
                    {event.price === "Free" ||
                    event.price === "0" ||
                    event.price === ""
                      ? "Free"
                      : `₹${event.price}`}
                  </motion.h2>
                </div>
              </div>
            </motion.div>

            {/* Date Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-3 order-3 md:order-2"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {event.dayType === "multi day" ? "Date Range" : "Date"}
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.dayType === "multi day"
                      ? event.dateRange
                      : event.date}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Time Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-3 order-4 md:order-3"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Time
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.time}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Duration: {event.duration} hours
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Category Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-3 order-5 md:order-4"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Category
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.category}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-6 order-6"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex flex-col sm:flex-row md:items-center place-items-start">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
                  <motion.div
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Location
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.eventType === "virtual"
                      ? "Virtual Event"
                      : event.venue}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Event Status Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-6 order-9"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Event Status
              </h3>
              <div className="flex md:flex-row flex-col md:items-center place-items-start md:justify-between gap-2">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full mr-2",
                      event.status === "approved"
                        ? "bg-green-500"
                        : event.status === "pending"
                        ? "bg-yellow-500"
                        : event.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium capitalize",
                      event.status === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : event.status === "pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : event.status === "cancelled"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {event.status}
                  </span>
                </div>
                <div>
                  {event.status === "approved" && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Your event is live and accepting registrations
                    </span>
                  )}
                  {event.status === "pending" && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Your event is awaiting approval from administrators
                    </span>
                  )}
                  {event.status === "rejected" && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Your event has been rejected. Please contact admin for
                      details.
                    </span>
                  )}
                  {event.status === "cancelled" && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      This event has been cancelled
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Target Audience Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-6 lg:col-span-12 order-10"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Target Audience
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Departments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.department && event.department.length > 0 ? (
                      event.department.map((dept, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {dept}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        All departments
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Courses
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.course && event.course.length > 0 ? (
                      event.course.map((course, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {course}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        All courses
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.year && event.year.length > 0 ? (
                      event.year.map((year, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          {year}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        All years
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Analytics Section - Only for approved events */}
        {event.status === "approved" && (
          <div className="container mx-auto px-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Event Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Registration Rate
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {progress}%
                  </p>
                  <div className="mt-2">
                    <Progress
                      value={progress}
                      className="h-2 bg-blue-100 dark:bg-blue-800/30"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {Math.floor((progress / 100) * parseInt(event.capacity))}{" "}
                    out of {event.capacity} seats filled
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Engagement Score
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 30) + 70}/100
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Based on social shares and page views
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Time Until Event
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 30) + 1} days
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Prepare your event materials
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Export Options */}
        <div className="container mx-auto px-4 mt-8 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 md:w-auto w-full h-11 hover:scale-105 duration-150 transition-all"
              onClick={() => {
                // Export functionality would go here
                alert("Export to PDF functionality would be implemented here");
              }}
            >
              <Download className="w-5 h-5 mr-1" />
              Export Event Details
            </Button>
          </motion.div>
        </div>
      </main>
    </section>
  );
};

export default OrganizerEventDetails;
