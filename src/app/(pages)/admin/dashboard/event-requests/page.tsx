import Sidebar from "@/components/Sidebar/Sidebar";
import EventCard from "@/components/Card/EventCard";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import { eventRequests } from "@/utils/data/eventRequests";

const Page = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar>
        <div className="p-5">
          <h1 className="mb-5 text-xl font-semibold">Upcoming Events</h1>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eventRequests.map((event) => (
              <div key={event.id} className="p-1">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
};

export default Page;
