/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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

// Updated form schema with conditional location requirement
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
    category: z.string().min(1, { message: "Category is required" }),
    capacity: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Capacity must be a positive number",
      }),
    eventType: z.enum(["physical", "virtual"]),
    price: z.string().optional(),
    image: z.string(),
    pdfDetails: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.eventType === "physical") {
        return data.location !== undefined && data.location.trim().length >= 2;
      }
      return true;
    },
    {
      message: "Location is required for physical events",
      path: ["location"],
    }
  );

const AddEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
}> = ({ isOpen, onClose, onAddEvent }) => {
  const { toast } = useToast();
  const [eventType, setEventType] = useState<"free" | "paid">("free");
  const [selectedEventType, setSelectedEventType] = useState<
    "physical" | "virtual"
  >("physical");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
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
      pdfDetails: undefined,
    },
  });

  // Updated handlers now accept an optional file (for drag & drop)
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    file?: File
  ) => {
    const fileToProcess = file || event.target.files?.[0];
    if (fileToProcess) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(fileToProcess);
    }
  };

  const handlePdfUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    file?: File
  ) => {
    const fileToProcess = file || event.target.files?.[0];
    if (fileToProcess) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result as string);
        setPdfFileName(fileToProcess.name);
        form.setValue("pdfDetails", reader.result as string);
      };
      reader.readAsDataURL(fileToProcess);
    }
  };

  const handleCheckboxChange = (type: "physical" | "virtual") => {
    setSelectedEventType(type);
    form.setValue("eventType", type);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...values,
      type: eventType,
      date: values.date,
      location: values.location || "Virtual",
      organiser: "Your Organization",
      status: "pending",
      eventType: selectedEventType,
      image: values.image || "/placeholder-event.jpg",
    };

    onAddEvent(newEvent);

    toast({
      title: "Event Added",
      description: `${values.title} has been successfully created.`,
      variant: "default",
    });

    form.reset();
    setImagePreview(null);
    setPdfPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Event
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
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" /> Event Cover Image
              </Label>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={(e) => handleImageUpload(e)}
              />
              <Label
                htmlFor="image-upload"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleImageUpload(e as any, file);
                  }
                }}
                className={cn(
                  "flex items-center justify-center border-2 p-5 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors",
                  imagePreview && "p-0 border-none"
                )}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Event Cover Image"
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Drag & drop or click to upload cover image
                    </span>
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
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    />
                  </FormControl>
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

            {/* Details PDF Upload */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" /> Event Details PDF (Optional)
              </Label>
              <Input
                type="file"
                accept=".pdf"
                className="hidden"
                id="details-pdf-upload"
                onChange={(e) => handlePdfUpload(e)}
              />
              <Label
                htmlFor="details-pdf-upload"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handlePdfUpload(e as any, file);
                  }
                }}
                className="flex items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer hover:border-blue-500 transition-colors"
              >
                {pdfPreview ? (
                  <span className="text-sm text-gray-600">
                    PDF Uploaded: {pdfFileName}
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Drag & drop or click to upload PDF
                    </span>
                  </div>
                )}
              </Label>
            </div>

            <DialogFooter className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  (eventType === "paid" && !form.getValues("price")?.trim())
                }
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
