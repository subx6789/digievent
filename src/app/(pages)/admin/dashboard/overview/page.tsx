import StatsCard from "@/components/Card/StatsCard";
import EngagementChart from "@/components/EngagementChart/EngagementChart";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import EventsTable from "@/components/Table/EventsTable";
import TicketSalesChart from "@/components/TicketSalesChart/TicketSalesChart";
import { currentEvents } from "@/utils/data/currentEvents";
import { engagementdata } from "@/utils/data/engagementData";
import { pastEvents } from "@/utils/data/pastEvents";
import { statCardData } from "@/utils/data/statCardData";
import { ticketSalesData } from "@/utils/data/ticketSalesData";
import { upcomingEvents } from "@/utils/data/upcomingEvents";

export default function Overview() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 my-5">
          {statCardData.map((data, index) => (
            <div
              key={index}
              className="hover:scale-105 transition-all duration-150 cursor-pointer"
            >
              <StatsCard
                title={data.title}
                amount={data.amount}
                icon={data.icon}
                currency={data.currency}
              />
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
