import { StatsCard } from "@/components/Card/StatsCard";
import EngagementChart from "@/components/EngagementChart/EngagementChart";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import EventsTable from "@/components/Table/EventsTable";
import TicketSalesChart from "@/components/TicketSalesChart/TicketSalesChart";
import { currentEvents } from "@/utils/data/currentEvents";
import { engagementdata } from "@/utils/data/engagementData";
import { pastEvents } from "@/utils/data/pastEvents";
import { statCardDataAdmin } from "@/utils/data/statCardDataAdmin";
import { ticketSalesData } from "@/utils/data/ticketSalesData";
import { upcomingEvents } from "@/utils/data/upcomingEvents";

export default function Overview() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
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
            <EventsTable
              currentEvents={currentEvents}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
            />
          </div>
        </div>

        <div className="my-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <EngagementChart data={engagementdata} />
          </div>
          <div>
            <TicketSalesChart data={ticketSalesData} />
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
