"use client";
import React, { useState } from "react";
import EventCard from "@/components/Card/EventCard";
import Header from "@/components/Header/Header";
import AddEventModal from "@/components/Modals/AddEventModal";
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
import { useToast } from "@/components/ui/use-toast";

const OrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>(organizerEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  // Handle edit event - populates modal with event data
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle view event details
  const handleViewEvent = (eventId: string) => {
    // For now, just show a toast notification
    const event = events.find((e) => e.id === eventId);
    toast({
      title: "View Event",
      description: `Viewing ${event?.title} details. This functionality will be implemented later.`,
    });
  };

  // Add a new event to the list
  const handleAddEvent = (newEvent: Event) => {
    if (isEditMode && selectedEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...newEvent, id: event.id } : event
      );
      setEvents(updatedEvents);
      toast({
        title: "Event Updated",
        description: `${newEvent.title} has been successfully updated.`,
        variant: "default",
      });
    } else {
      // Add new event
      setEvents([newEvent, ...events]);
    }
  };

  return (
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
                    placeholder="Select Event State"
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
              <EventCard
                event={event}
                className="w-full max-w-sm mx-auto"
                onEdit={handleEditEvent}
                onView={handleViewEvent}
              />
            </div>
          ))}
        </div>

        {/* Modified AddEventModal with edit capability */}
        {isModalOpen && (
          <ModifiedAddEventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddEvent={handleAddEvent}
            editEvent={selectedEvent}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </Sidebar>
  );
};

// Modified AddEventModal component wrapper to handle edit functionality
interface ModifiedAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
  editEvent: Event | null;
  isEditMode: boolean;
}

const ModifiedAddEventModal: React.FC<ModifiedAddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
  editEvent,
  isEditMode,
}) => {
  return (
    <AddEventModal
      isOpen={isOpen}
      onClose={onClose}
      onAddEvent={onAddEvent}
      editEvent={editEvent}
      isEditMode={isEditMode}
    />
  );
};

export default OrganizerEvents;
