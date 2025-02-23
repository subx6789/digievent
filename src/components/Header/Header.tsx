"use client";
import { DownloadIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ThemeToggler/ThemeToggler";
import { sidebarDataSuperAdmin } from "@/utils/data/sidebarDataSuperAdmin";
import clsx from "clsx";

const Header = () => {
  const pathname = usePathname();

  // Extract the title from the pathname
  const getTitleFromPathname = (path: string) => {
    const segments = path.split("/").filter(Boolean); // Filter out empty segments
    const lastSegment = segments[segments.length - 1] || "Dashboard"; // Default to "Dashboard" if no segment

    // Capitalize each word and replace "-" or "_" with a space
    return lastSegment
      .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
      .split(" ") // Split words for capitalization
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join words with spaces
  };

  const title = getTitleFromPathname(pathname);

  const role = pathname.split("/")[1];

  return (
    <header className="flex h-16 items-center justify-between">
      <div className="flex gap-2 items-center">
        <SidebarTrigger className="-ml-1" />
        <ModeToggle />
      </div>

      <h1 className="text-lg font-semibold">
        {role === "admin"
          ? title
          : `Welcome Back, ${sidebarDataSuperAdmin.user.name.split(" ")[0]}`}
      </h1>
      <Button
        className={clsx(
          `hover:scale-105 transition-all duration-150 hover:bg-blue-700 dark:hover:bg-blue-700`,
          role === "admin"
            ? `bg-blue-600 text-white `
            : `bg-transparent border border-gray-400 text-black hover:text-white dark:border-gray-800 dark:text-white`
        )}
      >
        {role === "admin" ? (
          <>
            <Plus /> Add Organiser
          </>
        ) : (
          <>
            <DownloadIcon />
            Export Report
          </>
        )}
      </Button>
    </header>
  );
};

export default Header;
