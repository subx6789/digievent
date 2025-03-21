import { Event } from "@/types/event";
import { getRandomImage } from "./imageUrls";

export const eventRequests: Event[] = [
  {
    id: "1",
    title: "Vivarta Fest 2025",
    description:
      "A vibrant fest featuring games, music, and cultural activities, organized by Vivarta.",
    date: "Mar 22, 2025",
    type: "free",
    time: "10:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "Free", // Free event
    category: "Fun",
    organizer: "Vivarta",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
  {
    id: "2",
    title: "Sanskaran Music Night",
    description:
      "A music event featuring performances by local artists, organized by Sanskaran.",
    date: "Apr 10, 2025",
    type: "free",
    time: "6:00 PM IST",
    venue: "Salt Lake Stadium Area, Kolkata",
    price: "Free", // Free event
    category: "Fun",
    organizer: "Sanskaran",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
  {
    id: "3",
    title: "Tech Hackathon 2025",
    description:
      "A 48-hour hackathon where tech enthusiasts will solve real-world problems, organized by Takshila.",
    date: "May 18, 2025",
    type: "free",
    time: "9:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "Free", // Free event
    category: "Educational",
    organizer: "Takshila",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
  {
    id: "4",
    title: "Alpha Dancers Dance Battle",
    description:
      "An exciting dance battle where participants show off their best moves, hosted by Alpha Dancers.",
    date: "Jun 5, 2025",
    time: "4:00 PM IST",
    type: "paid",
    venue: "Salt Lake Sector V, Kolkata",
    price: "489", // Paid event
    category: "Fun",
    organizer: "Alpha Dancers",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
  {
    id: "5",
    title: "GDSC Developer Meetup",
    description:
      "A tech meetup with workshops and networking for developers, organized by GDSC.",
    date: "Jul 20, 2025",
    type: "paid",
    time: "11:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "429", // Paid event
    category: "Educational",
    organizer: "GDSC",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
  {
    id: "6",
    title: "Vivarta College Fest",
    description:
      "The biggest college fest of the year, filled with music, games, and fun activities, organized by Vivarta.",
    date: "Aug 12, 2025",
    type: "paid",
    time: "2:00 PM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "599", // Paid event
    category: "Fun",
    organizer: "Vivarta",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
  },
];
