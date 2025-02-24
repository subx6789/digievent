import Sidebar from "@/components/Sidebar/Sidebar";
import { CollegeTable } from "@/components/Table/CollegeTable";
import TitleAndDescription from "@/components/TitleAndDescription/TitleAndDescription";
import { Button } from "@/components/ui/button";
import { mockColleges } from "@/utils/data/mockColleges";
import React from "react";

const ManageColleges = () => {
  return (
    <Sidebar role="super-admin">
      <div className="my-5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
          <TitleAndDescription description="Add/Suspend colleges" />
          <Button className="bg-blue-600 h-11 hover:bg-blue-700 text-white px-8 font-medium transition-all duration-150 hover:scale-105">
            + Add College
          </Button>
        </div>

        {/* Passing colleges array only, pagination is handled inside CollegeTable */}
        <CollegeTable colleges={mockColleges} />
      </div>
    </Sidebar>
  );
};

export default ManageColleges;
