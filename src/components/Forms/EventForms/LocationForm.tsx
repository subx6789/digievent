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
import { Switch } from "@/components/ui/switch";
import { Event } from "@/types/event";
import { MapPin, Globe, IndianRupee } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Form schema with conditional validation
const formSchema = z
  .object({
    eventType: z.enum(["physical", "virtual"]),
    venue: z.string().optional(),
    virtualLink: z
      .string()

      .optional(),
    isFree: z.boolean(),
    price: z
      .string()

      .optional(),
  })
  .refine(
    (data) => {
      if (data.eventType === "physical") {
        return data.venue && data.venue.length >= 5;
      }
      return true;
    },
    {
      message: "Venue must be at least 5 characters for physical events",
      path: ["venue"],
    }
  )
  .refine(
    (data) => {
      if (data.eventType === "virtual") {
        return (
          data.virtualLink &&
          /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/.test(
            data.virtualLink
          )
        );
      }
      return true;
    },
    {
      message: "Invalid URL format. Use https://URL_ADDRESS",
      path: ["virtualLink"],
    }
  )
  .refine(
    (data) => {
      if (data.isFree === false) {
        return data.price && /^(?:\d+(\.\d*)?|\.\d+)$/.test(data.price);
      }
      return true;
    },
    {
      message: "Price must be greater than zero",
      path: ["price"],
    }
  );

interface LocationFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
  editMode?: boolean;
  restrictions?: {
    isFree?: {
      value?: boolean;
      canEdit: boolean;
    };
  };
}

const LocationForm = ({
  formData,
  updateFormData,
  editMode = false,
  restrictions,
}: LocationFormProps) => {
  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      eventType: formData.eventType || "physical",
      venue: formData.venue || "",
      virtualLink: formData.virtualLink || "",
      isFree: formData.isFree !== undefined ? formData.isFree : true,
      price: formData.price || "",
    },
  });

  // Watch for changes
  const eventType = form.watch("eventType");
  const isFree = form.watch("isFree");

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

  // Check if isFree is restricted from editing
  const isIsFreeDisabled =
    editMode && restrictions?.isFree && !restrictions.isFree.canEdit;

  const handleRestrictedSwitchClick = () => {
    if (isIsFreeDisabled) {
      toast({
        title: "Cannot Change Pricing Type",
        description:
          "Free events cannot be changed to paid events and vice versa after creation.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="physical" id="physical" />
                    <Label htmlFor="physical" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      Physical Event
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="virtual" id="virtual" />
                    <Label htmlFor="virtual" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-600" />
                      Virtual Event
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select whether your event will be held in-person or online.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {eventType === "physical" ? (
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                    <Input
                      placeholder="Enter the physical location of your event"
                      {...field}
                      className="pl-10 h-11 bg-white text-black dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Provide the full address and any specific instructions for
                  finding the venue.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="virtualLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Virtual Meeting Link</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                    <Input
                      placeholder="e.g., Zoom, Google Meet, or Microsoft Teams link"
                      {...field}
                      className="pl-10 h-11 dark:bg-gray-800 bg-white dark:text-white text-black"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Provide a link to the virtual meeting platform you&apos;ll be
                  using.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <h3 className="text-lg font-medium mb-4">Pricing Information</h3>

          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Free Event</FormLabel>
                  <FormDescription>
                    Toggle this if your event is free to attend.
                    {isIsFreeDisabled && (
                      <span className="block text-amber-500 mt-1">
                        Pricing type cannot be changed after event creation.
                      </span>
                    )}
                  </FormDescription>
                </div>
                <FormControl>
                  <div onClick={handleRestrictedSwitchClick}>
                    <Switch
                      checked={field.value}
                      onCheckedChange={
                        isIsFreeDisabled ? undefined : field.onChange
                      }
                      disabled={isIsFreeDisabled}
                      className={`bg-gray-300 data-[state=checked]:bg-blue-600 dark:bg-gray-700 dark:data-[state=checked]:bg-blue-500 ${
                        isIsFreeDisabled ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {!isFree && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Ticket Price (₹)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                      <Input
                        type="text"
                        placeholder="Enter ticket price"
                        {...field}
                        className="pl-10 h-11 dark:bg-gray-800 bg-white dark:text-white text-black"
                        min="0"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The price per ticket in Indian Rupees.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </form>
    </Form>
  );
};

export default LocationForm;
