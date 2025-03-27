"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/StudentPages/Footer/Footer";
import Navbar from "@/components/StudentPages/Navbar/Navbar";
import EventCard from "@/components/Card/EventCard";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, X, XCircle, Ticket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { mockEvents } from "@/utils/data/mockEvents";

const StudentEventBookingHistory = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Simulate fetching booked events
  useEffect(() => {
    const fetchBookedEvents = async () => {
      // Simulate API call delay
      setTimeout(() => {
        // Filter events to only include those with studentsBooked
        const events = mockEvents.filter(
          (event: Event) =>
            event.studentsBooked && event.studentsBooked.length > 0
        );
        setBookedEvents(events);
        setFilteredEvents(
          events.filter((event) => event.progress !== "cancelled")
        );
        setIsLoading(false);
      }, 1000);
    };

    fetchBookedEvents();
  }, []);

  // Filter events based on search query and active tab
  useEffect(() => {
    let filtered = [...bookedEvents];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, activeTab, bookedEvents]);

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleDownloadTicket = (eventId: string) => {
    toast({
      title: "Ticket Downloaded",
      description: "Your event ticket has been downloaded successfully.",
      duration: 3000,
    });
    console.log(eventId);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <div className="pt-32 min-h-screen pb-20 px-4 sm:px-6 lg:px-8 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              View and manage your event bookings
            </p>
          </motion.div>

          <div className="w-full md:w-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-6 w-full md:w-[300px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl inline-flex shadow-lg border border-blue-100 dark:border-blue-800/50 overflow-hidden">
              <button
                onClick={() => setActiveTab("active")}
                className={`relative px-8 py-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "active"
                    ? "bg-blue-500 text-white shadow-md transform scale-100"
                    : "text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                }`}
              >
                <Ticket
                  className={`h-5 w-5 ${
                    activeTab === "active"
                      ? "text-white"
                      : "text-blue-500 dark:text-blue-300"
                  }`}
                />
                <span>My Bookings</span>
              </button>
              <button
                onClick={() => setActiveTab("cancelled")}
                className={`relative px-8 py-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "cancelled"
                    ? "bg-blue-500 text-white shadow-md transform scale-100"
                    : "text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                }`}
              >
                <XCircle
                  className={`h-5 w-5 ${
                    activeTab === "cancelled"
                      ? "text-white"
                      : "text-blue-500 dark:text-blue-300"
                  }`}
                />
                <span>Cancelled</span>
              </button>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg h-[400px] animate-pulse"
                  />
                ))}
              </motion.div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <EventCard
                        event={event}
                        onView={handleViewEvent}
                        onDownload={handleDownloadTicket}
                        isBookingHistory={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {activeTab === "cancelled"
                    ? "No cancelled bookings"
                    : "No active bookings"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  {searchQuery
                    ? "No events match your search criteria. Try a different search term."
                    : activeTab === "cancelled"
                    ? "You don't have any cancelled event bookings."
                    : "You haven't booked any events yet. Explore events and book your first one!"}
                </p>
                <Button
                  onClick={() => router.push("/events")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Explore Events
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </section>
  );
};

export default StudentEventBookingHistory;
