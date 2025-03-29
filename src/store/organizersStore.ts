/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Organizer } from "@/types/organizer";
import { organizers as mockOrganizers } from "@/utils/data/organizers";

interface OrganizersState {
  // Collection state
  organizers: Organizer[];
  isLoading: boolean;
  error: string | null;

  // Collection actions
  fetchOrganizers: () => Promise<void>;
  getOrganizerById: (id: string) => Organizer | undefined;
  addOrganizer: (organizer: Organizer) => void;
  updateOrganizer: (updatedOrganizer: Organizer) => void;
  removeOrganizer: (id: string) => void;
}

export const useOrganizersStore = create<OrganizersState>()((set, get) => ({
  // Initial state
  organizers: [],
  isLoading: false,
  error: null,

  // Fetch organizers - will be replaced with API call
  fetchOrganizers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Ensure mockOrganizers have role explicitly set to "organizer"
      const validOrganizers = mockOrganizers.map((org) => ({
        ...org,
        role: "organizer" as const,
      }));
      set({ organizers: validOrganizers, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch organizers", isLoading: false });
    }
  },

  // Get organizer by ID
  getOrganizerById: (id) => {
    const state = get();
    return state.organizers.find((organizer) => organizer.id === id);
  },

  // Add organizer
  addOrganizer: (organizer) =>
    set((state) => ({
      organizers: [...state.organizers, organizer],
    })),

  // Update existing organizer
  updateOrganizer: (updatedOrganizer) =>
    set((state) => ({
      organizers: state.organizers.map((organizer) =>
        organizer.id === updatedOrganizer.id ? updatedOrganizer : organizer
      ),
    })),

  // Remove organizer
  removeOrganizer: (id) =>
    set((state) => ({
      organizers: state.organizers.filter((organizer) => organizer.id !== id),
    })),
}));
