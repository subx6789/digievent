// File: @/types/event.ts

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "free" | "paid";
  time: string;
  venue?: string;
  organizer: string;
  price?: string;
  category: string;
  image: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  capacity: string;
  eventType: "physical" | "virtual";
  createdAt?: string;
  virtualLink?: string;
}
