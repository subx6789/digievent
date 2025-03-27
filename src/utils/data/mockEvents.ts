import { Event } from "@/types/event";
import { getRandomImage } from "./imageUrls";

export const mockEvents: Event[] = [
  {
    id: "event-001",
    title: "Tech Symposium 2023",
    description:
      "Annual technology symposium featuring the latest innovations and research presentations.",
    dayType: "single day",
    date: "2023-12-15",
    time: "10:00 AM",
    duration: "6",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "Main Auditorium",
    coverImage: getRandomImage("Fun") || "/images/events/tech-symposium.jpg",
    clubName: "Tech Club",
    category: "Technology",
    status: "approved",
    capacity: "200",
    course: ["B.Tech", "M.Tech", "BCA"],
    department: ["CSE", "IT", "ECE"],
    year: ["2nd Year", "3rd Year", "4th Year"],
    createdAt: "2023-11-01T10:30:00Z",
    organizer: {
      id: "organizer-001",
      name: "John Smith",
      clubName: "Tech Club",
      role: "organizer",
      email: "john.smith@techclub.edu",
      phone: "+91 98765 43210",
      eventCount: 8,
      avatarUrl: "/images/avatars/john-smith.jpg",
    },
    progress: "upcoming",
    studentsBooked: [
      {
        id: "student-001",
        name: "Rahul Sharma",
        email: "rahul.s@college.edu",
        phone: "+91 87654 32109",
        department: "Computer Science",
        course: "BCA",
        year: 3,
        rollno: "CS2021001",
        avatarUrl: "/images/avatars/rahul.jpg",
      },
      {
        id: "student-002",
        name: "Priya Patel",
        email: "priya.p@college.edu",
        phone: "+91 76543 21098",
        department: "Information Technology",
        course: "BCA",
        year: 3,
        rollno: "IT2022045",
        avatarUrl: "/images/avatars/priya.jpg",
      },
    ],
  },
  {
    id: "event-002",
    title: "Cultural Fest 2023",
    description:
      "Annual cultural festival celebrating diversity through music, dance, and art performances.",
    dayType: "multi day",
    dateRange: "Nov 20-22, 2023",
    time: "5:00 PM",
    duration: "5",
    isFree: false,
    price: "100",
    eventType: "physical",
    venue: "College Grounds",
    coverImage: getRandomImage("Fun") || "/images/events/cultural-fest.jpg",
    clubName: "Cultural Club",
    category: "Cultural",
    status: "approved",
    capacity: "500",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],
    createdAt: "2023-10-15T09:00:00Z",
    organizer: {
      id: "organizer-002",
      name: "Ananya Singh",
      clubName: "Cultural Club",
      role: "organizer",
      email: "ananya@culturalclub.edu",
      phone: "+91 87654 32109",
      eventCount: 12,
      avatarUrl: "/images/avatars/ananya.jpg",
    },
    progress: "active",
    studentsBooked: [
      {
        id: "student-001",
        name: "Rahul Sharma",
        email: "rahul.s@college.edu",
        phone: "+91 87654 32109",
        department: "Computer Science",
        course: "BCA",
        year: 3,
        rollno: "CS2021001",
        avatarUrl: "/images/avatars/rahul.jpg",
      },
      {
        id: "student-003",
        name: "Aditya Kumar",
        email: "aditya.k@college.edu",
        phone: "+91 98765 43210",
        department: "Electronics",
        course: "BCA",
        year: 3,
        rollno: "EC2020033",
        avatarUrl: "/images/avatars/aditya.jpg",
      },
    ],
  },
  {
    id: "event-003",
    title: "Coding Competition",
    description:
      "Test your programming skills in this competitive coding challenge with exciting prizes.",
    dayType: "single day",
    date: "2023-10-10",
    time: "9:00 AM",
    duration: "4",
    isFree: false,
    price: "50",
    eventType: "physical",
    venue: "Computer Lab",
    coverImage:
      getRandomImage("Fun") || "/images/events/coding-competition.jpg",
    clubName: "Coding Club",
    category: "Competition",
    status: "approved",
    capacity: "100",
    course: ["B.Tech", "BCA", "MCA"],
    department: ["CSE", "IT"],
    year: ["2nd Year", "3rd Year", "4th Year"],
    createdAt: "2023-09-20T08:30:00Z",
    organizer: {
      id: "organizer-003",
      name: "Vikram Mehta",
      clubName: "Coding Club",
      role: "organizer",
      email: "vikram@codingclub.edu",
      phone: "+91 76543 21098",
      eventCount: 5,
      avatarUrl: "/images/avatars/vikram.jpg",
    },
    progress: "completed",
    studentsBooked: [
      {
        id: "student-002",
        name: "Priya Patel",
        email: "priya.p@college.edu",
        phone: "+91 76543 21098",
        department: "Information Technology",
        course: "BCA",
        year: 3,
        rollno: "IT2022045",
        avatarUrl: "/images/avatars/priya.jpg",
      },
      {
        id: "student-004",
        name: "Arjun Reddy",
        email: "arjun.r@college.edu",
        phone: "+91 65432 10987",
        department: "Computer Science",
        course: "BCA",
        year: 3,
        rollno: "CS2021022",
        avatarUrl: "/images/avatars/arjun.jpg",
      },
    ],
  },
  {
    id: "event-004",
    title: "Workshop on AI",
    description:
      "Learn about artificial intelligence and its applications in various industries.",
    dayType: "single day",
    date: "2023-11-05",
    time: "2:00 PM",
    duration: "3",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "Seminar Hall",
    coverImage: getRandomImage("Fun") || "/images/events/ai-workshop.jpg",
    clubName: "Tech Club",
    category: "Workshop",
    status: "approved",
    capacity: "80",
    course: ["B.Tech", "M.Tech"],
    department: ["CSE", "IT", "ECE"],
    year: ["3rd Year", "4th Year"],
    createdAt: "2023-10-01T14:00:00Z",
    organizer: {
      id: "organizer-001",
      name: "John Smith",
      clubName: "Tech Club",
      role: "organizer",
      email: "john.smith@techclub.edu",
      phone: "+91 98765 43210",
      eventCount: 8,
      avatarUrl: "/images/avatars/john-smith.jpg",
    },
    progress: "completed",
    studentsBooked: [
      {
        id: "student-001",
        name: "Rahul Sharma",
        email: "rahul.s@college.edu",
        phone: "+91 87654 32109",
        department: "Computer Science",
        course: "BCA",
        year: 3,
        rollno: "CS2021001",
        avatarUrl: "/images/avatars/rahul.jpg",
      },
      {
        id: "student-005",
        name: "Neha Gupta",
        email: "neha.g@college.edu",
        phone: "+91 54321 09876",
        department: "Electronics",
        course: "BCA",
        year: 3,
        rollno: "EC2020015",
        avatarUrl: "/images/avatars/neha.jpg",
      },
    ],
  },
  {
    id: "event-005",
    title: "Sports Tournament",
    description:
      "Inter-college sports tournament featuring cricket, football, and basketball competitions.",
    dayType: "multi day",
    dateRange: "Dec 5-8, 2023",
    time: "8:00 AM",
    duration: "10",
    isFree: false,
    price: "150",
    eventType: "physical",
    venue: "College Sports Complex",
    coverImage: getRandomImage("Fun") || "/images/events/sports-tournament.jpg",
    clubName: "Sports Club",
    category: "Sports",
    status: "approved",
    capacity: "300",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],
    createdAt: "2023-11-10T11:30:00Z",
    organizer: {
      id: "organizer-004",
      name: "Rajesh Kumar",
      clubName: "Sports Club",
      role: "organizer",
      email: "rajesh@sportsclub.edu",
      phone: "+91 65432 10987",
      eventCount: 15,
      avatarUrl: "/images/avatars/rajesh.jpg",
    },
    progress: "upcoming",
    studentsBooked: [
      {
        id: "student-006",
        name: "Karan Singh",
        email: "karan.s@college.edu",
        phone: "+91 43210 98765",
        department: "Mechanical",
        course: "BCA",
        year: 3,
        rollno: "ME2022010",
        avatarUrl: "/images/avatars/karan.jpg",
      },
      {
        id: "student-007",
        name: "Divya Sharma",
        email: "divya.s@college.edu",
        phone: "+91 32109 87654",
        department: "Civil",
        course: "BCA",
        year: 3,
        rollno: "CE2021007",
        avatarUrl: "/images/avatars/divya.jpg",
      },
    ],
  },
  {
    id: "event-006",
    title: "Career Fair 2023",
    description:
      "Connect with top companies and explore job opportunities across various industries.",
    dayType: "single day",
    date: "2023-11-25",
    time: "10:00 AM",
    duration: "6",
    isFree: true,
    price: "Free",
    eventType: "physical",
    venue: "College Auditorium",
    coverImage: getRandomImage("Fun") || "/images/events/career-fair.jpg",
    clubName: "Placement Cell",
    category: "Career",
    status: "approved",
    capacity: "400",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["3rd Year", "4th Year"],
    createdAt: "2023-10-25T10:00:00Z",
    organizer: {
      id: "organizer-005",
      name: "Sanjay Verma",
      clubName: "Placement Cell",
      role: "organizer",
      email: "sanjay@placementcell.edu",
      phone: "+91 21098 76543",
      eventCount: 7,
      avatarUrl: "/images/avatars/sanjay.jpg",
    },
    progress: "active",
    studentsBooked: [
      {
        id: "student-008",
        name: "Riya Jain",
        email: "riya.j@college.edu",
        phone: "+91 10987 65432",
        department: "Computer Science",
        course: "BCA",
        year: 3,
        rollno: "CS2020005",
        avatarUrl: "/images/avatars/riya.jpg",
      },
      {
        id: "student-009",
        name: "Varun Malhotra",
        email: "varun.m@college.edu",
        phone: "+91 09876 54321",
        department: "Electronics",
        course: "BCA",
        year: 3,
        rollno: "EC2020019",
        avatarUrl: "/images/avatars/varun.jpg",
      },
    ],
  },
  {
    id: "event-007",
    title: "Entrepreneurship Summit",
    description:
      "Learn from successful entrepreneurs and gain insights into starting your own business.",
    dayType: "single day",
    date: "2023-11-15",
    time: "11:00 AM",
    duration: "4",
    isFree: false,
    price: "200",
    eventType: "physical",
    venue: "Conference Hall",
    coverImage:
      getRandomImage("Fun") || "/images/events/entrepreneurship-summit.jpg",
    clubName: "E-Cell",
    category: "Business",
    status: "approved",
    capacity: "150",
    course: ["BBA", "MBA", "B.Tech", "M.Tech"],
    department: ["All Departments"],
    year: ["3rd Year", "4th Year"],
    createdAt: "2023-10-10T09:45:00Z",
    organizer: {
      id: "organizer-006",
      name: "Meera Kapoor",
      clubName: "E-Cell",
      role: "organizer",
      email: "meera@ecell.edu",
      phone: "+91 09876 54321",
      eventCount: 4,
      avatarUrl: "/images/avatars/meera.jpg",
    },
    progress: "cancelled",
    studentsBooked: [
      {
        id: "student-010",
        name: "Rohit Khanna",
        email: "rohit.k@college.edu",
        phone: "+91 98765 43210",
        department: "Business Administration",
        course: "BCA",
        year: 3,
        rollno: "BA2021012",
        avatarUrl: "/images/avatars/rohit.jpg",
      },
    ],
  },
  {
    id: "event-008",
    title: "Photography Exhibition",
    description:
      "Showcase of stunning photographs captured by talented student photographers.",
    dayType: "single day",
    date: "2023-12-10",
    time: "12:00 PM",
    duration: "6",
    isFree: false,
    price: "50",
    eventType: "physical",
    venue: "Art Gallery",
    coverImage:
      getRandomImage("Fun") || "/images/events/photography-exhibition.jpg",
    clubName: "Photography Club",
    category: "Art",
    status: "approved",
    capacity: "120",
    course: ["All Courses"],
    department: ["All Departments"],
    year: ["All Years"],
    createdAt: "2023-11-15T13:00:00Z",
    organizer: {
      id: "organizer-007",
      name: "Aisha Khan",
      clubName: "Photography Club",
      role: "organizer",
      email: "aisha@photoclub.edu",
      phone: "+91 87654 32109",
      eventCount: 3,
      avatarUrl: "/images/avatars/aisha.jpg",
    },
    progress: "upcoming",
    studentsBooked: [
      {
        id: "student-011",
        name: "Siddharth Roy",
        email: "siddharth.r@college.edu",
        phone: "+91 76543 21098",
        department: "Fine Arts",
        course: "BCA",
        year: 3,
        rollno: "FA2022003",
        avatarUrl: "/images/avatars/siddharth.jpg",
      },
      {
        id: "student-012",
        name: "Tanvi Mehta",
        email: "tanvi.m@college.edu",
        phone: "+91 65432 10987",
        department: "Design",
        course: "BCA",
        year: 3,
        rollno: "DS2021008",
        avatarUrl: "/images/avatars/tanvi.jpg",
      },
    ],
  },
  {
    id: "event-009",
    title: "Virtual Webinar on Blockchain",
    description:
      "Learn about blockchain technology and its applications in various industries.",
    dayType: "single day",
    date: "2023-12-20",
    time: "3:00 PM",
    duration: "2",
    isFree: true,
    price: "Free",
    eventType: "virtual",
    virtualLink: "https://meet.google.com/abc-defg-hij",
    coverImage:
      getRandomImage("Fun") || "/images/events/blockchain-webinar.jpg",
    clubName: "Tech Club",
    category: "Technology",
    status: "approved",
    capacity: "500",
    course: ["All Courses"],
    department: ["CSE", "IT", "ECE"],
    year: ["All Years"],
    createdAt: "2023-11-25T15:30:00Z",
    organizer: {
      id: "organizer-001",
      name: "John Smith",
      clubName: "Tech Club",
      role: "organizer",
      email: "john.smith@techclub.edu",
      phone: "+91 98765 43210",
      eventCount: 8,
      avatarUrl: "/images/avatars/john-smith.jpg",
    },
    progress: "upcoming",
    studentsBooked: [
      {
        id: "student-013",
        name: "Aman Verma",
        email: "aman.v@college.edu",
        phone: "+91 54321 09876",
        department: "Computer Science",
        year: 2,
        course: "B.Tech",
        rollno: "123456789012",
        avatarUrl: "/images/avatars/aman.jpg",
      },
    ],
  },
];
