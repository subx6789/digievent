"use client";
import { usePathname } from "next/navigation";

const TitleAndDescription = ({ description }: { description: string }) => {
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

  return (
    <div className="space-y-1 w-1/2">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-base text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default TitleAndDescription;
