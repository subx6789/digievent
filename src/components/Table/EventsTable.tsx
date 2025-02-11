"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { EventTable } from "@/types/eventTable";
import clsx from "clsx";

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

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
  currentEvents: EventTable[];
  pastEvents: EventTable[];
  upcomingEvents: EventTable[];
};

const EventsTable = ({
  currentEvents,
  pastEvents,
  upcomingEvents,
}: TableProps) => {
  const [activeTab, setActiveTab] = useState("current");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getEventsForTab = () => {
    switch (activeTab) {
      case "current":
        return currentEvents;
      case "upcoming":
        return upcomingEvents;
      case "past":
        return pastEvents;
      default:
        return currentEvents;
    }
  };

  const events = getEventsForTab();
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const currentPageEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      Educational: "bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-white",
      Fun: "bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-white",
      Gaming:
        "bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-white",
      Business: "bg-green-200 text-green-900 dark:bg-green-700 dark:text-white",
    };
    return (
      colors[category as keyof typeof colors] ??
      "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
    );
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
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 px-6">
          <Tab
            label="Current Events"
            active={activeTab === "current"}
            onClick={() => setActiveTab("current")}
          />
          <Tab
            label="Upcoming Events"
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          />
          <Tab
            label="Past Events"
            active={activeTab === "past"}
            onClick={() => setActiveTab("past")}
          />
        </div>
      </div>

      <div className="p-5">
        <table className="w-full text-gray-900 dark:text-white">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="text-left pb-3 px-4 text-sm font-medium">Event</th>
              <th className="text-left pb-3 px-4 text-sm font-medium">Date</th>
              <th className="text-left pb-3 px-4 text-sm font-medium">
                Category
              </th>
              <th className="text-left pb-3 px-4 text-sm font-medium">
                Tickets Sold
              </th>
              <th className="text-left pb-3 px-4 text-sm font-medium">
                Revenue
              </th>
              <th className="text-left pb-3 px-4 text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageEvents.map((event) => (
              <tr
                key={event.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-4 flex items-center gap-3">
                  <Image
                    src={event.image}
                    width={40}
                    height={40}
                    alt={event.name}
                    className="rounded-lg"
                  />
                  <div>{event.name}</div>
                </td>
                <td className="p-4">{event.date}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                </td>
                <td className="p-4">{event.ticketsSold}</td>
                <td className="p-4">₹{event.revenue.toLocaleString()}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(event.status)}`}
                  >
                    {event.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pb-5 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default EventsTable;
