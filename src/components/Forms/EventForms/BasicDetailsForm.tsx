"use client";

import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "@/types/event";
import { eventCategory } from "@/utils/data/eventCategory";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
});

interface BasicDetailsFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
}

const BasicDetailsForm = ({
  formData,
  updateFormData,
}: BasicDetailsFormProps) => {
  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
      category: formData.category || "",
    },
  });

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFormData(values);
  };

  // Auto-save on field change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Event>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-50 dark:bg-gray-900"
      >
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a descriptive title for your event"
                    {...field}
                    className="h-11 dark:bg-gray-800 bg-white dark:text-white text-black"
                  />
                </FormControl>
                <FormDescription>
                  A clear, concise title helps attendees understand what your
                  event is about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of your event"
                    {...field}
                    rows={5}
                    className="resize-y dark:bg-gray-800 bg-white dark:text-white text-black"
                  />
                </FormControl>
                <FormDescription>
                  Describe what attendees can expect, including activities,
                  speakers, or special features.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 cursor-pointer dark:bg-gray-800 bg-white dark:text-white text-black">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventCategory.map((category) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorizing your event helps it reach the right audience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BasicDetailsForm;
