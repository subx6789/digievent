import { HelpRequest } from "@/types/helpRequest";

// Mock data for help requests
export const mockHelpRequests: HelpRequest[] = [
  {
    id: "1",
    collegeName: "Engineering College of Technology",
    email: "support@ect.edu",
    location: "Mumbai, Maharashtra",
    subject: "Student Registration Issue",
    message:
      "We are experiencing issues with the student registration process. Several students have reported that they are unable to complete their registration for upcoming events. The system shows an error message saying 'Registration failed' after they submit their details. This is affecting our participation numbers for the annual tech fest.",
    status: "unread",
    date: new Date(2023, 10, 15, 9, 30),
  },
  {
    id: "2",
    collegeName: "National Institute of Science",
    email: "admin@nis.edu",
    location: "Delhi, Delhi",
    subject: "Event Creation Permission",
    message:
      "Our college needs to create multiple events for the upcoming cultural week, but we're limited to only 5 events. Could you please increase our event creation limit to at least 15? We have various departments participating and need separate events for each competition category.",
    status: "read",
    date: new Date(2023, 10, 14, 14, 45),
  },
  {
    id: "3",
    collegeName: "Medical University",
    email: "events@meduni.edu",
    location: "Bangalore, Karnataka",
    subject: "Payment Gateway Integration",
    message:
      "We're trying to set up paid events for our medical conference, but the payment gateway integration is not working properly. When students try to make payments, they are redirected to an error page. We've tested with multiple payment methods and browsers, but the issue persists. Could you please look into this as soon as possible?",
    status: "unread",
    date: new Date(2023, 10, 13, 11, 20),
  },
  {
    id: "4",
    collegeName: "Arts and Design Institute",
    email: "tech@artdesign.edu",
    location: "Chennai, Tamil Nadu",
    subject: "Custom Branding Request",
    message:
      "We would like to customize the event pages with our college branding and colors. Is it possible to have a custom theme for our events? We're hosting a major design exhibition next month and want to maintain our brand identity throughout the registration process.",
    status: "read",
    date: new Date(2023, 10, 12, 16, 10),
  },
  {
    id: "5",
    collegeName: "Business Management School",
    email: "events@bms.edu",
    location: "Hyderabad, Telangana",
    subject: "Bulk Student Import Failed",
    message:
      "We tried to import our student database using the bulk import feature, but it failed multiple times. We've formatted the CSV file according to the guidelines, but still getting errors. We need to onboard over 500 students for our upcoming business summit and doing it manually would be very time-consuming.",
    status: "unread",
    date: new Date(2023, 10, 11, 10, 5),
  },
];
