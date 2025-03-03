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
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Upload,
  MapPin,
  Users,
  Tag,
  DollarSign,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
}

// Mock categories for events
const EVENT_CATEGORIES = [
  "Technology",
  "Business",
  "Education",
  "Sports",
  "Entertainment",
  "Health",
  "Arts",
  "Science",
  "Other",
];

// Form validation schema with conditional validation for venue
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Please provide a detailed description" }),
  category: z.string().min(1, { message: "Category is required" }),
  eventType: z.enum(["physical", "virtual"]),
  venue: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  price: z.string().optional(),
  image: z.string().optional(),
});

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const { toast } = useToast();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
  const [isPhysical, setIsPhysical] = useState(true);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      eventType: "physical",
      venue: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      capacity: "",
      price: "0",
      image: "",
    },
  });

  // Watch form values
  const { eventType } = form.watch();

  // Update isPhysical state when eventType changes
  useEffect(() => {
    setIsPhysical(eventType === "physical");
  }, [eventType]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setCoverImage(null);
      setActiveTab("free");
    }
  }, [isOpen, form]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "free" | "paid");
    form.setValue("price", value === "free" ? "Free" : "");
  };

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Create new event object
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: values.title,
        description: values.description,
        category: values.category,
        date: values.date,
        time: values.time,
        location: isPhysical ? values.venue || "TBA" : "Virtual Event",
        price: activeTab === "free" ? "Free" : values.price || "0",
        image: coverImage || "/placeholder-event.jpg",
        organiser: "Your Organization", // This would be dynamic in a real app
        status: "pending", // Default status for new events
        capacity: values.capacity,
        eventType: values.eventType,
      };

      // Add the new event
      onAddEvent(newEvent);

      // Show success toast
      toast({
        title: "Event Created",
        description: `${values.title} has been successfully created.`,
        variant: "default",
      });

      // Reset form and close modal
      form.reset();
      setCoverImage(null);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 bg-white dark:bg-gray-800 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="free"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="free" className="text-sm">
              Free Event
            </TabsTrigger>
            <TabsTrigger value="paid" className="text-sm">
              Paid Event
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto"
            >
              {/* Cover Image Upload */}
              <div className="w-full">
                <FormLabel className="block mb-2 text-gray-700 dark:text-gray-300">
                  Event Cover Image
                </FormLabel>
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                  {coverImage ? (
                    <div className="absolute inset-0">
                      <Image
                        src={coverImage}
                        alt="Event cover"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCoverImage(null)}
                          className="text-white border-white hover:bg-white hover:text-black"
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                    </>
                  )}
                </div>
                {!coverImage && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop (max 5MB)
                  </p>
                )}
              </div>

              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Event Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event title"
                        {...field}
                        className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Event Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your event..."
                        {...field}
                        className="min-h-24 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                      <Tag className="h-4 w-4" /> Category{" "}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {EVENT_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Event Type Selection */}
              <div className="space-y-2">
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Event Type
                </FormLabel>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="physical"
                      checked={form.watch("eventType") === "physical"}
                      onCheckedChange={() =>
                        form.setValue("eventType", "physical")
                      }
                      className="dark:border-gray-500"
                    />
                    <label
                      htmlFor="physical"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                    >
                      Physical
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="virtual"
                      checked={form.watch("eventType") === "virtual"}
                      onCheckedChange={() =>
                        form.setValue("eventType", "virtual")
                      }
                      className="dark:border-gray-500"
                    />
                    <label
                      htmlFor="virtual"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                    >
                      Virtual
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditional Venue Input */}
              {isPhysical && (
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="h-4 w-4" /> Venue{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter venue location"
                          {...field}
                          className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4" /> Date{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Event Time */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="h-4 w-4" /> Time{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Event Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4" /> Capacity{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of attendees"
                        {...field}
                        className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Paid Event Price (Only show in paid tab) */}
              <TabsContent value="paid" className="p-0 mt-0">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <DollarSign className="h-4 w-4" /> Price{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price in ₹"
                          {...field}
                          className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="free" className="p-0 mt-0">
                {/* Hidden field for free price */}
                <input type="hidden" {...form.register("price")} value="Free" />
              </TabsContent>

              <DialogFooter className="pt-4 pb-2 px-0 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-11 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  className={cn(
                    "h-11 text-white px-6 font-medium transition-all duration-150 hover:scale-105 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  )}
                >
                  Create Event
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
