"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/modal-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Tag,
  Calendar,
  MapPin,
  IndianRupee,
  Sofa,
  Clock,
  Globe,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import {
  CustomDatePicker,
  CustomTimePicker,
} from "../Customs/DateAndTimePicker";
import { useDropzone } from "react-dropzone";

const eventCategories = [
  { id: "edu", name: "Educational" },
  { id: "gam", name: "Gaming" },
  { id: "bus", name: "Business" },
  { id: "fun", name: "Fun" },
];

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Event title must be at least 2 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    date: z.string().min(1, { message: "Event date is required" }),
    time: z.string().min(1, { message: "Event time is required" }),
    venue: z.string().optional(),
    virtualLink: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(val),
        { message: "Please enter a valid URL" }
      ),
    category: z.string().min(1, { message: "Category is required" }),
    capacity: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Capacity must be a positive number",
      }),
    eventType: z.enum(["physical", "virtual"]),
    price: z
      .string()
      .optional()
      .refine((val) => !val || (Number(val) >= 0 && !isNaN(Number(val))), {
        message: "Price cannot be negative",
      }),
    image: z.string().min(1, { message: "Event image is required" }),
  })
  .refine(
    (data) => {
      if (data.eventType === "physical") {
        return data.venue !== undefined && data.venue.trim().length >= 2;
      }
      if (data.eventType === "virtual") {
        return (
          data.virtualLink !== undefined &&
          data.virtualLink.trim().length > 0 &&
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
            data.virtualLink
          )
        );
      }
      return true;
    },
    {
      message: "Venue or valid virtual link is required based on event type",
      path: ["venue"],
    }
  );

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
  editEvent?: Event | null;
  isEditMode?: boolean;
}

// Create a dynamic resolver function that changes based on event type
// Update the createDynamicResolver function to handle capacity validation
const createDynamicResolver = (
  eventType: "free" | "paid",
  originalCapacity?: string
) => {
  return zodResolver(
    formSchema.superRefine((data, ctx) => {
      // For paid events, make price, bankAccount, and ifscCode mandatory
      if (eventType === "paid") {
        if (!data.price || data.price.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Price is required for paid events",
            path: ["price"],
          });
        } else if (isNaN(Number(data.price)) || Number(data.price) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Price must be a positive number",
            path: ["price"],
          });
        }
      }

      // Check capacity in edit mode
      if (originalCapacity && data.capacity) {
        const newCapacity = Number(data.capacity);
        const originalCapacityNum = Number(originalCapacity);

        if (
          !isNaN(newCapacity) &&
          !isNaN(originalCapacityNum) &&
          newCapacity < originalCapacityNum
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Capacity can only be increased, not decreased",
            path: ["capacity"],
          });
        }
      }
    })
  );
};

