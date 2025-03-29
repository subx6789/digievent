"use client";
import Header from "@/components/Header/Header";
import AddStudentModal from "@/components/Modals/AddStudentModal";
import UploadExcelModal from "@/components/Modals/UploadExcelModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import StudentTable from "@/components/Table/StudentTable";
import { Student } from "@/types/student";
import { useStudentsStore } from "@/store/studentsStore";
import { FileSpreadsheet, UserPlus } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

const AdminStudentPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Use the students store
  const {
    students,
    isLoading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    removeStudent,
  } = useStudentsStore();

  // Fetch students when component mounts
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle opening the add student modal
  const handleOpenAddModal = useCallback(() => {
    setEditingStudent(null);
    setTimeout(() => {
      setIsAddModalOpen(true);
    }, 100);
  }, []);

  // Handle closing the add student modal
  const handleCloseAddModal = useCallback(() => {
    setTimeout(() => {
      setIsAddModalOpen(false);
      setEditingStudent(null);
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

  const handleAddStudent = useCallback(
    (newStudent: Student) => {
      addStudent(newStudent);
      handleCloseAddModal();
    },
    [addStudent, handleCloseAddModal]
  );

  const handleEditStudent = useCallback((student: Student) => {
    setEditingStudent(student);
    setTimeout(() => {
      setIsAddModalOpen(true);
    }, 100);
  }, []);

  const handleUpdateStudent = useCallback(
    (updatedStudent: Student) => {
      updateStudent(updatedStudent);
      handleCloseAddModal();
    },
    [updateStudent, handleCloseAddModal]
  );

  const handleRemoveStudent = useCallback(
    (studentId: string) => {
      removeStudent(studentId);
    },
    [removeStudent]
  );

  const handleExcelUploadSuccess = useCallback((file: File) => {
    // Handle the uploaded file here
    console.log("Uploaded file:", file);
  }, []);

  // Memoize dropdown options to prevent unnecessary re-renders
  const addOptions = React.useMemo(
    () => [
      {
        label: "Enter Manually",
        onClick: handleOpenAddModal,
        icon: <UserPlus className="h-4 w-4" />,
      },
      {
        label: "Upload Excel File",
        onClick: handleOpenExcelModal,
        icon: <FileSpreadsheet className="h-4 w-4" />,
      },
    ],
    [handleOpenAddModal, handleOpenExcelModal]
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
            <StudentTable
              students={students}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleRemoveStudent}
            />
          )}
        </div>

        {/* Modals */}
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          studentToEdit={editingStudent}
          isEditMode={!!editingStudent}
        />

        <UploadExcelModal
          isOpen={isExcelModalOpen}
          onClose={handleCloseExcelModal}
          title="Upload Student Data"
          youtubeEmbedId="dQw4w9WgXcQ"
          templateLink="/templates/student-template.xlsx"
          instructionSteps={[
            "Download the template file for correct formatting",
            "Fill in student details in the template",
            "Save the file as .xlsx or .xls format",
            "Upload the file using the dropzone below",
          ]}
          onUploadSuccess={handleExcelUploadSuccess}
          entityName="Student"
        />
      </Sidebar>
    </ProtectedRoute>
  );
};

export default AdminStudentPage;
