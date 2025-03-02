"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EventTable } from "@/types/eventTable";
import clsx from "clsx";
import { allEvents } from "@/utils/data/allEvents";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const getCategoryColor = (category: string) => {
  const colors = {
    Educational: "bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white",
    Fun: "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-white",
    Gaming: "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-white",
    Business: "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white",
  };
  return (
    colors[category as keyof typeof colors] ??
    "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
  );
};

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "px-4 py-5 font-medium relative text-sm w-full transition-all",
      active
        ? "dark:text-white border-b-2 border-blue-500 dark:border-blue-400 text-black"
        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
    )}
  >
    {label}
  </button>
);

type TableProps = {
  events: typeof allEvents;
};

const EventsTable = ({ events }: TableProps) => {
  const [activeTab, setActiveTab] = useState<"present" | "upcoming" | "past">(
    "present"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<EventTable[]>([]);
  const itemsPerPage = 3;

  const allCombinedEvents = useMemo(
    () => [...events.present, ...events.past, ...events.upcoming],
    [events]
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const filtered = allCombinedEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.date.toLowerCase().includes(query) ||
          event.status.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    } else {
      switch (activeTab) {
        case "present":
          setFilteredEvents(events.present);
          break;
        case "upcoming":
          setFilteredEvents(events.upcoming);
          break;
        case "past":
          setFilteredEvents(events.past);
          break;
        default:
          setFilteredEvents(events.present);
      }
    }
    setCurrentPage(1);
  }, [searchQuery, activeTab, events, allCombinedEvents]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentPageEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    range.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) range.push("ellipsis-start");
    for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);
    if (rangeEnd < totalPages - 1) range.push("ellipsis-end");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active:
        "bg-green-300 text-green-900 border-green-500 dark:bg-green-800 dark:text-white",
      Scheduled:
        "bg-blue-300 text-blue-900 border-blue-500 dark:bg-blue-800 dark:text-white",
      Completed:
        "bg-gray-300 text-gray-900 border-gray-500 dark:bg-gray-800 dark:text-white",
    };
    return (
      colors[status as keyof typeof colors] ??
      "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
    );
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-xl">
      <div className="p-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search across all events..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 py-5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 px-6 overflow-x-auto">
          <Tab
            label="Present Events"
            active={activeTab === "present" && searchQuery.trim() === ""}
            onClick={() => {
              setActiveTab("present");
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
          <Tab
            label="Upcoming Events"
            active={activeTab === "upcoming" && searchQuery.trim() === ""}
            onClick={() => {
              setActiveTab("upcoming");
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
          <Tab
            label="Past Events"
            active={activeTab === "past" && searchQuery.trim() === ""}
            onClick={() => {
              setActiveTab("past");
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-300 dark:border-gray-700">
              <TableHead className="py-4 px-6 text-base font-medium">
                Event
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-medium">
                Date
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-medium">
                Category
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-medium">
                Tickets Sold
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-medium">
                Revenue
              </TableHead>
              <TableHead className="py-4 px-6 text-base font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageEvents.length > 0 ? (
              currentPageEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                >
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage
                            src={event.image}
                            alt={event.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                            {event.name
                              .toUpperCase()
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="font-medium">{event.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">{event.date}</TableCell>
                  <TableCell className="py-5 px-6">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {event.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {event.ticketsSold}
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {event.revenue === 0
                      ? "Free"
                      : `₹${event.revenue.toLocaleString()}`}
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-sm ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="py-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getPaginationRange().map((page, i) => (
                <PaginationItem key={i}>
                  {page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page as number)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default EventsTable;
