import { StatData } from "@/components/Card/StatsCard";

export const statCardDataOrganizer: StatData[] = [
  {
    id: "total-bookings",
    title: "Total Bookings",
    value: 1986,
    type: "bookings",
    growth: {
      value: 38,
      label: "From last month",
      trend: "up",
    },
    tooltipContent: "Total number of bookings made",
  },
  {
    id: "total-events-created",
    title: "Total Events Created",
    value: 40,
    type: "events",
    growth: {
      value: 11.2,
      label: "From last month",
      trend: "up",
    },
    tooltipContent: "Total number of events created",
  },
  {
    id: "revenue",
    title: "Revenue Generated",
    value: 1603567,
    currency: "₹",
    type: "revenue",
    date: `${new Date().toLocaleString("default", {
      month: "long",
    })}, ${new Date().getUTCFullYear()}`,
    tooltipContent: "Total revenue generated this period",
  },
];
