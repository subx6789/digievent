"use client";
import React, { useEffect, useState } from "react";
import EventCard from "@/components/Card/EventCard";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event";
import { eventStates } from "@/utils/data/eventStates";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEventsStore } from "@/store/eventsStore";

const OrganizerEvents = () => {
  // Use Zustand store instead of local state
  const {
    events,
    isLoading,
    error,
    updateEvent,
    fetchEvents,
    getFilteredEvents,
  } = useEventsStore();
  const [selectedState, setSelectedState] = useState("approved"); // Default filter state
  const { toast } = useToast();
  const router = useRouter();

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Navigate to create event page
  const handleCreateEvent = () => {
    router.push("/organizer/dashboard/events/request-event");
  };

  // Handle edit event - navigate to edit page with event ID
  const handleEditEvent = (event: Event) => {
    router.push(`/organizer/dashboard/events/edit/${event.id}`);
  };

  // Handle view event details
  const handleViewEvent = (eventId: string) => {
    router.push(`/organizer/dashboard/events/${eventId}`);
  };

  // Improved cancel event handler with confirmation and feedback
  const handleCancelEvent = (eventId: string) => {
    const eventToCancel = events.find((event) => event.id === eventId);

    if (eventToCancel) {
      // Update event status to cancelled in Zustand store
      const updatedEvent: Event = { ...eventToCancel, progress: "cancelled" };
      updateEvent(updatedEvent);

      toast({
        title: "Event Cancelled",
        description: `${eventToCancel.title} has been successfully cancelled.`,
        variant: "destructive",
      });
    }
  };

  // Get filtered events based on selected state
  const filteredEvents = getFilteredEvents(selectedState);

  return (
    <Sidebar role="organizer">
      <Header onAddClick={handleCreateEvent} />
      <div className="my-5 space-y-6">
        <div className="w-full">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row md:justify-end items-center gap-4 mt-4 md:mt-0">
            {/* Event State Filter */}
            <Select
              defaultValue="approved"
              value={selectedState}
              onValueChange={setSelectedState}
            >
              <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div className="flex items-center gap-3">
                  <Calendar className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue
                    placeholder="Select Event State"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                {eventStates.map((state, index) => (
                  <SelectItem
                    value={state.id}
                    key={index}
                    className="cursor-pointer"
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-500">
              {error}. Please try refreshing the page.
            </p>
          </div>
        ) : (
          /* Events Section with conditional rendering for no results */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-1 hover:drop-shadow-lg transition-all duration-150"
                >
                  <EventCard
                    event={event}
                    className="w-full max-w-sm mx-auto"
                    onEdit={handleEditEvent}
                    onView={handleViewEvent}
                    onCancel={handleCancelEvent}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No events match the selected filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default OrganizerEvents;
