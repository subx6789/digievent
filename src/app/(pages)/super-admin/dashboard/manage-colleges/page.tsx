import Sidebar from "@/components/Sidebar/Sidebar";
import { CollegeTable } from "@/components/Table/CollegeTable";
import { mockColleges } from "@/utils/data/mockColleges";
import React from "react";

const ManageColleges = () => {
  return (
    <Sidebar role="super-admin">
      <div className="my-5 space-y-6">
        {/* Passing colleges array only, pagination is handled inside CollegeTable */}
        <CollegeTable colleges={mockColleges} />
      </div>
    </Sidebar>
  );
};

export default ManageColleges;
