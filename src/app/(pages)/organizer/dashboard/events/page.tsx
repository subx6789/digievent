import EventCard from "@/components/Card/EventCard";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventStates } from "@/utils/data/eventStates";
import { organizerEvents } from "@/utils/data/organizerEvents";
import { Calendar } from "lucide-react";
import React from "react";

const OrganizerEvents = () => {
  return (
    <Sidebar role="organizer">
      <div className="my-5 space-y-6">
        <div className="w-full">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row md:justify-end items-center gap-4 mt-4 md:mt-0">
            {/* Event State Filter */}
            <Select defaultValue="present">
              <SelectTrigger className="md:w-[320px] w-full bg-white dark:bg-gray-800 h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div className="flex items-center gap-3">
                  <Calendar className="h-[18px] w-[18px] text-gray-400" />
                  <SelectValue
                    placeholder="Select College"
                    className="text-gray-600 dark:text-gray-300"
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {eventStates.map((state, index) => (
                  <SelectItem value={state.id} key={index}>
                    {state.name}
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

        {/* Events Section */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {organizerEvents.map((event) => (
            <div
              key={event.id}
              className="p-1 hover:drop-shadow-lg transition-all duration-150"
            >
              <EventCard event={event} className="w-full max-w-sm mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default OrganizerEvents;
