"use client";
import { StatsCard } from "@/components/Card/StatsCard";
import EventBookingChart from "@/components/EventBookingChart/EventBookingChart";
import EventBookingsBarChart from "@/components/EventBookingsBarChart/EventBookingsBarChart";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { eventsBookingsPerWeek } from "@/utils/data/eventsBookingsPerWeek";
import { statCardDataOrganizer } from "@/utils/data/statCardDataOrganizer";
import { superAdminBookedandNonBookedData } from "@/utils/data/superAdminBookedandNonBookedData";
import React from "react";

const OrganizerMetrics = () => {
  return (
    <Sidebar role="organizer">
      <Header onAddClick={() => {}} />
      <div className="my-5 space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCardDataOrganizer.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="my-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <EventBookingChart
              title={"% of Event Bookings per month"}
              data={superAdminBookedandNonBookedData}
            />
          </div>

          <div>
            <EventBookingsBarChart
              title="Event Bookings per month"
              data={eventsBookingsPerWeek}
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default OrganizerMetrics;
