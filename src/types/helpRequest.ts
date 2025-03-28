// Define the type for help request
export interface HelpRequest {
  id: string;
  collegeName: string;
  email: string;
  location: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  date: Date;
}
