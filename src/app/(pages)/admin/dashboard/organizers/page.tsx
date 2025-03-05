"use client";
import { useState } from "react";
import Header from "@/components/Header/Header";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import OrganizerTable from "@/components/Table/OrganiserTable";
import { organizers } from "@/utils/data/organizers";
import AddOrganizerModal, {
  Organizer,
} from "@/components/Modals/AddOrganizerModal";

export default function OrganizersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizersList, setOrganizersList] = useState(organizers);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddOrganizer = (newOrganizer: Organizer) => {
    setOrganizersList((prevOrganizers) => [
      ...prevOrganizers,
      {
        ...newOrganizer,
        avatarUrl: newOrganizer.avatarUrl || "/placeholder-avatar.jpg", // Ensure avatarUrl is always a string
      },
    ]);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={handleOpenModal} />
        <div className="p-6">
          <OrganizerTable organizers={organizersList} />
        </div>

        <AddOrganizerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddOrganizer={handleAddOrganizer}
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
