"use client";
import { StatsCard } from "@/components/Card/StatsCard";
import EngagementChart from "@/components/EngagementChart/EngagementChart";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import EventsTable from "@/components/Table/EventsTable";
import EventBookingChart from "@/components/EventBookingChart/EventBookingChart";
import { allEvents } from "@/utils/data/allEvents";
import { engagementdata } from "@/utils/data/engagementData";
import { statCardDataAdmin } from "@/utils/data/statCardDataAdmin";
import { eventBookingData } from "@/utils/data/eventBookingData";
import Header from "@/components/Header/Header";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { timePeriods } from "@/utils/data/superAdminOverviewFilters";

export default function Overview() {
  useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={() => {}} />
        <div className="flex flex-col md:flex-row md:justify-end items-center gap-4 mt-4 md:mt-0">
          <Select defaultValue="30-days">
            <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div className="flex items-center gap-3">
                <Calendar className="h-[18px] w-[18px] text-gray-400" />
                <SelectValue
                  placeholder="Select Time Period"
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              {timePeriods.map((timePeriod, index) => (
                <SelectItem
                  value={timePeriod.id}
                  key={index}
                  className="cursor-pointer"
                >
                  {timePeriod.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 my-5">
          {statCardDataAdmin.map((data, index) => (
            <div key={index} className="cursor-pointer">
              <StatsCard {...data} />
            </div>
          ))}
        </div>

        <div className="my-5">
          <h1 className="text-xl font-semibold">Event Insights</h1>
          <div className="mt-5">
            <EventsTable events={allEvents} />
          </div>
        </div>

        <div className="my-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <EngagementChart data={engagementdata} />
          </div>
          <div>
            <EventBookingChart
              title={"Ticket Bookings by Category"}
              data={eventBookingData}
            />
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
