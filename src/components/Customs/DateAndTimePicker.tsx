"use client";
import React, { useState, useEffect } from "react";
import { format, parse, startOfToday } from "date-fns";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/modal-provider";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  value?: string;
  onChange: (dateString: string) => void;
  className?: string;
}

interface DateRangePickerProps {
  value?: string;
  onChange: (dateRangeString: string) => void;
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const today = startOfToday();

  // Parse incoming value (expected to be in "MMM dd, yyyy" format)
  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "MMM dd, yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Format date as "Aug 12, 2025" and return that string
      const displayValue = format(selectedDate, "MMM dd, yyyy");
      onChange(displayValue);
      setOpen(false);
    } else {
      onChange("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative group", className)}>
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400 h-4 w-4 z-10 transition-colors" />
          <Input
            placeholder="Select date"
            value={date ? format(date, "MMM dd, yyyy") : ""}
            readOnly
            className="pl-10 h-11 cursor-pointer dark:bg-gray-800 bg-white dark:text-white text-black"
          />
          {date && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(undefined);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={{ before: today }}
          className="rounded-md border-0"
          classNames={{
            day_selected:
              "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white",
            day_today:
              "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400",
            day_disabled:
              "text-gray-300 dark:text-gray-600 cursor-not-allowed hover:bg-transparent",
            day_range_middle:
              "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
            day_hidden: "invisible",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label:
              "text-sm font-medium text-gray-900 dark:text-gray-100",
            nav: "flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
          }}
        />
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={() => handleSelect(undefined)}
            variant="outline"
            size="sm"
            className="w-full text-white bg-blue-600 hover:bg-blue-800"
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CustomDateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const today = startOfToday();
  // Parse incoming value (expected to be in "MMM dd, yyyy - MMM dd, yyyy" format)
  useEffect(() => {
    if (value) {
      const parts = value.split(" - ");
      if (parts.length === 2) {
        const fromDate = parse(parts[0], "MMM dd, yyyy", new Date());
        const toDate = parse(parts[1], "MMM dd, yyyy", new Date());

        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          setDateRange({ from: fromDate, to: toDate });
        }
      }
    }
  }, [value]);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      // Format range as "Aug 12, 2025 - Aug 15, 2025" and return that string
      const displayValue = `${format(range.from, "MMM dd, yyyy")} - ${format(
        range.to,
        "MMM dd, yyyy"
      )}`;
      onChange(displayValue);
      setOpen(false);
    } else {
      onChange("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative group", className)}>
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400 h-4 w-4 z-10 transition-colors" />
          <Input
            placeholder="Select date range"
            value={
              dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
                    dateRange.to,
                    "MMM dd, yyyy"
                  )}`
                : ""
            }
            readOnly
            className="pl-10 h-11 cursor-pointer dark:bg-gray-800 bg-white dark:text-white text-black"
          />
          {dateRange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(undefined);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          initialFocus
          numberOfMonths={2}
          disabled={{ before: today }}
          className="rounded-md border-0"
          classNames={{
            day_selected:
              "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white",
            day_today:
              "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400",
            day_disabled:
              "text-gray-300 dark:text-gray-600 cursor-not-allowed hover:bg-transparent",
            day_range_middle:
              "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
            day_hidden: "invisible",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label:
              "text-sm font-medium text-gray-900 dark:text-gray-100",
            nav: "flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
            day_range_start: "rounded-l-md",
            day_range_end: "rounded-r-md",
          }}
        />
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex space-x-2">
          <Button
            onClick={() => handleSelect(undefined)}
            variant="outline"
            size="sm"
            className="flex-1 text-white bg-blue-600 hover:bg-blue-800"
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CustomTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  className,
}) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");
  const [isOpen, setIsOpen] = useState(false);
  // We'll store the final display string (e.g. "2:00 PM IST")
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generate 12-hour format hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const ampm = ["AM", "PM"];

  // Parse the incoming value using expected display format "h:mm a 'IST'"
  useEffect(() => {
    if (value) {
      const parsedTime = parse(value, "h:mm a 'IST'", new Date());
      if (!isNaN(parsedTime.getTime())) {
        const formatted = format(parsedTime, "h:mm a") + " IST";
        setSelectedTime(formatted);

        // Set the individual components
        setSelectedHour(format(parsedTime, "hh"));
        setSelectedMinute(format(parsedTime, "mm"));
        setSelectedAmPm(format(parsedTime, "a") as "AM" | "PM");
      }
    }
  }, [value]);

  const handleTimeChange = () => {
    if (selectedHour && selectedMinute && selectedAmPm) {
      // Convert to 24h format for internal processing
      let hour24 = parseInt(selectedHour);
      if (selectedAmPm === "PM" && hour24 < 12) hour24 += 12;
      if (selectedAmPm === "AM" && hour24 === 12) hour24 = 0;

      const hour24Str = hour24.toString().padStart(2, "0");
      const newTime24 = `${hour24Str}:${selectedMinute}`;

      // Format for display
      const display =
        format(new Date(`1970-01-01T${newTime24}:00`), "h:mm a") + " IST";
      setSelectedTime(display);
      onChange(display);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setSelectedHour(null);
    setSelectedMinute(null);
    setSelectedAmPm("AM");
    setSelectedTime("");
    onChange("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative group", className)}>
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400 h-4 w-4 z-10 transition-colors" />
          <Input
            placeholder="Select time"
            value={selectedTime}
            readOnly
            className="pl-10 h-11 cursor-pointer dark:bg-gray-800 bg-white dark:text-white text-black"
          />
          {selectedTime && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-[350px] max-h-[500px] flex flex-col">
        <DialogHeader className="flex-shrink-0 p-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-gray-900 dark:text-gray-100 text-lg font-medium">
            Select Time
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hour
              </label>
              <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => setSelectedHour(hour)}
                    className={cn(
                      "p-3 text-center cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors",
                      selectedHour === hour &&
                        "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
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
              <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    onClick={() => setSelectedMinute(minute)}
                    className={cn(
                      "p-3 text-center cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors",
                      selectedMinute === minute &&
                        "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                    )}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AM/PM
              </label>
              <div className="h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col">
                {ampm.map((period) => (
                  <div
                    key={period}
                    onClick={() => setSelectedAmPm(period as "AM" | "PM")}
                    className={cn(
                      "p-3 text-center cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex-1 flex items-center justify-center",
                      selectedAmPm === period &&
                        "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                    )}
                  >
                    {period}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between space-x-2 p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="flex-1 dark:text-white text-black bg-transparent"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleTimeChange}
            disabled={!selectedHour || !selectedMinute}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