const AddEventModal = ({
  isOpen,
  onClose,
  onAddEvent,
  editEvent = null,
  isEditMode = false,
}: AddEventModalProps) => {
  const { toast } = useToast();
  const [eventType, setEventType] = useState<"free" | "paid">("free");
  const [selectedEventType, setSelectedEventType] = useState<
    "physical" | "virtual"
  >("physical");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalCapacity, setOriginalCapacity] = useState<string | undefined>(
    undefined
  );

  // Add these to form default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: createDynamicResolver(eventType, originalCapacity),
    mode: "onChange", // This enables real-time validation
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      virtualLink: "",
      category: "",
      capacity: "",
      eventType: "physical",
      price: "",
      image: "",
    },
  });

  // Update resolver when event type changes
  useEffect(() => {
    const currentValues = form.getValues();
    form.clearErrors();
    form.reset(currentValues, {
      keepValues: true,
      keepDefaultValues: true,
      keepDirty: true,
      keepIsSubmitted: false,
      keepTouched: true,
      keepIsValid: false,
    });
  }, [eventType, originalCapacity, form]);

  // Populate form with event data when in edit mode
  useEffect(() => {
    if (isEditMode && editEvent) {
      // Set event type (free/paid)
      setEventType(
        editEvent.price && editEvent.price !== "Free" && editEvent.price !== "0"
          ? "paid"
          : "free"
      );

      // Set event venue type
      setSelectedEventType(editEvent.eventType || "physical");

      // Store original capacity for validation
      setOriginalCapacity(editEvent.capacity?.toString());

      // Set image preview if available
      if (editEvent.image && editEvent.image !== "/placeholder-event.jpg") {
        setImagePreview(editEvent.image);
      }

      // Reset form with event values, handling all possible undefined cases
      form.reset({
        title: editEvent.title ?? "",
        description: editEvent.description ?? "",
        date: editEvent.date ?? "",
        time: editEvent.time ?? "",
        venue: editEvent.venue === "Virtual" ? "" : editEvent.venue ?? "",
        virtualLink: editEvent.virtualLink ?? "",
        category: editEvent.category ?? "",
        capacity: editEvent.capacity?.toString() ?? "",
        eventType: editEvent.eventType ?? "physical",
        price:
          editEvent.price === "Free" || !editEvent.price ? "" : editEvent.price,
        image: editEvent.image ?? "",
      });

      // Trigger validation after form reset
      setTimeout(() => {
        form.trigger();
      }, 100);
    } else {
      // Reset to default values when not in edit mode
      form.reset({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        category: "",
        capacity: "",
        eventType: "physical",
        price: "",
        image: "",
      });
      setEventType("free");
      setSelectedEventType("physical");
      setImagePreview(null);
      setOriginalCapacity(undefined);
    }
  }, [isEditMode, editEvent, form]);

  // Updated handlers now accept an optional file (for drag & drop)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "Image size must not exceed 5MB",
            variant: "destructive",
          });
          alert("Image size must not exceed 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setImagePreview(base64Data);
          form.setValue("image", base64Data);
          form.trigger("image");
        };
        reader.readAsDataURL(file);
      }
    },
    [form, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleCheckboxChange = (type: "physical" | "virtual") => {
    setSelectedEventType(type);
    form.setValue("eventType", type);
    // Clear the other field when switching types
    if (type === "physical") {
      form.setValue("virtualLink", "");
    } else {
      form.setValue("venue", "");
    }

    // Trigger validation after changing event type
    setTimeout(() => {
      form.trigger();
    }, 100);
  };

  // Remove the duplicate onSubmit function and keep only one
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEvent: Event = {
      id: isEditMode && editEvent ? editEvent.id : `event-${Date.now()}`,
      ...values,
      type: eventType,
      date: values.date,
      venue: selectedEventType === "virtual" ? "" : values.venue,
      virtualLink: selectedEventType === "virtual" ? values.virtualLink : "",
      organizer:
        isEditMode && editEvent ? editEvent.organizer : "Your Organization",
      status: isEditMode && editEvent ? editEvent.status : "pending",
      price:
        isEditMode && editEvent && editEvent.price
          ? editEvent.price
          : eventType === "paid" && values.price && values.price !== "free"
          ? values.price
          : "",
      eventType: selectedEventType,
      image: values.image || "/placeholder-event.jpg",
      createdAt: new Date().toISOString(),
    };

    if (isEditMode && editEvent && editEvent.capacity) {
      const newCapacity = Number(values.capacity);
      const originalCapacity = Number(editEvent.capacity);

      if (isNaN(newCapacity) || newCapacity < originalCapacity) {
        newEvent.capacity = editEvent.capacity;
      } else {
        newEvent.capacity = newCapacity.toString();
      }
    }

    console.log("Event Data for API:", JSON.stringify(newEvent, null, 2));
    onAddEvent(newEvent);

    toast({
      title: isEditMode ? "Event Updated" : "Event Added",
      description: `${values.title} has been successfully ${
        isEditMode ? "updated" : "created"
      }.`,
      variant: "default",
    });

    form.reset();
    setImagePreview(null);
    onClose();
  };

  // Update the event type setter to trigger validation
  const handleEventTypeChange = (type: "free" | "paid") => {
    // Prevent changing event type in edit mode
    if (isEditMode) {
      toast({
        title: "Cannot change event type",
        description: "Event type cannot be changed after creation",
        variant: "destructive",
      });
    }

    // For paid events, show toast but don't change the event type
    if (type === "paid") {
      toast({
        title: "Bank Account Required",
        description:
          "Paid events require bank account verification. Please add your bank details first.",
        variant: "destructive",
      });
      return;
    }

    setEventType(type);
    // Trigger validation after changing event type
    setTimeout(() => {
      form.trigger();
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        {/* Free/Paid Tabs - Update the onClick handlers */}
        <div className="w-full mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleEventTypeChange("free")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all duration-200",
                eventType === "free"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
              )}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => handleEventTypeChange("paid")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all duration-200",
                eventType === "paid"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "bg-transparent dark:bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
              )}
            >
              Paid
            </button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload with React Dropzone */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                Event Cover Image
              </FormLabel>
              <p className="text-sm text-muted-foreground mb-3">
                Please upload an image (1200x630 pixels) for the best display
                and max (5MB).
              </p>

              <div
                {...getRootProps()}
                className={cn(
                  "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-300",
                  "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10",
                  isDragActive
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/10"
                    : "border-gray-300 dark:border-gray-700",
                  imagePreview ? "p-0" : "p-8",
                  "group cursor-pointer"
                )}
              >
                <input {...getInputProps()} />

                {imagePreview ? (
                  <div className="relative w-full aspect-[1200/630] overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview}
                      alt="Event Cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm">
                        {isDragActive
                          ? "Drop the image here"
                          : "Click or drag to replace image"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop or click to upload"}
                      <br />
                      <span className="text-blue-600">
                        1200x630 pixels recommended
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {form.formState.errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>

            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Event Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event title"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Event Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event"
                      {...field}
                      className="min-h-24 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Event Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.name}
                          className="cursor-pointer"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Event Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CustomDatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Event Time
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CustomTimePicker
                          value={field.value}
                          onChange={(time) => field.onChange(time)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Event Format Checkboxes - Single Selection */}
            <div className="flex flex-col gap-4">
              <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                Event Type
              </FormLabel>
              {["physical", "virtual"].map((option) => (
                <div key={option} className="flex items-center gap-1 text-sm">
                  <Checkbox
                    checked={selectedEventType === option}
                    onCheckedChange={() =>
                      handleCheckboxChange(option as "physical" | "virtual")
                    }
                    className="mr-1"
                  />
                  <label className="cursor-pointer text-gray-700 dark:text-gray-300">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {/* Venue (for physical events) */}
            {selectedEventType === "physical" && (
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Venue Details
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter specific venue address"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Virtual Event Link - Add this after the venue field */}
            {selectedEventType === "virtual" && (
              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Virtual Event Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Capacity */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Sofa className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Seat Capacity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter total seats/capacity"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                  {isEditMode && originalCapacity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current capacity: {originalCapacity}. You can only
                      increase capacity, not decrease it.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price (for paid events) */}
            {eventType === "paid" && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Ticket Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter ticket price"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        disabled={isEditMode}
                      />
                    </FormControl>
                    {isEditMode && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ticket price cannot be modified after creation
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Footer Buttons */}
            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 hover:scale-105 duration-150 transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white h-11 hover:scale-105 duration-150 transition-all"
              >
                {isEditMode ? "Update Event" : "Request Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
