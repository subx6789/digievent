import { StatData } from "@/components/Card/StatsCard";
import { DollarSign, UserPlus, Users } from "lucide-react";

export const StatCardDataSuperAdmin: StatData[] = [
  {
    id: "total-bookings",
    title: "Total Bookings",
    value: 1986,
    icon: Users,
    growth: {
      value: 38,
      label: "From last month",
      trend: "up",
    },
    tooltipContent: "Total number of bookings made",
  },
  {
    id: "new-signups",
    title: "New Signups",
    value: 40,
    icon: UserPlus,
    growth: {
      value: 38,
      label: "From last month",
      trend: "down",
    },
    tooltipContent: "Number of new user registrations",
  },
  {
    id: "revenue",
    title: "Revenue Generated",
    value: 160,
    currency: "$",
    icon: DollarSign,
    date: `${new Date().toLocaleString("default", {
      month: "long",
    })}, ${new Date().getUTCFullYear()}`,
    tooltipContent: "Total revenue generated this period",
  },
];
