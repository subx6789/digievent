import { StatsCard } from "@/components/Card/StatsCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCardDataSuperAdmin } from "@/utils/data/statCardDataSuperAdmin";
import { colleges, timePeriods } from "@/utils/data/superAdminOverviewFilters";
import { Building2, Calendar } from "lucide-react";

const Overview = () => {
  return (
    <Sidebar role="super-admin">
      <div className="my-5 space-y-6">
        <div className="w-full">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row md:justify-end items-center gap-4 mt-4 md:mt-0">
            {/* College Filter */}
            <Select defaultValue="techno-india-uni-kol">
              <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div className="flex items-center gap-3">
                  <Building2 className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue
                    placeholder="Select College"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college, index) => (
                  <SelectItem value={college.id} key={index}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Period Filter */}
            <Select defaultValue="30-days">
              <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div className="flex items-center gap-3">
                  <Calendar className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue
                    placeholder="Select Time Period"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((timePeriod, index) => (
                  <SelectItem value={timePeriod.id} key={index}>
                    {timePeriod.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button className="bg-blue-600 h-11 hover:bg-blue-700 text-white px-8 font-medium transition-all duration-150 hover:scale-105 w-full md:w-auto">
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {StatCardDataSuperAdmin.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Overview;
