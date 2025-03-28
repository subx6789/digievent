"use client";
import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header/Header";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import OrganizerTable from "@/components/Table/OrganiserTable";
import AddOrganizerModal from "@/components/Modals/AddOrganizerModal";
import UploadExcelModal from "@/components/Modals/UploadExcelModal";
import { FileSpreadsheet, UserPlus } from "lucide-react";
import React from "react";
import { Organizer } from "@/types/organizer";
import { useOrganizersStore } from "@/store/organizersStore";

export default function OrganizersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingOrganizer, setEditingOrganizer] = useState<Organizer | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Use the organizers store
  const {
    organizers,
    isLoading,
    error,
    fetchOrganizers,
    addOrganizer,
    updateOrganizer,
    removeOrganizer,
  } = useOrganizersStore();

  // Fetch organizers when component mounts
  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  // Handle opening the add organizer modal
  const handleOpenModal = useCallback(() => {
    setIsEditMode(false);
    setEditingOrganizer(null);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  // Handle closing the add organizer modal
  const handleCloseModal = useCallback(() => {
    setTimeout(() => {
      setIsModalOpen(false);
      setEditingOrganizer(null);
      setIsEditMode(false);
    }, 0);
  }, []);

  // Handle opening the excel upload modal
  const handleOpenExcelModal = useCallback(() => {
    setTimeout(() => {
      setIsExcelModalOpen(true);
    }, 100);
  }, []);

  // Handle closing the excel upload modal
  const handleCloseExcelModal = useCallback(() => {
    setTimeout(() => {
      setIsExcelModalOpen(false);
    }, 0);
  }, []);

  const handleAddOrganizer = useCallback(
    (newOrganizer: Organizer) => {
      // Use the store to add a new organizer
      addOrganizer({
        ...newOrganizer,
        avatarUrl: newOrganizer.avatarUrl || "/placeholder-avatar.jpg",
      });
      handleCloseModal();
    },
    [addOrganizer, handleCloseModal]
  );

  const handleUpdateOrganizer = useCallback(
    (updatedOrganizer: Organizer) => {
      // Use the store to update an existing organizer
      updateOrganizer({
        ...updatedOrganizer,
        avatarUrl: updatedOrganizer.avatarUrl || "/placeholder-avatar.jpg",
      });
      handleCloseModal();
    },
    [updateOrganizer, handleCloseModal]
  );

  const handleEditOrganizer = useCallback(
    (organizerId: string) => {
      const organizerToEdit = organizers.find((org) => org.id === organizerId);
      if (organizerToEdit) {
        setEditingOrganizer(organizerToEdit as Organizer);
        setIsEditMode(true);
        setTimeout(() => {
          setIsModalOpen(true);
        }, 100);
      }
    },
    [organizers]
  );

  const handleRemoveOrganizer = useCallback(
    (organizerId: string) => {
      const organizerToRemove = organizers.find(
        (org) => org.id === organizerId
      );
      if (organizerToRemove) {
        const isConfirmed = window.confirm(
          `Are you sure you want to remove ${organizerToRemove.name}?`
        );

        if (isConfirmed) {
          // Use the store to remove an organizer
          removeOrganizer(organizerId);
        }
      }
    },
    [organizers, removeOrganizer]
  );

  // Handle successful Excel upload
  const handleExcelUploadSuccess = useCallback((file: File) => {
    // In a real app, you would process the Excel file here
    console.log(file);
  }, []);

  // Memoize dropdown options to prevent unnecessary re-renders
  const addOptions = React.useMemo(
    () => [
      {
        label: "Enter Manually",
        onClick: handleOpenModal,
        icon: <UserPlus className="h-4 w-4" />,
      },
      {
        label: "Upload Excel File",
        onClick: handleOpenExcelModal,
        icon: <FileSpreadsheet className="h-4 w-4" />,
      },
    ],
    [handleOpenModal, handleOpenExcelModal]
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={null} addOptions={addOptions} />
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              Error: {error}. Please try refreshing the page.
            </div>
          ) : (
            <OrganizerTable
              organizers={organizers}
              onEditOrganizer={handleEditOrganizer}
              onRemoveOrganizer={handleRemoveOrganizer}
            />
          )}
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

        <UploadExcelModal
          isOpen={isExcelModalOpen}
          onClose={handleCloseExcelModal}
          title="Upload Organizer Data"
          youtubeEmbedId="dQw4w9WgXcQ"
          templateLink="/templates/organizer-template.xlsx"
          instructionSteps={[
            "Download the template file for correct formatting",
            "Fill in organizer details in the template",
            "Save the file as .xlsx or .xls format",
            "Upload the file using the dropzone below",
          ]}
          onUploadSuccess={handleExcelUploadSuccess}
          entityName="Organizer"
        />
      </Sidebar>
    </ProtectedRoute>
  );
}
