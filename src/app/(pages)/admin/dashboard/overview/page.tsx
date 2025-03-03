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

export default function Overview() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={() => {}} />
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
