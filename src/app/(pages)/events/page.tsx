"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Search, Filter, Calendar, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EventCard from "@/components/Card/EventCard";
import { organizerEvents } from "@/utils/data/organizerEvents";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";
import { categoriesFilter } from "@/utils/data/categoriesFilter";
import { organizersFilter } from "@/utils/data/organizersFilter";
import Navbar from "@/components/StudentPages/Navbar/Navbar";
import Footer from "@/components/StudentPages/Footer/Footer";

const StudentSideEventsPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOrganizer, setSelectedOrganizer] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Scroll animations
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 300], [0, 0.8]);
  const backgroundBlur = useTransform(scrollY, [0, 300], [0, 8]);

  const itemsPerPage = 8;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Initialize events from mock data
    setEvents(organizerEvents);
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply organizer filter
    if (selectedOrganizer !== "all") {
      filtered = filtered.filter((event) =>
        event.organizer.toLowerCase().includes(selectedOrganizer.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, selectedOrganizer, events]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Create pagination range with ellipsis
  const getPaginationRange = () => {
    const delta = 1; // Pages to show before and after current page
    const range = [];

    // Always include first page
    range.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      range.push("ellipsis-start");
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      range.push("ellipsis-end");
    }

    // Add last page if there is more than one page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        damping: 12,
      },
    },
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 relative min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10"
          style={{
            opacity: backgroundOpacity,
            filter: `blur(${backgroundBlur}px)`,
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-200/20 dark:bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, 30, 60, 30, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -40, 0, 40, 0],
            y: [0, 40, 80, 40, 0],
            scale: [1, 0.9, 1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <motion.main
        className="container mx-auto pb-4 px-4 md:pt-32 pt-28 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Title with animated gradient */}
        <motion.div variants={itemVariants} className="mb-8 relative">
          <motion.div
            className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          <motion.h1
            className="text-3xl font-bold text-transparent bg-clip-text bg-blue-600 dark:bg-blue-400 inline-block"
            animate={{
              backgroundPosition: ["0% center", "100% center", "0% center"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Upcoming Events
          </motion.h1>

          <motion.div className="flex items-center gap-2 mt-2">
            <motion.p
              className="text-gray-600 dark:text-gray-400"
              variants={itemVariants}
            >
              Discover and register for exciting events happening in your
              college
            </motion.p>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="md:block hidden"
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search and Filters with glass effect */}
        <motion.div variants={itemVariants} className="mb-8 relative z-10">
          <motion.div
            className="p-4 rounded-xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search with animated focus effect */}
              <motion.div
                className="relative flex-grow"
                animate={
                  isSearchFocused
                    ? {
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }
                    : {
                        scale: 1,
                        transition: { duration: 0.2 },
                      }
                }
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 rounded-lg h-11 text-black dark:text-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {isSearchFocused && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: 1.02,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>

              {/* Mobile Filter Button with animated icon */}
              <motion.div className="md:hidden" whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-800/80 border-gray-200/50 text-black dark:text-white dark:border-gray-700/50"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  <motion.div
                    animate={{ rotate: isFilterOpen ? 180 : 0 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>

              {/* Desktop Filters with hover animations */}
              <div className="hidden md:flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "tween", stiffness: 400, damping: 10 }}
                >
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white h-11 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                      {categoriesFilter.map((category) => (
                        <SelectItem
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "tween", stiffness: 400, damping: 10 }}
                >
                  <Select
                    value={selectedOrganizer}
                    onValueChange={setSelectedOrganizer}
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white h-11 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200">
                      <SelectValue placeholder="Organizer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                      {organizersFilter.map((organizer) => (
                        <SelectItem
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          key={organizer.id}
                          value={organizer.id}
                        >
                          {organizer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </div>

            {/* Mobile Filters (Collapsible) with enhanced animations */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="md:hidden overflow-hidden mt-3"
                >
                  <div className="flex flex-col gap-3 pt-2 px-1">
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/50 text-black dark:text-white hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                          {categoriesFilter.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                    >
                      <Select
                        value={selectedOrganizer}
                        onValueChange={setSelectedOrganizer}
                      >
                        <SelectTrigger className="w-full bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/50 text-black dark:text-white hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200">
                          <SelectValue placeholder="Organizer" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
                          {organizersFilter.map((organizer) => (
                            <SelectItem
                              key={organizer.id}
                              value={organizer.id}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              {organizer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Events Grid with staggered animations */}
        <div className="mb-8">
          {filteredEvents.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {currentEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.05,
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    }}
                    whileHover={{
                      scale: 1.03,
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className="p-1 transition-all duration-200"
                  >
                    <motion.div
                      whileHover={{
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                      }}
                      className="h-full rounded-xl overflow-hidden"
                    >
                      <EventCard
                        event={event}
                        className="w-full h-full"
                        onView={(id) => router.push(`/events/${id}`)}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination with hover effects */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-12 flex justify-center"
                >
                  <Pagination>
                    <PaginationContent className="flex items-center gap-1">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            className={`rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }`}
                          />
                        </PaginationItem>
                      </motion.div>

                      {getPaginationRange().map((page, i) => (
                        <React.Fragment key={i}>
                          {page === "ellipsis-start" ||
                          page === "ellipsis-end" ? (
                            <PaginationItem>
                              <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                            </PaginationItem>
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17,
                              }}
                            >
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setCurrentPage(Number(page))}
                                  isActive={currentPage === page}
                                  className={`cursor-pointer h-9 w-9 rounded-md flex items-center justify-center transition-all duration-200 ${
                                    currentPage === page
                                      ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-200 dark:shadow-blue-900/20"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </motion.div>
                          )}
                        </React.Fragment>
                      ))}

                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={`rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white transition-colors ${
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }`}
                          />
                        </PaginationItem>
                      </motion.div>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Calendar className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-6" />
              </motion.div>
              <motion.h3
                className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                No events found
              </motion.h3>
              <motion.p
                className="text-gray-500 dark:text-gray-400 max-w-md mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                We couldn&apos;t find any events matching your search criteria.
                Try adjusting your filters or search query.
              </motion.p>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="h-11 px-6 bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-md hover:shadow-lg transition-all duration-150 hover:scale-105"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedOrganizer("all");
                  }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* Footer with fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default StudentSideEventsPage;
