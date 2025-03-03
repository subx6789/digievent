"use client";
import Header from "@/components/Header/Header";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import OrganizerTable from "@/components/Table/OrganiserTable";
import { organizers } from "@/utils/data/organizers";

export default function OrganizersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={() => {}} />
        <div className="p-6">
          <OrganizerTable organizers={organizers} />
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
}
