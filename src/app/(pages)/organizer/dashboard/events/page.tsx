"use client";
import EventCard from "@/components/Card/EventCard";
import Header from "@/components/Header/Header";
import AddEventModal from "@/components/Modals/AddEventModal";
// import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event";
import { eventStates } from "@/utils/data/eventStates";
import { organizerEvents } from "@/utils/data/organizerEvents";
import { Calendar } from "lucide-react";
import React, { useState } from "react";

const OrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>(organizerEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add a new event to the list
  const handleAddEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };

  return (
    // <ProtectedRoute requiredRole="organizer"></ProtectedRoute>
    <Sidebar role="organizer">
      <Header onAddClick={handleOpenModal} />
      <div className="my-5 space-y-6">
        <div className="w-full">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row md:justify-end items-center gap-4 mt-4 md:mt-0">
            {/* Event State Filter */}
            <Select defaultValue="approved">
              <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div className="flex items-center gap-3">
                  <Calendar className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue
                    placeholder="Select College"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {eventStates.map((state, index) => (
                  <SelectItem value={state.id} key={index}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button className="bg-blue-600 h-11 hover:bg-blue-700 text-white px-8 font-medium transition-all duration-150 hover:scale-105 w-full md:w-auto">
              Filter
            </Button>
          </div>
        </div>

        {/* Events Section */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-1 hover:drop-shadow-lg transition-all duration-150"
            >
              <EventCard event={event} className="w-full max-w-sm mx-auto" />
            </div>
          ))}
        </div>

        <AddEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddEvent={handleAddEvent}
        />
      </div>
    </Sidebar>
  );
};

export default OrganizerEvents;
