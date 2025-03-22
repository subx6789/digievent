import { Event } from "@/types/event";
import { getRandomImage } from "./imageUrls";

export const organizerEvents: Event[] = [
  {
    id: "1",
    title: "Vivarta Fest 2025",
    description:
      "A vibrant fest featuring games, music, and cultural activities, organized by Vivarta. Join us for a day of fun, entertainment, and networking with fellow students and professionals.",
    date: "Mar 22, 2025",
    type: "free",
    time: "10:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "Free",
    category: "Fun",
    organizer: "Vivarta",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-01-15T10:30:00Z",
    virtualLink: "",
  },
  {
    id: "2",
    title: "Sanskaran Music Night",
    description:
      "A music event featuring performances by local artists, organized by Sanskaran. Experience the magic of live music with talented performers from across the region.",
    date: "Apr 10, 2025",
    type: "free",
    time: "6:00 PM IST",
    venue: "Salt Lake Stadium Area, Kolkata",
    price: "Free",
    category: "Fun",
    organizer: "Sanskaran",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-01-20T14:45:00Z",
    virtualLink: "",
  },
  {
    id: "3",
    title: "Tech Hackathon 2025",
    description:
      "A 48-hour hackathon where tech enthusiasts will solve real-world problems, organized by Takshila. Form teams, brainstorm ideas, and develop innovative solutions to win exciting prizes.",
    date: "May 18, 2025",
    type: "free",
    time: "9:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "Free",
    category: "Educational",
    organizer: "Takshila",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-02-05T09:15:00Z",
    virtualLink: "",
  },
  {
    id: "4",
    title: "Alpha Dancers Dance Battle",
    description:
      "An exciting dance battle where participants show off their best moves, hosted by Alpha Dancers. Witness breathtaking performances and vote for your favorite dancers.",
    date: "Jun 5, 2025",
    type: "paid",
    time: "4:00 PM IST",
    venue: "Salt Lake Sector V, Kolkata",
    price: "489",
    category: "Fun",
    organizer: "Alpha Dancers",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-02-15T16:30:00Z",
    virtualLink: "",
  },
  {
    id: "5",
    title: "GDSC Developer Meetup",
    description:
      "A tech meetup with workshops and networking for developers, organized by GDSC. Learn about the latest technologies, participate in hands-on sessions, and connect with industry experts.",
    date: "Jul 20, 2025",
    type: "paid",
    time: "11:00 AM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "429",
    category: "Educational",
    organizer: "GDSC",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-03-01T11:00:00Z",
    virtualLink: "",
  },
  {
    id: "6",
    title: "Vivarta College Fest",
    description:
      "The biggest college fest of the year, filled with music, games, and fun activities, organized by Vivarta. Experience a day of celebration with various competitions, performances, and food stalls.",
    date: "Aug 12, 2025",
    type: "paid",
    time: "2:00 PM IST",
    venue: "Techno India University, Salt Lake, Kolkata",
    price: "599",
    category: "Fun",
    organizer: "Vivarta",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "300",
    eventType: "physical",
    status: "approved",
    createdAt: "2024-03-10T13:45:00Z",
    virtualLink: "",
  },
  {
    id: "7",
    title: "Prom Night",
    description:
      "An elegant evening of dancing, music, and celebration. Dress in your finest attire and enjoy a memorable night with friends and classmates. Includes dinner, DJ, and photo booth.",
    date: "Aug 12, 2025",
    type: "paid",
    time: "7:00 PM IST",
    venue: "The Lalit Great Eastern, Kolkata",
    price: "1299",
    category: "Fun",
    organizer: "Vivarta",
    image: getRandomImage("Fun") || "/Placeholder/event-placeholder.jpg",
    capacity: "200",
    eventType: "physical",
    status: "pending",
    createdAt: "2024-03-15T18:30:00Z",
    virtualLink: "",
  },
  {
    id: "8",
    title: "AI Workshop: Gemini 2.0",
    description:
      "Learn about the latest advancements in AI with Google's Gemini 2.0. This virtual workshop covers practical applications, hands-on exercises, and future trends in artificial intelligence.",
    date: "Sep 5, 2025",
    type: "paid",
    time: "10:00 AM IST",
    venue: "Virtual",
    price: "799",
    category: "Educational",
    organizer: "TechMinds",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "500",
    eventType: "virtual",
    status: "rejected",
    createdAt: "2024-03-20T09:15:00Z",
    virtualLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "9",
    title: "Core Software Engineering Seminar",
    description:
      "A comprehensive seminar on software engineering principles, best practices, and career opportunities. Industry experts will share insights on current trends and future directions.",
    date: "Oct 15, 2025",
    type: "free",
    time: "2:00 PM IST",
    venue: "Virtual",
    price: "Free",
    category: "Educational",
    organizer: "CodeCrafters",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "400",
    eventType: "virtual",
    status: "rejected",
    createdAt: "2024-03-25T14:00:00Z",
    virtualLink: "https://zoom.us/j/123456789",
  },
  {
    id: "10",
    title: "Blockchain Technology Summit",
    description:
      "Explore the world of blockchain technology, cryptocurrencies, and decentralized applications. Learn from industry leaders and participate in interactive sessions on blockchain implementation.",
    date: "Nov 8, 2025",
    type: "paid",
    time: "9:30 AM IST",
    venue: "JW Marriott, Kolkata",
    price: "1499",
    category: "Educational",
    organizer: "BlockchainHub",
    image:
      getRandomImage("Educational") || "/Placeholder/event-placeholder.jpg",
    capacity: "250",
    eventType: "physical",
    status: "pending",
    createdAt: "2024-04-01T10:30:00Z",
    virtualLink: "",
  },
  {
    id: "11",
    title: "Virtual Gaming Tournament",
    description:
      "Compete in a multi-game tournament featuring popular titles like Valorant, CS:GO, and League of Legends. Show off your skills and win exciting prizes including gaming gear and cash rewards.",
    date: "Dec 3, 2025",
    type: "paid",
    time: "11:00 AM IST",
    venue: "Virtual",
    price: "349",
    category: "Gaming",
    organizer: "GamersUnite",
    image: getRandomImage("Gaming") || "/Placeholder/event-placeholder.jpg",
    capacity: "1000",
    eventType: "virtual",
    status: "approved",
    createdAt: "2024-04-10T15:45:00Z",
    virtualLink: "https://discord.gg/gamerstournament",
  },
];
