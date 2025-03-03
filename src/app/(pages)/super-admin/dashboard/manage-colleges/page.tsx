"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import { College, CollegeTable } from "@/components/Table/CollegeTable";
import { mockColleges } from "@/utils/data/mockColleges";
import React, { useState } from "react";
import AddCollegeModal from "@/components/Modals/AddCollegeModal";
import Header from "@/components/Header/Header";

const ManageColleges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colleges, setColleges] = useState<College[]>(mockColleges);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCollege = (newCollege: College) => {
    setColleges((prevColleges) => {
      const updatedColleges = [...prevColleges, newCollege];
      // console.log("Updated Colleges List:", updatedColleges); // Debugging
      return updatedColleges;
    });
  };

  return (
    <Sidebar role="super-admin">
      {/* Pass the handleOpenModal function to the Header component */}
      <Header onAddClick={handleOpenModal} />

      <div className="my-5 space-y-6">
        {/* Use the updated colleges state instead of mockColleges */}
        <CollegeTable colleges={colleges} />
      </div>

      {/* Add College Modal */}
      <AddCollegeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddCollege={handleAddCollege}
      />
    </Sidebar>
  );
};

export default ManageColleges;
