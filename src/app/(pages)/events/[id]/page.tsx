"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Mail,
  ChevronLeft,
  Share2,
  Ticket,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Navbar from "@/components/StudentPages/Navbar/Navbar";
import Footer from "@/components/StudentPages/Footer/Footer";
import Link from "next/link";

// Mock data - in a real app, you would fetch this from an API
import { Event } from "@/types/event";
import { events } from "@/utils/data/events";

const EventDetails = () => {
  const params = useParams();
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
      <>
        <Navbar />
        <div className="min-h-screen md:pt-32 pt-28 pb-16 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-32 h-32 mb-8">
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-600 opacity-20"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full bg-blue-500 dark:bg-blue-600 opacity-40"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-blue-500 dark:bg-blue-600 opacity-60"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ticket className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <motion.h3
                className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading Event Details
              </motion.h3>
              <motion.div
                className="flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
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
            <Link href="/events">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 px-6 py-2 rounded-full">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
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

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-gray-950">
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
                <Link href="/events">
                  <Button
                    variant="outline"
                    size="icon"
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
                </Link>
              </motion.div>
            </div>

            {/* Action buttons - improved for mobile */}
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
                    <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
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

            {/* Price Card - Moved up in mobile view */}
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
                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="w-full py-5 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-11 rounded-xl">
                    <Ticket className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                </motion.div>
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
              <div className="flex flex-col sm:flex-row items-center">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {event.eventType === "virtual"
                      ? "Access details will be provided after booking"
                      : "Entry ticket will be provided after booking"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Capacity Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-6 order-7"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Availability
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {Math.floor((progress / 100) * parseInt(event.capacity))} /{" "}
                    {event.capacity}
                  </span>
                </div>
                <motion.span
                  className={cn(
                    "text-sm font-medium px-3 py-1 rounded-full",
                    progress > 80
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : progress > 50
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  )}
                  animate={progress > 80 ? pulseAnimation : {}}
                >
                  {progress > 80
                    ? "Almost Full"
                    : progress > 50
                    ? "Filling Up"
                    : "Available"}
                </motion.span>
              </div>

              <div className="space-y-2">
                <Progress
                  value={progress}
                  className="h-3 bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <motion.div
                  animate={progress > 70 ? pulseAnimation : {}}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium"
                >
                  <Ticket className="h-4 w-4 mr-1.5" />
                  {progress > 70 ? "Only a few seats left!" : "Booking open"}
                </motion.div>
              </div>
            </motion.div>

            {/* Organizer Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 md:col-span-3 lg:col-span-6 order-8"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Organizer
              </h3>

              <div className="flex md:flex-row flex-col md:gap-0 gap-4 items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mr-4 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-md h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg sm:text-xl font-bold"
                >
                  {event.clubName
                    ? event.clubName.charAt(0)
                    : event.clubName.charAt(0)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-2 md:mb-0 text-gray-900 dark:text-white text-lg truncate">
                    {event.clubName}
                  </h4>
                  <p className="text-sm mb-2 md:mb-1 text-gray-500 dark:text-gray-400 sm:mb-2">
                    {event.organizer.name}
                  </p>
                  <div className="flex items-center mb-2 md:mb-0 text-gray-700 dark:text-gray-300">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 text-sm" />
                    <span className="text-sm truncate">
                      contact@
                      {event.clubName.toLowerCase().replace(/\s+/g, "")}
                      .com
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 rounded-xl shadow-lg p-8 md:col-span-6 lg:col-span-6 text-white order-9"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold">
                    Ready to join this event?
                  </h3>
                  <p className="text-blue-100">
                    Secure your spot now and be part of this amazing experience.
                    Limited seats available!
                  </p>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg">
                      Book Your Ticket
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetails;
