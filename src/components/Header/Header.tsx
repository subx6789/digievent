"use client";
import { CalendarPlus, DownloadIcon, SquarePlus, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ThemeToggler/ThemeToggler";
import { sidebarDataSuperAdmin } from "@/utils/data/sidebarDataSuperAdmin";
import clsx from "clsx";
import { sidebarDataOrganizer } from "@/utils/data/sidebarDataOrganizer";
import { sidebarDataAdmin } from "@/utils/data/sidebarDataAdmin";
import TitleAndDescription from "../TitleAndDescription/TitleAndDescription";

interface HeaderProps {
  onAddClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
  const pathname = usePathname();

  const role = pathname.split("/")[1];

  return (
    <section>
      <header className="flex h-16 items-center justify-between">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="-ml-1" />
          <ModeToggle />
        </div>

        <h1 className="text-lg font-semibold">
          Welcome Back,{" "}
          {role === "super-admin"
            ? sidebarDataSuperAdmin.user.name.split(" ")[0]
            : role === "organizer"
            ? sidebarDataOrganizer.user.name.split(" ")[0]
            : sidebarDataAdmin.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
        </h1>
        <Button
          className={clsx(
            "hover:scale-105 px-8 transition-all duration-150 hover:bg-blue-700 dark:hover:bg-blue-700 h-11 bg-blue-600 text-white"
          )}
        >
          <span className="flex items-center gap-2">
            <DownloadIcon />
            Export Report
          </span>
        </Button>
      </header>

      <div className="my-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
          <TitleAndDescription />
          {(pathname === "/admin/dashboard/organizers" ||
            pathname === "/admin/dashboard/students" ||
            pathname === "/admin/dashboard/courses" ||
            pathname === "/super-admin/dashboard/manage-colleges" ||
            pathname === "/organizer/dashboard/events") && (
            <Button
              className="bg-blue-600 h-11 hover:bg-blue-700 text-white px-6 font-medium transition-all duration-150 hover:scale-105"
              onClick={onAddClick}
            >
              {role === "admin" ? (
                <span className="flex items-center gap-2">
                  <UserPlus />
                  Add{" "}
                  {pathname === "/admin/dashboard/students"
                    ? `Student`
                    : pathname === "/admin/dashboard/courses"
                    ? `Course`
                    : `Organizer`}
                </span>
              ) : role === "organizer" ? (
                <span className="flex items-center gap-2">
                  <CalendarPlus />
                  Add Event
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SquarePlus />
                  Add College
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
