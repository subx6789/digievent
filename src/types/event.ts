import { Organizer } from "./organizer";
import { Student } from "./student";

// Update the Event interface to match the new requirements
export interface Event {
  id: string;
  title: string;
  description: string;
  dayType: "single day" | "multi day";
  date?: string; // Only for single day events
  dateRange?: string; // Only for multi-day events
  time: string; // In 12 hrs format
  duration: string; // In hours
  isFree: boolean;
  price?: string; // Only if isFree is false
  eventType: "physical" | "virtual";
  venue?: string; // Only if eventType is physical
  virtualLink?: string; // Only if eventType is virtual
  coverImage: string; // Landscape image
  clubName: string; // Organization name
  category: string; // Event category
  status: "pending" | "approved" | "rejected";
  capacity: string; // Number of seats
  course: string[]; // Array of courses
  department: string[]; // Array of departments
  year: string[]; // Array of years
  createdAt?: string;
  organizer: Organizer;
  progress: "active" | "completed" | "upcoming" | "cancelled" | "none";
  studentsBooked: Student[] | null;
}
