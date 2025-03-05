// File: @/types/event.ts

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "free" | "paid";
  time: string;
  location?: string;
  organiser: string;
  price?: string;
  category: string;
  image: string;
  status: "pending" | "approved" | "rejected";
  capacity: string;
  eventType: "physical" | "virtual";
  pdfDetails?: string | null;
}
