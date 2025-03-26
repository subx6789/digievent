/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { X, Image as ImageIcon, Upload, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Form schema
const formSchema = z.object({
  coverImage: z.string().min(1, "Cover image is required"),
});

interface MediaFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
}

const MediaForm = ({ formData, updateFormData }: MediaFormProps) => {
  // State for image previews
  const [coverImagePreview, setCoverImagePreview] = useState<string>(
    formData.coverImage || ""
  );
  const { toast } = useToast();

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: formData.coverImage || "",
    },
  });

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

  // Cover Image Dropzone (Landscape)
  const onCoverImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setCoverImagePreview(objectUrl);
        form.setValue("coverImage", objectUrl);
        toast({
          title: "Image uploaded",
          description: "Cover image has been successfully uploaded.",
          variant: "default",
        });
      }
    },
    [form, toast]
  );

  const coverImageDropzone = useDropzone({
    onDrop: onCoverImageDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB in bytes
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        if (rejection.errors[0]?.code === "file-too-large") {
          toast({
            title: "File too large",
            description:
              "Maximum file size is 5MB. Please choose a smaller image.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid file",
            description:
              rejection.errors[0]?.message ||
              "Please upload a valid image file.",
            variant: "destructive",
          });
        }
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Event Media</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a high-quality cover image for your event. This will be
            displayed on the event listing and details page.
          </p>
        </div>

        {/* Cover Image */}
        <div className="grid grid-cols-1 gap-6">
          {/* Cover Image (Landscape) */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  Cover Image (Landscape)
                </FormLabel>

                <FormControl>
                  <div
                    {...coverImageDropzone.getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ease-in-out cursor-pointer",
                      "hover:shadow-md hover:border-primary/70 dark:hover:border-primary/70",
                      coverImageDropzone.isDragActive
                        ? "border-primary bg-primary/5 dark:bg-primary/10 scale-[1.01]"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50"
                    )}
                  >
                    <input {...coverImageDropzone.getInputProps()} />

                    {coverImagePreview ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-sm">
                        <Image
                          src={coverImagePreview}
                          alt="Cover Image Preview"
                          fill
                          className="object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-9 w-9 rounded-full shadow-md opacity-90 hover:opacity-100 transition-all duration-200 transform hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverImagePreview("");
                            form.setValue("coverImage", "");
                            toast({
                              title: "Image removed",
                              description: "Cover image has been removed.",
                              variant: "default",
                            });
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className="mb-4 p-4 rounded-full bg-blue-500">
                          <Upload className="h-8 w-8 text-primary text-white" />
                        </div>
                        <h4 className="text-base font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Drag and drop your cover image
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          or click to browse files
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                          <ImageIcon className="h-4 w-4" />
                          <span>Recommended size: 1920×1080px • 5MB max</span>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="flex items-center gap-2">
                  {form.formState.errors.coverImage && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span>{form.formState.errors.coverImage?.message}</span>
                </FormMessage>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This image will be displayed as the header of your event page
                  and in event listings.
                </p>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default MediaForm;
