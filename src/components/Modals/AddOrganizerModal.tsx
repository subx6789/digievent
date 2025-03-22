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
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDropzone } from "react-dropzone";

// Define the Organizer type
export type Organizer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  avatarUrl?: string | undefined;
  eventCount: number;
};

interface AddOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrganizer: (newOrganizer: Organizer) => void;
  editMode?: boolean;
  organizerToEdit?: Organizer | null;
}

// Generate a random password
const generatePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const AddOrganizerModal: React.FC<AddOrganizerModalProps> = ({
  isOpen,
  onClose,
  onAddOrganizer,
  editMode = false,
  organizerToEdit = null,
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrlPreview, setAvatarUrlPreview] = useState<string | null>(null);

  // Create schema based on edit mode
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Must be a valid email" }),
    phone: z
      .string()
      .refine(
        (val) =>
          /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
        {
          message:
            "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
        }
      ),
    organization: z
      .string()
      .min(2, { message: "Organization name is required" }),
    avatarUrl: z.string().optional(),
    password: editMode
      ? z.string().optional() // Password is optional in edit mode
      : z
          .string()
          .min(8, { message: "Password must be between 8-12 characters" })
          .max(12, { message: "Password exceeds 12 characters" }),
  });

  // Dynamic default values based on edit mode
  const defaultValues =
    editMode && organizerToEdit
      ? {
          name: organizerToEdit.name,
          email: organizerToEdit.email,
          phone: organizerToEdit.phone,
          organization: organizerToEdit.organization,
          avatarUrl: organizerToEdit.avatarUrl || "",
          password: "", // Empty in edit mode
        }
      : {
          name: "",
          email: "",
          phone: "+91 ",
          organization: "",
          avatarUrl: "",
          password: "",
        };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  // Update form when editing organizer changes
  useEffect(() => {
    if (editMode && organizerToEdit) {
      form.reset({
        name: organizerToEdit.name,
        email: organizerToEdit.email,
        phone: organizerToEdit.phone,
        organization: organizerToEdit.organization,
        avatarUrl: organizerToEdit.avatarUrl || "",
        password: "", // Empty in edit mode
      });

      setAvatarUrlPreview(organizerToEdit.avatarUrl || null);
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "+91 ",
        organization: "",
        avatarUrl: "",
        password: "",
      });

      setAvatarUrlPreview(null);
    }
  }, [editMode, organizerToEdit, form]);

  // Replace the handleAvatarUrlUpload with onDrop for React Dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarUrlPreview(reader.result as string);
          form.setValue("avatarUrl", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create or update organizer object
    const organizer: Organizer = {
      id:
        editMode && organizerToEdit
          ? organizerToEdit.id
          : `organizer-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      organization: values.organization,
      avatarUrl: values.avatarUrl || "/placeholder-avatar.jpg",
      eventCount: editMode && organizerToEdit ? organizerToEdit.eventCount : 0,
    };

    // Add or update the organizer
    onAddOrganizer(organizer);

    // Show success toast
    toast({
      title: editMode ? "Organizer Updated" : "Organizer Added",
      description: editMode
        ? `${values.name} has been successfully updated.`
        : `${values.name} has been successfully added.`,
      variant: "default",
    });

    // Reset form and close modal
    form.reset();
    setAvatarUrlPreview(null);
    onClose();
  };

  const generateAndSetPassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {editMode ? "Edit Organizer" : "Add New Organizer"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* Avatar Upload */}
            <div className="flex justify-center mb-4">
              <div
                {...getRootProps()}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isDragActive ? "scale-105" : ""
                }`}
              >
                <input {...getInputProps()} />
                <Avatar className="w-24 h-24 rounded-full border-2 hover:border-blue-500 transition-all border-gray-300 dark:border-gray-600">
                  <AvatarImage
                    src={avatarUrlPreview || "/placeholder-avatar.jpg"}
                    alt="Organizer Avatar"
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                    <Upload className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Organizer Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organizer name"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Organization */}
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Name of the Organization
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="organizer@example.com"
                        {...field}
                        disabled={editMode} // Disable email field in edit mode
                        className={`h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${
                          editMode ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      />
                    </FormControl>
                    {editMode && (
                      <p className="text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    )}
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 234 567 8900"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        required
                        value={field.value || "+91 "}
                        onChange={(e) => {
                          if (!e.target.value.startsWith("+91 ")) return;
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Password - Only show in Add mode, not in Edit mode */}
            {!editMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      Password
                    </FormLabel>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...field}
                            className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            required
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={generateAndSetPassword}
                        className="h-10 whitespace-nowrap bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Generate
                      </Button>
                    </div>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editMode ? "Update Organizer" : "Add Organizer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizerModal;
