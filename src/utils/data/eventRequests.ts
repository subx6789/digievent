import { Event } from "@/types/event";
import { getRandomImage } from "./imageUrls";

export const eventRequests: Event[] = [
  {
    id: "1",
    title: "Vivarta Fest 2025",
    description:
      "A vibrant fest featuring games, music, and cultural activities, organized by Vivarta. Join us for a day of fun, entertainment, and networking with fellow students and professionals.",
    dayType: "single day",
    date: "Mar 22, 2025",
    time: "10:00 AM IST",
    duration: "8",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "Techno India University, Salt Lake, Kolkata",
    coverImage: getRandomImage("Fun") || "/Placeholder/event-cover.jpg",
    eventPoster: getRandomImage("Fun") || "/Placeholder/event-poster.jpg",
    clubName: "Vivarta Cultural Club",
    category: "Fun",
    organizer: "Vivarta",
    capacity: "300",
    status: "pending",
    course: ["B.Tech", "BCA", "BBA", "M.Tech"],
    department: ["CSE", "IT", "ECE", "EE", "ME"],
    year: ["1st Year", "2nd Year", "3rd Year", "4th Year"],

    createdAt: "2024-05-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Sanskaran Music Night",
    description:
      "A music event featuring performances by local artists, organized by Sanskaran. Experience the magic of live music with talented performers from across the region.",
    dayType: "single day",
    date: "Apr 10, 2025",
    time: "6:00 PM IST",
    duration: "4",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "Salt Lake Stadium Area, Kolkata",
    coverImage: getRandomImage("Fun") || "/Placeholder/event-cover.jpg",
    eventPoster: getRandomImage("Fun") || "/Placeholder/event-poster.jpg",
    clubName: "Sanskaran Music Society",
    category: "Fun",
    organizer: "Sanskaran",
    capacity: "300",
    status: "pending",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],

    createdAt: "2024-05-20T14:45:00Z",
  },
  {
    id: "3",
    title: "Tech Hackathon 2025",
    description:
      "A 48-hour hackathon where tech enthusiasts will solve real-world problems, organized by Takshila. Form teams, brainstorm ideas, and develop innovative solutions to win exciting prizes.",
    dayType: "multi day",
    dateRange: "May 18-20, 2025",
    time: "9:00 AM IST",
    duration: "48",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "Techno India University, Salt Lake, Kolkata",
    coverImage: getRandomImage("Educational") || "/Placeholder/event-cover.jpg",
    eventPoster:
      getRandomImage("Educational") || "/Placeholder/event-poster.jpg",
    clubName: "Takshila Tech Club",
    category: "Educational",
    organizer: "Takshila",
    capacity: "300",
    status: "pending",
    course: ["B.Tech", "BCA", "M.Tech", "MCA"],
    department: ["CSE", "IT", "ECE"],
    year: ["2nd Year", "3rd Year", "4th Year"],

    createdAt: "2024-05-25T09:15:00Z",
  },
  {
    id: "4",
    title: "Alpha Dancers Dance Battle",
    description:
      "An exciting dance battle where participants show off their best moves, hosted by Alpha Dancers. Witness breathtaking performances and vote for your favorite dancers.",
    dayType: "single day",
    date: "Jun 5, 2025",
    time: "4:00 PM IST",
    duration: "5",
    isFree: false,
    price: "489",
    eventType: "physical",
    venue: "Salt Lake Sector V, Kolkata",
    coverImage: getRandomImage("Fun") || "/Placeholder/event-cover.jpg",
    eventPoster: getRandomImage("Fun") || "/Placeholder/event-poster.jpg",
    clubName: "Alpha Dancers Club",
    category: "Fun",
    organizer: "Alpha Dancers",
    capacity: "300",
    status: "pending",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],

    createdAt: "2024-05-28T16:30:00Z",
  },
  {
    id: "5",
    title: "GDSC Developer Meetup",
    description:
      "A tech meetup with workshops and networking for developers, organized by GDSC. Learn about the latest technologies, participate in hands-on sessions, and connect with industry experts.",
    dayType: "single day",
    date: "Jul 20, 2025",
    time: "11:00 AM IST",
    duration: "6",
    isFree: false,
    price: "429",
    eventType: "physical",
    venue: "Techno India University, Salt Lake, Kolkata",
    coverImage: getRandomImage("Educational") || "/Placeholder/event-cover.jpg",
    eventPoster:
      getRandomImage("Educational") || "/Placeholder/event-poster.jpg",
    clubName: "Google Developer Student Club",
    category: "Educational",
    organizer: "GDSC",
    capacity: "300",
    status: "pending",
    course: ["B.Tech", "BCA", "M.Tech", "MCA"],
    department: ["CSE", "IT", "ECE"],
    year: ["All Years"],

    createdAt: "2024-06-01T11:00:00Z",
  },
  {
    id: "6",
    title: "Vivarta College Fest",
    description:
      "The biggest college fest of the year, filled with music, games, and fun activities, organized by Vivarta. Experience a day of celebration with various competitions, performances, and food stalls.",
    dayType: "multi day",
    dateRange: "Aug 12-14, 2025",
    time: "2:00 PM IST",
    duration: "72",
    isFree: false,
    price: "599",
    eventType: "physical",
    venue: "Techno India University, Salt Lake, Kolkata",
    coverImage: getRandomImage("Fun") || "/Placeholder/event-cover.jpg",
    eventPoster: getRandomImage("Fun") || "/Placeholder/event-poster.jpg",
    clubName: "Vivarta Cultural Club",
    category: "Fun",
    organizer: "Vivarta",
    capacity: "300",
    status: "pending",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],

    createdAt: "2024-06-10T13:45:00Z",
  },
  {
    id: "7",
    title: "Virtual AI Workshop",
    description:
      "Learn about the latest advancements in artificial intelligence in this virtual workshop. Expert speakers will cover machine learning, neural networks, and practical applications of AI.",
    dayType: "single day",
    date: "Sep 5, 2025",
    time: "10:00 AM IST",
    duration: "3",
    isFree: false,
    price: "299",
    eventType: "virtual",
    virtualLink: "https://meet.google.com/abc-defg-hij",
    coverImage: getRandomImage("Educational") || "/Placeholder/event-cover.jpg",
    eventPoster:
      getRandomImage("Educational") || "/Placeholder/event-poster.jpg",
    clubName: "TechMinds AI Community",
    category: "Educational",
    organizer: "TechMinds",
    capacity: "500",
    status: "pending",
    course: ["B.Tech", "M.Tech", "BCA", "MCA"],
    department: ["CSE", "IT", "ECE", "Data Science"],
    year: ["All Years"],

    createdAt: "2024-06-15T09:15:00Z",
  },
  {
    id: "8",
    title: "Blockchain Technology Summit",
    description:
      "Explore the world of blockchain technology, cryptocurrencies, and decentralized applications. Learn from industry leaders and participate in interactive sessions on blockchain implementation.",
    dayType: "multi day",
    dateRange: "Oct 8-9, 2025",
    time: "9:30 AM IST",
    duration: "16",
    isFree: false,
    price: "999",
    eventType: "physical",
    venue: "JW Marriott, Kolkata",
    coverImage: getRandomImage("Educational") || "/Placeholder/event-cover.jpg",
    eventPoster:
      getRandomImage("Educational") || "/Placeholder/event-poster.jpg",
    clubName: "BlockchainHub India",
    category: "Educational",
    organizer: "BlockchainHub",
    capacity: "250",
    status: "pending",
    course: ["B.Tech", "M.Tech", "MBA", "BBA"],
    department: ["CSE", "IT", "Finance"],
    year: ["All Years"],
    createdAt: "2024-06-20T10:30:00Z",
  },
];
