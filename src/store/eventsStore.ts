/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Event } from "@/types/event";
import { organizerEvents } from "@/utils/data/organizerEvents";

interface EventsState {
  // Collection state
  events: Event[];
  isLoading: boolean;
  error: string | null;

  // Collection actions
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Event) => void;
  updateEvent: (updatedEvent: Event) => void;
  removeEvent: (id: string) => void;
  getFilteredEvents: (status: string) => Event[];
}

export const useEventsStore = create<EventsState>()((set, get) => ({
  // Initial state
  events: [],
  isLoading: false,
  error: null,

  // Fetch events - will be replaced with API call
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ events: organizerEvents, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch events", isLoading: false });
    }
  },

  // Get event by ID
  getEventById: (id) => {
    const state = get();
    return state.events.find((event) => event.id === id);
  },

  // Add event to events array
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  // Update existing event
  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    })),

  // Remove event
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),

  // Get filtered events based on status
  getFilteredEvents: (status) => {
    const state = get();
    return status === "all"
      ? state.events
      : state.events.filter((event) => event.status === status);
  },
}));
