"use client";
import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ThemeToggler/ThemeToggler";
import { sidebarDataSuperAdmin } from "@/utils/data/sidebarDataSuperAdmin";
import clsx from "clsx";
import { sidebarDataOrganizer } from "@/utils/data/sidebarDataOrganizer";
import { sidebarDataAdmin } from "@/utils/data/sidebarDataAdmin";
import TitleAndDescription from "../TitleAndDescription/TitleAndDescription";

const Header = () => {
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
            `hover:scale-105 transition-all duration-150 hover:bg-blue-700 dark:hover:bg-blue-700 h-11`,
            role === "admin"
              ? `bg-blue-600 text-white `
              : `bg-transparent border border-gray-400 text-black hover:text-white dark:border-gray-800 dark:text-white`
          )}
        >
          <DownloadIcon />
          Export Report
        </Button>
      </header>

      <div className="my-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
          <TitleAndDescription />
          {(pathname === "/admin/dashboard/organizers" ||
            pathname === "/super-admin/dashboard/manage-colleges" ||
            pathname === "/organizer/dashboard/events") && (
            <Button className="bg-blue-600 h-11 hover:bg-blue-700 text-white px-8 font-medium transition-all duration-150 hover:scale-105">
              {role === "admin"
                ? "+ Add Organizer"
                : role === "organizer"
                ? "+ Add Event"
                : "+ Add College"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
