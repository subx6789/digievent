import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import OrganizerTable from "@/components/Table/OrganiserTable";
import { organizers } from "@/utils/data/organizers";

export default async function OrganizersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar>
        <div className="p-6">
          <OrganizerTable organizers={organizers} />
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
