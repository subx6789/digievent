"use client";
import { usePathname } from "next/navigation";

const TitleAndDescription = () => {
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

  const descriptions: Record<string, string> = {
    "/admin/dashboard/overview": "Overview of admin dashboard",
    "/admin/dashboard/event-requests": "Event-req of admin dashboard",
    "/admin/dashboard/organizers": "Oragnisers of admin dashboard",
    "/admin/dashboard/courses": "Add / remove courses",
    "/admin/dashboard/students": "Add / remove students",
    "/super-admin/dashboard/overview": "Overview of super admin dashboard",
    "/super-admin/dashboard/manage-colleges":
      "Manage colleges of super admin dashboard",
    "/organizer/dashboard/events": "Events of organizers dashboard",
    "/organizer/dashboard/metrics": "Metrics of organizer dashboard",
  };

  return (
    <div className="space-y-1 w-1/2">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-base text-gray-500 dark:text-gray-400">
        {descriptions[pathname] ?? "Welcome to dashboard description"}
      </p>
    </div>
  );
};

export default TitleAndDescription;
