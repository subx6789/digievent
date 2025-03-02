import { getRandomImage } from "./imageUrls";

// Unique ID generator function
function generateEventId(name: string, category: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const hash = Array.from(name + category)
    .reduce((acc, char) => Math.imul(31, acc) + char.charCodeAt(0), 0)
    .toString(16)
    .slice(-4);
  return `${category.slice(0, 3)}-${slug}-${hash}`;
}

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
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export const allEvents = {
  present: [
    {
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
      name: "Art Exhibition",
      organizer: "ArtSpace",
      date: formatDate(Date.now()),
      category: "Fun",
      ticketsSold: "150/200",
      revenue: 7540,
      status: "Active",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
  ].map((event) => ({
    ...event,
    id: generateEventId(event.name, "present"),
  })),

  past: [
    {
      name: "AI Challenge",
      organizer: "Takshila",
      date: "Oct 10, 2024",
      category: "Educational",
      ticketsSold: "95/150",
      revenue: 0,
      status: "Completed",
      image:
        getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Jazz Night",
      organizer: "Sanskaran",
      date: "Oct 12, 2024",
      category: "Fun",
      ticketsSold: "200/295",
      revenue: 44690,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Hackathon X",
      organizer: "Takshila",
      date: "Nov 5, 2024",
      category: "Educational",
      ticketsSold: "250/280",
      revenue: 0,
      status: "Completed",
      image:
        getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Dance Revolution",
      organizer: "Alpha Dancers",
      date: "Nov 8, 2024",
      category: "Fun",
      ticketsSold: "100/250",
      revenue: 34500,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Startup Networking Night",
      organizer: "GDSC",
      date: "Nov 15, 2024",
      category: "Business",
      ticketsSold: "100/285",
      revenue: 0,
      status: "Completed",
      image: getRandomImage("Business") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Creative Minds Fest",
      organizer: "Vivarta",
      date: "Dec 1, 2024",
      category: "Fun",
      ticketsSold: "250/290",
      revenue: 0,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Music Fest",
      organizer: "Sanskaran",
      date: "Dec 5, 2024",
      category: "Fun",
      ticketsSold: "105/250",
      revenue: 56780,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Annual Dance Battle",
      organizer: "Alpha Dancers",
      date: "Dec 8, 2024",
      category: "Fun",
      ticketsSold: "220/280",
      revenue: 35080,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "AI and Robotics Expo",
      organizer: "Takshila",
      date: "Dec 12, 2024",
      category: "Educational",
      ticketsSold: "85/200",
      revenue: 0,
      status: "Completed",
      image:
        getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Food & Culture Fest",
      organizer: "Vivarta",
      date: "Dec 20, 2024",
      category: "Fun",
      ticketsSold: "135/280",
      revenue: 0,
      status: "Completed",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
  ].map((event) => ({
    ...event,
    id: generateEventId(event.name, "past"),
  })),

  upcoming: [
    {
      name: "AI Bootcamp",
      organizer: "Takshila",
      date: "Feb 2, 2025",
      category: "Educational",
      ticketsSold: "100/250",
      revenue: 0,
      status: "Scheduled",
      image:
        getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Music Gala",
      organizer: "Sanskaran",
      date: "Feb 5, 2025",
      category: "Fun",
      ticketsSold: "150/280",
      revenue: 30670,
      status: "Scheduled",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Dance Fest",
      organizer: "Alpha Dancers",
      date: "Feb 15, 2025",
      category: "Fun",
      ticketsSold: "200/250",
      revenue: 47900,
      status: "Scheduled",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Tech Talk",
      organizer: "GDSC",
      date: "Feb 20, 2025",
      category: "Business",
      ticketsSold: "50/150",
      revenue: 0,
      status: "Scheduled",
      image: getRandomImage("Business") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Startup Weekend",
      organizer: "Vivarta",
      date: "Mar 1, 2025",
      category: "Business",
      ticketsSold: "100/150",
      revenue: 0,
      status: "Scheduled",
      image: getRandomImage("Business") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Code Hack",
      organizer: "Takshila",
      date: "Mar 10, 2025",
      category: "Gaming",
      ticketsSold: "80/200",
      revenue: 0,
      status: "Scheduled",
      image: getRandomImage("Gaming") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Live Music Concert",
      organizer: "Sanskaran",
      date: "Mar 15, 2025",
      category: "Fun",
      ticketsSold: "120/250",
      revenue: 64700,
      status: "Scheduled",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Innovation Expo",
      organizer: "Vivarta",
      date: "Mar 20, 2025",
      category: "Educational",
      ticketsSold: "50/250",
      revenue: 0,
      status: "Scheduled",
      image:
        getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Virtual Dance Party",
      organizer: "Alpha Dancers",
      date: "Apr 5, 2025",
      category: "Fun",
      ticketsSold: "100/250",
      revenue: 7560,
      status: "Scheduled",
      image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    },
    {
      name: "Robotics Championship",
      organizer: "Takshila",
      date: "Apr 15, 2025",
      category: "Gaming",
      ticketsSold: "150/250",
      revenue: 0,
      status: "Scheduled",
      image: getRandomImage("Gaming") || "/Placeholder/event-placeholder.jpg",
    },
  ].map((event) => ({
    ...event,
    id: generateEventId(event.name, "upcoming"),
  })),
};
