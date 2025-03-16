"use client";
import CourseCard from "@/components/Card/CourseCard";
import Header from "@/components/Header/Header";
import AddCourseModal from "@/components/Modals/AddCourseModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Course, courses } from "@/utils/data/courses";
import React, { useState } from "react";

const AdminCollegeCourses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coursesList, setCoursesList] = useState(courses);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleOpenModal = () => {
    setEditingCourse(null); // Ensure we're not in edit mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCoursesList((prevCourses) => [
      ...prevCourses,
      {
        ...newCourse,
      },
    ]);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleUpdateCourse = (
    updatedCourse: Course,
    originalCourseId: string
  ) => {
    setCoursesList((prevCourses) =>
      prevCourses.map((course) =>
        course.course === originalCourseId ? updatedCourse : course
      )
    );
  };

  const handleRemoveCourse = (courseId: string) => {
    setCoursesList((prevCourses) =>
      prevCourses.filter((course) => course.course !== courseId)
    );
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Sidebar role="admin">
        <Header onAddClick={handleOpenModal} />
        <div className="p-5">
          <h1 className="mb-5 text-xl font-semibold">All Courses</h1>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {coursesList.map((course) => (
              <CourseCard
                key={course.course}
                course={course}
                onEdit={handleEditCourse}
                onRemove={handleRemoveCourse}
              />
            ))}
          </div>
          {/* Add/edit course modal */}
          <AddCourseModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            editCourse={editingCourse}
          />
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
};

export default AdminCollegeCourses;
