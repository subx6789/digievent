import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Event } from "@/types/event";
import { organizerEvents } from "@/utils/data/organizerEvents";

interface EventsState {
  // Collection state
  events: Event[];
  
  // Collection actions
  initializeEvents: () => void;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Event) => void;
  updateEvent: (updatedEvent: Event) => void;
  removeEvent: (id: string) => void;
  getFilteredEvents: (status: string) => Event[];
}

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      
      // Initialize events with sample data if empty
      initializeEvents: () => {
        const state = get();
        if (state.events.length === 0) {
          set({ events: organizerEvents });
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
    }),
    {
      name: "events-storage",
      partialize: (state) => ({
        events: state.events,
      }),
    }
  )
);