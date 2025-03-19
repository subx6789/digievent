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
  const [editingOrganizer, setEditingOrganizer] = useState<Organizer | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingOrganizer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrganizer(null);
    setIsEditMode(false);
  };

  const handleAddOrganizer = (newOrganizer: Organizer) => {
    // Only handle adding new organizers here
    setOrganizersList((prevOrganizers) => [
      ...prevOrganizers,
      {
        ...newOrganizer,
        avatarUrl: newOrganizer.avatarUrl || "/placeholder-avatar.jpg",
      },
    ]);
  };

  const handleUpdateOrganizer = (updatedOrganizer: Organizer) => {
    // Handle updating existing organizers
    setOrganizersList((prevOrganizers) =>
      prevOrganizers.map((org) =>
        org.id === updatedOrganizer.id
          ? {
              ...updatedOrganizer,
              avatarUrl:
                updatedOrganizer.avatarUrl || "/placeholder-avatar.jpg",
            }
          : org
      )
    );
  };

  const handleEditOrganizer = (organizerId: string) => {
    const organizerToEdit = organizersList.find(
      (org) => org.id === organizerId
    );
    if (organizerToEdit) {
      setEditingOrganizer(organizerToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleRemoveOrganizer = (organizerId: string) => {
    const organizerToRemove = organizersList.find(
      (org) => org.id === organizerId
    );
    if (organizerToRemove) {
      const isConfirmed = window.confirm(
        `Are you sure you want to remove ${organizerToRemove.name}?`
      );

      if (isConfirmed) {
        setOrganizersList((prevOrganizers) =>
          prevOrganizers.filter((org) => org.id !== organizerId)
        );
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={handleOpenModal} />
        <div className="p-6">
          <OrganizerTable
            organizers={organizersList}
            onEditOrganizer={handleEditOrganizer}
            onRemoveOrganizer={handleRemoveOrganizer}
          />
        </div>

        <AddOrganizerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddOrganizer={
            isEditMode ? handleUpdateOrganizer : handleAddOrganizer
          }
          editMode={isEditMode}
          organizerToEdit={editingOrganizer}
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
