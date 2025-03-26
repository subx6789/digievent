import { FileText, Calendar, MapPin, ImageIcon, Users } from "lucide-react";
import { Step } from "@/components/Customs/StepIndicator";

// Form steps with Lucide icons
export const formSteps: Step[] = [
  { id: "basic-details", label: "Basic Details", icon: <FileText size={16} /> },
  { id: "date-time", label: "Date & Time", icon: <Calendar size={16} /> },
  { id: "location", label: "Location", icon: <MapPin size={16} /> },
  { id: "media", label: "Media", icon: <ImageIcon size={16} /> },
  { id: "audience", label: "Audience", icon: <Users size={16} /> },
];
