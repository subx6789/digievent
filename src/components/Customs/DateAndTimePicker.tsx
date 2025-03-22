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
} from "@/components/ui/modal-provider";
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
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4 z-10" />
          <Input
            placeholder="dd-mm-yyyy"
            value={selectedDay ? format(selectedDay, "MMM dd, yyyy") : ""}
            readOnly
            className="pl-10 h-10 cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Select Date
          </DialogTitle>
        </DialogHeader>
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={handleDaySelect}
          disabled={{ before: today }}
          className="w-full p-4"
          classNames={{
            caption: "flex justify-between items-center mb-4",
            caption_label:
              "text-sm font-semibold text-gray-700 dark:text-gray-300",
            nav: "flex items-center space-x-1",
            nav_button: cn(
              "h-8 w-8 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300",
              "disabled:cursor-not-allowed disabled:opacity-50"
            ),
            head: "border-b border-gray-200 dark:border-gray-700 pb-2",
            head_row: "flex",
            head_cell:
              "w-12 text-center text-xs font-medium text-gray-500 dark:text-gray-400",
            row: "flex",
            cell: "w-12 text-center",
            day: cn(
              "h-10 w-10 p-2 rounded-full text-sm text-gray-800 dark:text-gray-200",
              "hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300",
              "focus:bg-blue-500 focus:text-white dark:focus:text-white",
              "aria-selected:bg-blue-500 aria-selected:text-white dark:aria-selected:text-white"
            ),
            day_today:
              "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            day_outside: "text-gray-300 dark:text-gray-600",
            day_disabled:
              "text-gray-300 dark:text-gray-600 cursor-not-allowed hover:bg-transparent",
            day_selected: "bg-blue-500 text-white dark:text-white",
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
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4 z-10" />
          <Input
            placeholder="--:--"
            value={selectedTime}
            readOnly
            className="pl-10 h-10 cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Select Time
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hour
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {hours.map((hour) => (
                <div
                  key={hour}
                  onClick={() => setSelectedHour(hour)}
                  className={cn(
                    "p-2 text-center cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    selectedHour === hour &&
                      "bg-blue-600 dark:bg-blue-700 text-white dark:text-white"
                  )}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minute
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {minutes.map((minute) => (
                <div
                  key={minute}
                  onClick={() => setSelectedMinute(minute)}
                  className={cn(
                    "p-2 text-center cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    selectedMinute === minute &&
                      "bg-blue-600 dark:bg-blue-700 text-white dark:text-white"
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
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
