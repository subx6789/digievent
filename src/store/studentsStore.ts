/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Student } from "@/types/student";
import { students as mockStudents } from "@/utils/data/studentList";

interface StudentsState {
  // Collection state
  students: Student[];
  isLoading: boolean;
  error: string | null;

  // Collection actions
  fetchStudents: () => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  addStudent: (student: Student) => void;
  updateStudent: (updatedStudent: Student) => void;
  removeStudent: (id: string) => void;
  searchStudents: (query: string) => Student[];
}

export const useStudentsStore = create<StudentsState>()((set, get) => ({
  // Initial state
  students: [],
  isLoading: false,
  error: null,

  // Fetch students - will be replaced with API call
  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ students: mockStudents, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch students", isLoading: false });
    }
  },

  // Get student by ID
  getStudentById: (id) => {
    const state = get();
    return state.students.find((student) => student.id === id);
  },

  // Add student
  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),

  // Update existing student
  updateStudent: (updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      ),
    })),

  // Remove student
  removeStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
    })),

  // Search students by name, email, or roll number
  searchStudents: (query) => {
    const state = get();
    const lowercaseQuery = query.toLowerCase();
    return state.students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowercaseQuery) ||
        student.email.toLowerCase().includes(lowercaseQuery) ||
        student.rollno.toLowerCase().includes(lowercaseQuery)
    );
  },
}));
