"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/event";
import {
  CustomDatePicker,
  CustomDateRangePicker,
  CustomTimePicker,
} from "@/components/Customs/DateAndTimePicker";

// Form schema
const formSchema = z.object({
  dayType: z.enum(["single day", "multi day"]),
  date: z.string().optional(),
  dateRange: z.string().optional(),
  time: z.string().min(1, "Please enter a start time"),
  duration: z.string().min(1, "Please enter the duration"),
});

interface DateTimeFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
}

const DateTimeForm = ({ formData, updateFormData }: DateTimeFormProps) => {
  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayType: formData.dayType || "single day",
      date: formData.date || "",
      dateRange: formData.dateRange || "",
      time: formData.time || "",
      duration: formData.duration || "",
    },
  });

  // Watch for dayType changes
  const dayType = form.watch("dayType");

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFormData(values);
  };

  // Auto-save on field change
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Event>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dayType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Event Duration</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single day" id="single-day" />
                    <Label htmlFor="single-day">Single Day Event</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multi day" id="multi-day" />
                    <Label htmlFor="multi-day">Multi-Day Event</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select whether your event takes place on a single day or spans
                multiple days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {dayType === "single day" ? (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <CustomDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The date when your event will take place.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Range</FormLabel>
                <FormControl>
                  <CustomDateRangePicker
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The start and end dates of your multi-day event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <CustomTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The time when your event will start.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 2.5"
                    {...field}
                    step="0.5"
                    min="0.5"
                    className="h-11 dark:bg-gray-800 bg-white dark:text-white text-black"
                  />
                </FormControl>
                <FormDescription>
                  How long the event will last (in hours).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default DateTimeForm;
