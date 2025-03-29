/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Course } from "@/types/course";
import { courses as mockCourses } from "@/utils/data/courses";

interface CoursesState {
  // Collection state
  courses: Course[];
  isLoading: boolean;
  error: string | null;

  // Collection actions
  fetchCourses: () => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  addCourse: (course: Course) => void;
  updateCourse: (updatedCourse: Course) => void;
  removeCourse: (id: string) => void;
}

export const useCoursesStore = create<CoursesState>()((set, get) => ({
  // Initial state
  courses: [],
  isLoading: false,
  error: null,

  // Fetch courses - will be replaced with API call
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ courses: mockCourses, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch courses", isLoading: false });
    }
  },

  // Get course by ID
  getCourseById: (id) => {
    const state = get();
    return state.courses.find((course) => course.id === id);
  },

  // Add course
  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses, course],
    })),

  // Update existing course
  updateCourse: (updatedCourse) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      ),
    })),

  // Remove course
  removeCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    })),
}));
