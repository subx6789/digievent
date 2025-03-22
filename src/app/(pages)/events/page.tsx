"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  User,
  LogOut,
  History,
  ChevronDown,
  TicketCheck,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import { landing_content } from "@/utils/data/landing_content";

// Mock data for filters
const categories = [
  { id: "all", name: "All Categories" },
  { id: "educational", name: "Educational" },
  { id: "fun", name: "Fun" },
  { id: "gaming", name: "Gaming" },
  { id: "business", name: "Business" },
];

const organizers = [
  { id: "all", name: "All Organizers" },
  { id: "gdsc", name: "GDSC" },
  { id: "vivarta", name: "Vivarta" },
  { id: "takshila", name: "Takshila" },
  { id: "debate", name: "Debate" },
];

// Mock student data
const studentData = {
  name: "Subhajit Sarkar",
  email: "ss@gmail.com",
  avatar: undefined,
};

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

  // Handle logout
  const handleLogout = () => {
    router.push("/login");
  };

  // Handle view profile
  const handleViewProfile = () => {
    router.push("/student/profile");
  };

  // Handle booking history
  const handleBookingHistory = () => {
    router.push("/student/bookings");
  };

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 h-20 flex items-center justify-center">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <TicketCheck className="h-5 w-5" />
                </div>
                <span className="text-xl">Digievent</span>
              </motion.div>
            </Link>

            {/* User Menu and Theme Toggle */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ModeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-md p-0">
                    <Avatar className="h-9 w-9 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 rounded-md">
                      <AvatarImage
                        src={studentData.avatar}
                        alt={studentData.name}
                        className="object-cover rounded-md"
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-md">
                        {studentData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 p-2">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {studentData.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {studentData.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 py-2"
                    onClick={handleViewProfile}
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 py-2"
                    onClick={handleBookingHistory}
                  >
                    <History className="h-4 w-4" />
                    <span>Booking History</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 py-2 text-red-500 dark:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto pb-4 px-4 md:pt-32 pt-28">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upcoming Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and register for exciting events happening in your college
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-11 text-black dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white h-11 cursor-pointer">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedOrganizer}
                onValueChange={setSelectedOrganizer}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white h-11 cursor-pointer">
                  <SelectValue placeholder="Organizer" />
                </SelectTrigger>
                <SelectContent>
                  {organizers.map((organizer) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={organizer.id}
                      value={organizer.id}
                    >
                      {organizer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters (Collapsible) */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden mt-3"
              >
                <div className="flex flex-col gap-3 pt-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedOrganizer}
                    onValueChange={setSelectedOrganizer}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white">
                      <SelectValue placeholder="Organizer" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizers.map((organizer) => (
                        <SelectItem key={organizer.id} value={organizer.id}>
                          {organizer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Events Grid */}
        <div className="mb-8">
          {filteredEvents.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {currentEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-1 hover:drop-shadow-lg transition-all duration-150"
                  >
                    <EventCard
                      event={event}
                      className="w-full h-full"
                      onView={(id) => router.push(`/events/${id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-10 flex justify-center"
                >
                  <Pagination>
                    <PaginationContent className="flex items-center gap-1">
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

                      {getPaginationRange().map((page, i) => (
                        <React.Fragment key={i}>
                          {page === "ellipsis-start" ||
                          page === "ellipsis-end" ? (
                            <PaginationItem>
                              <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                            </PaginationItem>
                          ) : (
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
                          )}
                        </React.Fragment>
                      ))}

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
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                We couldn&apos;t find any events matching your search criteria.
                Try adjusting your filters or search query.
              </p>
              <Button
                variant="outline"
                className="mt-4 h-11 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-150"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedOrganizer("all");
                }}
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white mr-2">
                <TicketCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {landing_content.navigation.logo}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {landing_content.footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentSideEventsPage;
