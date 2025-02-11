"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/event";
import { Button } from "../ui/button";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const handleApprove = (id: string) => {
    console.log(`Approved Event with ID: ${id}`);
  };

  const handleDeny = (id: string) => {
    console.log(`Denied Event with ID: ${id}`);
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-900 dark:text-white max-w-md mx-auto md:max-w-lg lg:max-w-xl h-full">
      {/* Image Section */}
      <div className="relative h-52 w-full md:h-60 lg:h-64">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-white/80 dark:bg-gray-800 px-3 py-1 text-sm font-semibold shadow-md backdrop-blur-md">
            {event.category}
          </span>
        </div>
      </div>

      {/* Card Header */}
      <CardHeader className="p-6 flex flex-col flex-grow">
        <span className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm w-fit">
          {event.organiser}
        </span>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[48px]">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 min-h-[72px]">
          {event.description}
        </p>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="px-5 flex flex-col gap-3 flex-grow">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm">
            {event.date} • {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <MapPinIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm">{event.location}</span>
        </div>
      </CardContent>

      {/* Price Section */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-lg font-bold text-gray-900 dark:text-white flex justify-between items-center">
        <span>{event.price === "Free" ? "Free" : "₹ " + event.price}</span>
      </div>

      {/* Card Footer */}
      <CardFooter className="p-6 flex flex-col gap-4 w-full mt-auto">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            className="bg-green-500 text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-200 w-full sm:w-auto"
            onClick={() => handleApprove(event.id)}
          >
            Approve
          </Button>
          <Button
            className="bg-red-500 text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 w-full sm:w-auto"
            onClick={() => handleDeny(event.id)}
          >
            Deny
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
