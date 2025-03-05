"use client";
import React, { useState, useEffect } from "react";
import { format, startOfToday, isBefore, parse } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value?: string;
  onChange: (dateString: string) => void;
  className?: string;
}

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  className?: string;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const today = startOfToday();

  const handleDaySelect = (day: Date | undefined) => {
    if (day && !isBefore(day, today)) {
      setSelectedDay(day);
      // Format day as "Aug 12, 2025" and return that string
      const displayValue = format(day, "MMM dd, yyyy");
      onChange(displayValue);
      setIsOpen(false);
    }
  };

  // Parse incoming value (expected to be in "MMM dd, yyyy" format)
  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "MMM dd, yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDay(parsedDate);
      }
    }
  }, [value]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative", className)}>
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            placeholder="dd-mm-yyyy"
            value={selectedDay ? format(selectedDay, "MMM dd, yyyy") : ""}
            readOnly
            className="pl-10 h-10 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={handleDaySelect}
          disabled={{ before: today }}
          className="w-full p-4"
          classNames={{
            caption: "flex justify-between items-center mb-4",
            caption_label: "text-sm font-semibold text-gray-700",
            nav: "flex items-center space-x-1",
            nav_button: cn(
              "h-8 w-8 bg-transparent hover:bg-gray-100 rounded-full",
              "disabled:cursor-not-allowed disabled:opacity-50"
            ),
            head: "border-b pb-2",
            head_row: "flex",
            head_cell: "w-12 text-center text-xs font-medium text-gray-500",
            row: "flex",
            cell: "w-12 text-center",
            day: cn(
              "h-10 w-10 p-2 rounded-full text-sm",
              "hover:bg-blue-100 hover:text-blue-600",
              "focus:bg-blue-500 focus:text-white",
              "aria-selected:bg-blue-500 aria-selected:text-white"
            ),
            day_today: "bg-blue-50 text-blue-600",
            day_outside: "text-gray-300",
            day_disabled:
              "text-gray-300 cursor-not-allowed hover:bg-transparent",
            day_selected: "bg-blue-500 text-white",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export const CustomTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  // We'll store the final display string (e.g. "2:00 PM IST")
  const [selectedTime, setSelectedTime] = useState<string>("");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Parse the incoming value using expected display format "h:mm a 'IST'"
  useEffect(() => {
    if (value) {
      const parsedTime = parse(value, "h:mm a 'IST'", new Date());
      if (!isNaN(parsedTime.getTime())) {
        const formatted = format(parsedTime, "h:mm a") + " IST";
        setSelectedTime(formatted);
      }
    }
  }, [value]);

  const handleTimeChange = () => {
    if (selectedHour && selectedMinute) {
      // Build 24h time then format it to display format (e.g. "2:00 PM IST")
      const newTime24 = `${selectedHour}:${selectedMinute}`;
      const display =
        format(new Date(`1970-01-01T${newTime24}:00`), "h:mm a") + " IST";
      setSelectedTime(display);
      onChange(display);
      setIsOpen(false);
      // Clear the temporary selections
      setSelectedHour(null);
      setSelectedMinute(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative", className)}>
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Input
            placeholder="--:--"
            value={selectedTime}
            readOnly
            className="pl-10 h-10 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Time</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hour
            </label>
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {hours.map((hour) => (
                <div
                  key={hour}
                  onClick={() => setSelectedHour(hour)}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200 hover:text-black",
                    selectedHour === hour && "bg-blue-600 text-white"
                  )}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minute
            </label>
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  onClick={() => setSelectedMinute(minute)}
                  className={cn(
                    "p-2 text-center cursor-pointer hover:bg-gray-200 hover:text-black",
                    selectedMinute === minute && "bg-blue-600 text-white"
                  )}
                >
                  {minute}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={handleTimeChange}
            disabled={!selectedHour || !selectedMinute}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
