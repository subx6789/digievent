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
  const [studentsList, setStudentsList] = useState(students);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudentsList((prevStudents: any) => [
      ...prevStudents,
      {
        ...newStudent,
        avatarUrl: newStudent.avatarUrl || "/placeholder-avatar.jpg", // Ensure avatarUrl is always a string
      },
    ]);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={handleOpenModal} />
        <div className="p-6">
          <StudentTable students={studentsList} />
        </div>
        <AddStudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddStudent={handleAddStudent}
        />
      </Sidebar>
    </ProtectedRoute>
  );
};

export default AdminStudentPage;
