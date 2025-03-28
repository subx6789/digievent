import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Event } from "@/types/event";

interface EventFormState {
  // Form data
  formData: Partial<Event>;
  currentStep: number;
  isFormComplete: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSaved: string | null;

  // Form actions
  setFormData: (data: Partial<Event>) => void;
  updateField: <K extends keyof Event>(key: K, value: Event[K]) => void;
  resetFormData: () => void;
  setCurrentStep: (step: number) => void;
  setIsFormComplete: (isComplete: boolean) => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setLastSaved: (time: string | null) => void;
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
    (set) => ({
      // Initial state
      formData: initialFormData,
      currentStep: 0,
      isFormComplete: false,
      saveStatus: "idle",
      lastSaved: null,

      // Set entire form data
      setFormData: (data) => set({ formData: data }),

      // Update a single field
      updateField: (key, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [key]: value,
          },
          saveStatus: "saving",
        })),

      // Reset form to initial state
      resetFormData: () =>
        set({
          formData: initialFormData,
          currentStep: 0,
          isFormComplete: false,
          saveStatus: "idle",
          lastSaved: null,
        }),

      // Set current form step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Set form completion status
      setIsFormComplete: (isComplete) => set({ isFormComplete: isComplete }),

      // Set save status
      setSaveStatus: (status) => set({ saveStatus: status }),

      // Set last saved timestamp
      setLastSaved: (time) => set({ lastSaved: time }),
    }),
    {
      name: "event-form-storage",
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        isFormComplete: state.isFormComplete,
      }),
    }
  )
);
