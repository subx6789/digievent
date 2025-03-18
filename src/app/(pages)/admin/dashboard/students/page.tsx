/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Header from "@/components/Header/Header";
import AddStudentModal from "@/components/Modals/AddStudentModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import StudentTable, { Student } from "@/components/Table/StudentTable";
import { students } from "@/utils/data/studentList";
import React, { useState } from "react";

const AdminStudentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>(students);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleOpenModal = () => {
    setEditingStudent(null); // Ensure we're not in edit mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudentsList((prevStudents: Student[]) => [
      ...prevStudents,
      {
        ...newStudent,
        avatarUrl: newStudent.avatarUrl || "/placeholder-avatar.jpg", // Ensure avatarUrl is always a string
      },
    ]);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleUpdateStudent = (
    updatedStudent: Student,
    originalStudentId?: string
  ) => {
    setStudentsList((prevStudents: Student[]) =>
      prevStudents.map((student) =>
        student.id === (originalStudentId || updatedStudent.id)
          ? updatedStudent
          : student
      )
    );
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudentsList((prevStudents: Student[]) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={handleOpenModal} />
        <div className="p-6">
          <StudentTable
            students={studentsList}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleRemoveStudent}
          />
        </div>
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          studentToEdit={editingStudent}
          isEditMode={!!editingStudent}
        />
      </Sidebar>
    </ProtectedRoute>
  );
};

export default AdminStudentPage;
