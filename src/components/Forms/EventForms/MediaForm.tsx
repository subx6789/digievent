/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import {
  X,
  Image as ImageIcon,
  FileArchive,
  FolderArchive,
} from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";

// Form schema
const formSchema = z.object({
  coverImage: z.string().min(1, "Cover image is required"),
  eventPoster: z.string().min(1, "Event poster is required"),
  imageGallery: z.array(z.string()).optional(),
  zipFile: z.string().optional(),
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
  const [eventPosterPreview, setEventPosterPreview] = useState<string>(
    formData.eventPoster || ""
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    formData.imageGallery || []
  );
  const [zipFileName, setZipFileName] = useState<string | null>(null);
  const [isProcessingZip, setIsProcessingZip] = useState(false);

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: formData.coverImage || "",
      eventPoster: formData.eventPoster || "",
      imageGallery: formData.imageGallery || [],
      zipFile: "",
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

  // Event Poster Dropzone (Portrait)
  const onEventPosterDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setEventPosterPreview(objectUrl);
        form.setValue("eventPoster", objectUrl);
      }
    },
    [form]
  );

  const eventPosterDropzone = useDropzone({
    onDrop: onEventPosterDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB in bytes
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        if (rejection.errors[0]?.code === "file-too-large") {
          alert("File is too large. Maximum size is 5MB.");
        }
      });
    },
  });

  // Cover Image Dropzone (Landscape)
  const onCoverImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setCoverImagePreview(objectUrl);
        form.setValue("coverImage", objectUrl);
      }
    },
    [form]
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
          alert("File is too large. Maximum size is 5MB.");
        }
      });
    },
  });

  // Process zip file
  const processZipFile = async (file: File) => {
    setIsProcessingZip(true);
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      const imageFiles: string[] = [];

      const promises = Object.keys(zipContent.files)
        .filter(
          (filename) =>
            !zipContent.files[filename].dir &&
            /\.(jpe?g|png|gif|webp)$/i.test(filename)
        )
        .map(async (filename) => {
          const fileData = await zipContent.files[filename].async("blob");
          const objectUrl = URL.createObjectURL(
            new Blob([fileData], { type: `image/${filename.split(".").pop()}` })
          );
          imageFiles.push(objectUrl);
        });

      await Promise.all(promises);

      if (imageFiles.length > 0) {
        const updatedGallery = [...galleryPreviews, ...imageFiles];
        setGalleryPreviews(updatedGallery);
        form.setValue("imageGallery", updatedGallery);
        form.setValue("zipFile", file.name);
        setZipFileName(file.name);
      } else {
        alert("No valid images found in the ZIP file.");
      }
    } catch (error) {
      console.error("Error processing zip file:", error);
      alert("Error processing ZIP file. Please try another file.");
    } finally {
      setIsProcessingZip(false);
    }
  };

  // Gallery Images Dropzone (ZIP only)
  const onGalleryZipDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const zipFile = acceptedFiles[0];
        processZipFile(zipFile);
      }
    },
    [galleryPreviews]
  );

  const galleryZipDropzone = useDropzone({
    onDrop: onGalleryZipDrop,
    accept: {
      "application/zip": [".zip"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB in bytes
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        if (rejection.errors[0]?.code === "file-too-large") {
          alert("ZIP file is too large. Maximum size is 50MB.");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          alert("Only ZIP files are accepted for the gallery.");
        }
      });
    },
  });

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    const newGallery = [...galleryPreviews];
    newGallery.splice(index, 1);
    setGalleryPreviews(newGallery);
    form.setValue("imageGallery", newGallery);
  };

  // Remove ZIP file
  const removeZipFile = () => {
    setZipFileName(null);
    form.setValue("zipFile", "");
    form.setValue("imageGallery", []);
    setGalleryPreviews([]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Top row with poster and cover image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event Poster (Square) */}
          <FormField
            control={form.control}
            name="eventPoster"
            render={({ field }) => (
              <FormItem className="md:col-span-1 space-y-2">
                <FormLabel className="text-base">
                  Event Poster (Square)
                </FormLabel>

                <FormControl>
                  <div
                    {...eventPosterDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ease-in-out cursor-pointer
                          ${
                            eventPosterDropzone.isDragActive
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
                          }`}
                  >
                    <input {...eventPosterDropzone.getInputProps()} />

                    {eventPosterPreview ? (
                      <div className="relative aspect-square w-full">
                        <Image
                          src={eventPosterPreview}
                          alt="Event Poster Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEventPosterPreview("");
                            form.setValue("eventPoster", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <ImageIcon className="h-10 w-10 text-blue-500 dark:text-blue-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          Square poster
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended size : 1080x1080px • 5MB max
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image (Landscape) */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem className="md:col-span-2 space-y-2">
                <FormLabel className="text-base">
                  Cover Image (Landscape)
                </FormLabel>

                <FormControl>
                  <div
                    {...coverImageDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ease-in-out cursor-pointer
                          ${
                            coverImageDropzone.isDragActive
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
                          }`}
                  >
                    <input {...coverImageDropzone.getInputProps()} />

                    {coverImagePreview ? (
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={coverImagePreview}
                          alt="Cover Image Preview"
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverImagePreview("");
                            form.setValue("coverImage", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <ImageIcon className="h-10 w-10 text-blue-500 dark:text-blue-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          Landscape cover image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended size : 1920x1080px • 5MB max
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Gallery (ZIP only) */}
        <FormField
          control={form.control}
          name="imageGallery"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base">
                Image Gallery (ZIP file only)
              </FormLabel>

              <FormControl>
                <div className="space-y-6">
                  {/* ZIP file display or dropzone */}
                  {zipFileName ? (
                    <div className="flex items-center justify-between rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <FolderArchive className="h-8 w-8 text-blue-500" />
                        <span className="text-sm dark:text-white text-black">
                          {zipFileName}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={removeZipFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      {...galleryZipDropzone.getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ease-in-out cursor-pointer
                        ${
                          galleryZipDropzone.isDragActive
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600"
                        }`}
                    >
                      <input {...galleryZipDropzone.getInputProps()} />
                      <div className="flex flex-col items-center justify-center py-6">
                        {isProcessingZip ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Processing ZIP file...
                            </p>
                          </div>
                        ) : (
                          <>
                            <FileArchive className="h-10 w-10 text-blue-500 dark:text-blue-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              Drag and drop a ZIP file containing your gallery
                              images
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ZIP file only • 50MB maximum
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MediaForm;
