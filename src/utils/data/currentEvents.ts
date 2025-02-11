import { EventTable } from "@/types/eventTable";
import { getRandomImage } from "./imageUrls";

function formatDate(date: number): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const d = new Date(date);
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
}

export const currentEvents: EventTable[] = [
  {
    id: "1",
    name: "Tech Summit 2024",
    organizer: "GDSC",
    date: formatDate(Date.now()),
    category: "Educational",
    ticketsSold: "450/500",
    revenue: 0,
    status: "Active",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
  },
  {
    id: "2",
    name: "Music Festival",
    organizer: "Sanskaran",
    date: formatDate(Date.now()),
    category: "Fun",
    ticketsSold: "280/300",
    revenue: 52870,
    status: "Active",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
  },
  {
    id: "3",
    name: "Gaming Workshop",
    organizer: "GamersHub",
    date: formatDate(Date.now()),
    category: "Gaming",
    ticketsSold: "180/200",
    revenue: 0,
    status: "Active",
    image: getRandomImage("Gaming") || "/Placeholder/event-placeholder.jpg",
  },
  {
    id: "4",
    name: "AI Conference",
    organizer: "TechCorp",
    date: formatDate(Date.now()),
    category: "Educational",
    ticketsSold: "290/300",
    revenue: 7450,
    status: "Active",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
  },
  {
    id: "5",
    name: "Art Exhibition",
    organizer: "ArtSpace",
    date: formatDate(Date.now()),
    category: "Fun",
    ticketsSold: "150/200",
    revenue: 7540,
    status: "Active",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
  },
];
