"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import EventCard from "@/components/Card/EventCard";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { eventRequests } from "@/utils/data/eventRequests";
import Header from "@/components/Header/Header";

const Page = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={() => {}} />
        <div className="p-5">
          <h1 className="mb-5 text-xl font-semibold">Upcoming Events</h1>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eventRequests.map((event) => (
              <div
                key={event.id}
                className="p-1 hover:drop-shadow-lg transition-all duration-150"
              >
                <EventCard event={event} className="w-full max-w-sm mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
};

export default Page;
