"use client";
import CourseCard from "@/components/Card/CourseCard";
import Header from "@/components/Header/Header";
import AddCourseModal from "@/components/Modals/AddCourseModal";
import UploadExcelModal from "@/components/Modals/UploadExcelModal";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useState, useCallback, useEffect } from "react";
import { FileSpreadsheet, BookOpen } from "lucide-react";
import { Course } from "@/types/course";
import { useCoursesStore } from "@/store/coursesStore";

const AdminCollegeCourses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Use the courses store
  const {
    courses,
    isLoading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    removeCourse,
  } = useCoursesStore();

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle opening the add course modal
  const handleOpenModal = useCallback(() => {
    setEditingCourse(null);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  // Handle closing the add course modal
  const handleCloseModal = useCallback(() => {
    setTimeout(() => {
      setIsModalOpen(false);
      setEditingCourse(null);
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

  const handleAddCourse = useCallback(
    (newCourse: Course) => {
      addCourse(newCourse);
      handleCloseModal();
    },
    [addCourse, handleCloseModal]
  );

  const handleEditCourse = useCallback((course: Course) => {
    setEditingCourse(course);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  }, []);

  const handleUpdateCourse = useCallback(
    (updatedCourse: Course, originalCourseId: string) => {
      // Need to adapt the course to match the store's expected format
      const adaptedCourse = {
        ...updatedCourse,
        id: originalCourseId, // Ensure the ID is set correctly
      };
      updateCourse(adaptedCourse);
      handleCloseModal();
    },
    [updateCourse, handleCloseModal]
  );

  const handleRemoveCourse = useCallback(
    (courseId: string) => {
      removeCourse(courseId);
    },
    [removeCourse]
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
        icon: <BookOpen className="h-4 w-4" />,
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
        <div className="p-5">
          <h1 className="mb-5 text-xl font-semibold">All Courses</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              Error: {error}. Please try refreshing the page.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.courseName}
                  course={course}
                  onEdit={handleEditCourse}
                  onRemove={handleRemoveCourse}
                />
              ))}
            </div>
          )}

          {/* Add/edit course modal */}
          <AddCourseModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            editCourse={editingCourse}
          />

          {/* Excel upload modal */}
          <UploadExcelModal
            isOpen={isExcelModalOpen}
            onClose={handleCloseExcelModal}
            title="Upload Course Data"
            youtubeEmbedId="dQw4w9WgXcQ"
            templateLink="/templates/course-template.xlsx"
            instructionSteps={[
              "Download the template file for correct formatting",
              "Fill in course details in the template",
              "Save the file as .xlsx or .xls format",
              "Upload the file using the dropzone below",
            ]}
            onUploadSuccess={handleExcelUploadSuccess}
            entityName="Course"
          />
        </div>
      </Sidebar>
    </ProtectedRoute>
  );
};

export default AdminCollegeCourses;
