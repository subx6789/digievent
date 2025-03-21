"use client";
import Header from "@/components/Header/Header";
import AddStudentModal from "@/components/Modals/AddStudentModal";
import UploadExcelModal from "@/components/Modals/UploadExcelModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import StudentTable, { Student } from "@/components/Table/StudentTable";
import { students } from "@/utils/data/studentList";
import { FileSpreadsheet, UserPlus } from "lucide-react";
import React, { useState, useCallback } from "react";

const AdminStudentPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>(students);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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
      setStudentsList((prevStudents: Student[]) => [
        ...prevStudents,
        {
          ...newStudent,
          avatarUrl: newStudent.avatarUrl || "/placeholder-avatar.jpg",
        },
      ]);
      handleCloseAddModal();
    },
    [handleCloseAddModal]
  );

  const handleEditStudent = useCallback((student: Student) => {
    setEditingStudent(student);
    setTimeout(() => {
      setIsAddModalOpen(true);
    }, 100);
  }, []);

  const handleUpdateStudent = useCallback(
    (updatedStudent: Student, originalStudentId?: string) => {
      setStudentsList((prevStudents: Student[]) =>
        prevStudents.map((student) =>
          student.id === (originalStudentId || updatedStudent.id)
            ? updatedStudent
            : student
        )
      );
      handleCloseAddModal();
    },
    [handleCloseAddModal]
  );

  const handleRemoveStudent = useCallback((studentId: string) => {
    setStudentsList((prevStudents: Student[]) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  }, []);

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
        icon: <UserPlus className="h-4 w-4" />, // Placeholder to match expected structure
      },
      {
        label: "Upload Excel File",
        onClick: handleOpenExcelModal,
        icon: <FileSpreadsheet className="h-4 w-4" />, // Placeholder to match expected structure
      },
    ],
    [handleOpenAddModal, handleOpenExcelModal]
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={null} addOptions={addOptions} />
        <div className="p-6">
          <StudentTable
            students={studentsList}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleRemoveStudent}
          />
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
