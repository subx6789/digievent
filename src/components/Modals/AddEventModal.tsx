/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CreditCard,
  Building,
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

const eventCategories = [
  { id: "edu", name: "Educational" },
  { id: "gam", name: "Gaming" },
  { id: "bus", name: "Business" },
  { id: "fun", name: "Fun" },
];

// Update the form schema
// Update the formSchema with regex validations
const formSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Event title must be at least 2 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    date: z.string(),
    time: z.string(),
    location: z.string().optional(),
    virtualLink: z.string().optional(),
    category: z.string().min(1, { message: "Category is required" }),
    capacity: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Capacity must be a positive number",
      }),
    eventType: z.enum(["physical", "virtual"]),
    price: z.string().optional(),
    image: z.string(),
    bankAccount: z.string().optional(),
    ifscCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.eventType === "physical") {
        return data.location !== undefined && data.location.trim().length >= 2;
      }
      if (data.eventType === "virtual") {
        return data.virtualLink !== undefined && data.virtualLink.trim().length > 0;
      }
      return true;
    },
    {
      message: "Location or virtual link is required based on event type",
      path: ["location"],
    }
  );

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
  editEvent?: Event | null;
  isEditMode?: boolean;
}

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

  // Add these to form default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // This enables real-time validation
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      virtualLink: "",
      category: "",
      capacity: "",
      eventType: "physical",
      price: "",
      image: "",
      bankAccount: "",
      ifscCode: "",
    },
  });

  // Populate form with event data when in edit mode
  useEffect(() => {
    if (isEditMode && editEvent) {
      // Set event type (free/paid)
      setEventType(
        editEvent.price && editEvent.price !== "Free" && editEvent.price !== "0"
          ? "paid"
          : "free"
      );

      // Set event location type
      setSelectedEventType(editEvent.eventType || "physical");

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
        location:
          editEvent.location === "Virtual" ? "" : editEvent.location ?? "",
        category: editEvent.category ?? "",
        capacity: editEvent.capacity?.toString() ?? "",
        eventType: editEvent.eventType ?? "physical",
        price:
          editEvent.price === "Free" || !editEvent.price ? "" : editEvent.price,
        image: editEvent.image ?? "",
      });
    } else {
      // Reset to default values when not in edit mode
      form.reset({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        capacity: "",
        eventType: "physical",
        price: "",
        image: "",
      });
      setEventType("free");
      setSelectedEventType("physical");
      setImagePreview(null);
    }
  }, [isEditMode, editEvent, form]);

  // Updated handlers now accept an optional file (for drag & drop)
  // Update the handleImageUpload function
  const handleImageUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLLabelElement>,
    droppedFile?: File
  ) => {
    const fileToProcess = droppedFile ||
      ('target' in event && 'files' in event.target ? event.target.files?.[0] : null);

    if (fileToProcess) {
      try {
        if (!fileToProcess.type.startsWith('image/')) {
          toast({
            title: "Error",
            description: "Please upload an image file",
            variant: "destructive",
          });
          return;
        }

        if (fileToProcess.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "Image size must not exceed 5MB",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setImagePreview(base64Data);
          form.setValue("image", base64Data);
        };
        reader.readAsDataURL(fileToProcess);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to process image",
          variant: "destructive",
        });
      }
    }
  };

  const handleCheckboxChange = (type: "physical" | "virtual") => {
    setSelectedEventType(type);
    form.setValue("eventType", type);
  };

  // Remove the duplicate onSubmit function and keep only one
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEvent: Event = {
      id: isEditMode && editEvent ? editEvent.id : `event-${Date.now()}`,
      ...values,
      type: eventType,
      date: values.date,
      location:
        selectedEventType === "virtual"
          ? values.virtualLink || "Virtual"
          : values.location,
      organiser:
        isEditMode && editEvent ? editEvent.organiser : "Your Organization",
      status: "pending",
      eventType: selectedEventType,
      image: values.image || "/placeholder-event.jpg",
      bankAccount: eventType === "paid" ? values.bankAccount : undefined,
      ifscCode: eventType === "paid" ? values.ifscCode : undefined,
      createdAt: new Date().toISOString(),
    };

    if (isEditMode && editEvent) {
      newEvent.capacity = editEvent.capacity;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        {/* Free/Paid Tabs */}
        <div className="w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setEventType("free")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all duration-200",
                eventType === "free"
                  ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              Free Event
            </button>
            <button
              type="button"
              onClick={() => setEventType("paid")}
              className={cn(
                "py-2 rounded-md text-sm font-medium transition-all duration-200",
                eventType === "paid"
                  ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              Paid Event
            </button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            {/* Add this near the image upload section */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" /> Event Cover Image
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Please upload an image (1200x630 pixels, max 5MB) for the best
                display
              </p>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={(e) => handleImageUpload(e)}
              />
              <Label
                htmlFor="image-upload"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-blue-500",
                    "bg-blue-50/50"
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-500",
                    "bg-blue-50/50"
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-500",
                    "bg-blue-50/50"
                  );
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(e, file);
                  } else {
                    toast({
                      title: "Error",
                      description: "Please drop an image file",
                      variant: "destructive",
                    });
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-300",
                  "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10",
                  imagePreview ? "p-0" : "p-8",
                  "group cursor-pointer"
                )}
              >
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
                        Click to change image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Drag & drop or click to upload
                      <br />
                      <span className="text-blue-600">
                        1200x630 pixels recommended
                      </span>
                    </p>
                  </div>
                )}
              </Label>
            </div>

            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Event Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event title"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Event Description
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
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Event Category
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
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Event Date
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
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Event Time
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
              <FormLabel className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Event Type
              </FormLabel>
              {["physical", "virtual"].map((option) => (
                <div key={option} className="flex items-center gap-1 text-sm">
                  <Checkbox
                    checked={selectedEventType === option}
                    onCheckedChange={() =>
                      handleCheckboxChange(option as "physical" | "virtual")
                    }
                  />
                  <label className="cursor-pointer">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {/* Venue (for physical events) */}
            {selectedEventType === "physical" && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Venue Details
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter specific venue address"
                        {...field}
                        className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Virtual Event Link - Add this after the location field */}
            {selectedEventType === "virtual" && (
              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Virtual Event Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                        {...field}
                        className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  <FormLabel className="flex items-center gap-2">
                    <Sofa className="h-4 w-4" /> Seat Capacity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter total seats/capacity"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={isEditMode} // Disable in edit mode
                    />
                  </FormControl>
                  {isEditMode && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Seat capacity cannot be modified after creation
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
                    <FormLabel className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Ticket Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter ticket price"
                        {...field}
                        className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Bank Details Section */}
            {eventType === "paid" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Bank Account Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter bank account number"
                          {...field}
                          className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> IFSC Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter IFSC code"
                          {...field}
                          className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          autoCapitalize="characters"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Footer Buttons */}
            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 hover:scale-105 duration-150 transition-all"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 hover:scale-105 duration-150 transition-all"
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
