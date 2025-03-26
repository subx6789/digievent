import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Event } from "@/types/event";
import { organizerEvents } from "@/utils/data/organizerEvents";

interface EventFormState {
  formData: Partial<Event>;
  events: Event[];
  setFormData: (data: Partial<Event>) => void;
  updateField: <K extends keyof Event>(key: K, value: Event[K]) => void;
  resetFormData: () => void;
  // Add these new methods
  updateEvent: (event: Event) => void;
  getEventById: (id: string) => Event | undefined;
  addEvent: (event: Event) => void;
  initializeEvents: () => void; // Add this function
}

// Initial form data
const initialFormData: Partial<Event> = {
  status: "pending",
  isFree: true,
  dayType: "single day",
  eventType: "physical",
  clubName: "My Club",
  course: [],
  department: [],
  year: [],
};

export const useEventFormStore = create<EventFormState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      events: organizerEvents,

      setFormData: (data) => set({ formData: data }),

      updateField: (key, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [key]: value,
          },
        })),

      resetFormData: () => set({ formData: initialFormData }),

      // Add event to events array
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),

      // Get event by ID
      getEventById: (id) => {
        const state = get();
        return state.events.find((event) => event.id === id);
      },

      // Update existing event
      updateEvent: (updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        })),
      // Initialize events with sample data if empty
      initializeEvents: () => {
        const state = get();
        if (state.events.length === 0) {
          set({ events: organizerEvents });
        }
      },
    }),
    {
      name: "event-form-storage",
      partialize: (state) => ({
        formData: state.formData,
        events: state.events,
      }),
    }
  )
);
