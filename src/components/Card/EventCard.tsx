"use client";

import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CalendarIcon,
  MapPinIcon,
  Tag,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getCategoryColor } from "../Table/EventsTable";

import { Clock, AlertCircle } from "lucide-react";

interface EventCardProps {
  event: Event;
  className?: string;
  onEdit?: (event: Event) => void;
  onView?: (eventId: string) => void;
}

const EventCard = ({ event, className, onEdit, onView }: EventCardProps) => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes("/admin");
  const isOrganizer = pathname?.includes("/organizer");

  const handleApprove = (id: string) => {
    console.log(`Approved Event with ID: ${id}`);
  };

  const handleDeny = (id: string) => {
    console.log(`Denied Event with ID: ${id}`);
  };

  const handleViewDetails = (id: string) => {
    onView?.(id);
  };

  const handleEdit = () => {
    onEdit?.(event);
  };

  // Add this near the other handler functions
  const handleReRequest = () => {
    console.log(`Re-requesting event: ${event.id}`);
  };

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 h-full",
        isOrganizer &&
          event.status === "pending" &&
          "opacity-85 grayscale-[30%]",
        isOrganizer &&
          event.status === "rejected" &&
          "opacity-80 grayscale-[40%] border-red-200 dark:border-red-900",
        className
      )}
    >
      {/* Image Section with overlay gradient and badges */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3">
          <Badge
            variant="secondary"
            className={cn(
              "py-2 px-3 font-medium text-sm",
              getCategoryColor(event.category)
            )}
          >
            <Tag className="h-3.5 w-3.5 mr-1" />
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Content Section with fixed heights */}
      <div className="flex flex-col flex-grow">
        <CardHeader className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
            {event.title}
          </h3>
        </CardHeader>

        <CardContent className="px-4 pb-2 pt-0 flex-grow">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 min-h-[4rem]">
            {event.description}
          </p>

          <div className="space-y-2 text-sm mb-3">
            {!isOrganizer && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{event.organiser}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {event.date} • {event.time}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {event.location ? event.location : "Virtual"}
              </span>
            </div>
          </div>

          <div className="py-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1 min-h-[0.5rem]">
              {event.price === "Free" ||
              event.price === "0" ||
              event.price === "" ||
              event.price === undefined ||
              event.price === null
                ? "Free"
                : "₹" + event.price}
            </h3>
          </div>
        </CardContent>

        {/* Replace the existing organizer section in CardFooter with this conditional rendering */}
        <CardFooter className="p-4 pt-2 mt-auto">
          {isAdmin && (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 duration-150 transition-all h-11 font-medium text-base"
                onClick={() => handleApprove(event.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="default"
                className="bg-red-600 hover:bg-red-700 text-white hover:scale-105 duration-150 transition-all h-11 font-medium text-base"
                onClick={() => handleDeny(event.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Deny
              </Button>
            </div>
          )}

          {isOrganizer && (
            <>
              {event.status === "approved" && (
                <div className="flex items-center justify-between gap-3 w-full">
                  <Button
                    className="flex-1 h-11 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02]"
                    onClick={() => handleViewDetails(event.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Event
                  </Button>
                  <Button
                    className="h-11 w-11 rounded-lg text-sm font-medium text-white bg-gray-500 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02] flex items-center justify-center"
                    onClick={handleEdit}
                    variant="default"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {event.status === "pending" && (
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 py-2 rounded-md h-11">
                    <Clock className="h-5 w-5 animate-pulse" />
                    <span className="text-sm font-medium">
                      Awaiting Approval
                    </span>
                  </div>
                </div>
              )}

              {event.status === "rejected" && (
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 mb-3 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 py-2 rounded-md h-11">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Event Rejected</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 w-full">
                    <Button
                      className="flex-1 h-11 rounded-lg text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02]"
                      onClick={handleReRequest}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Re-request
                    </Button>
                    <Button
                      className="h-11 w-11 rounded-lg text-sm font-medium text-white bg-gray-500 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02] flex items-center justify-center"
                      onClick={handleEdit}
                      variant="default"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isAdmin && !isOrganizer && (
            <Button
              size="sm"
              variant="default"
              className="w-full"
              onClick={() => handleViewDetails(event.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Event
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default EventCard;
