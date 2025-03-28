/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  User,
  Pencil,
  X,
  Phone,
  Building,
  Key,
  Mail,
  Trash,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string | undefined;
    role: string;
    phone?: string;
    clubName?: string;
  };
}

// Define the form schema with Zod - making password optional
const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must not exceed 12 characters")
      .optional()
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must not exceed 12 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    phone: z
      .string()
      .refine(
        (val) =>
          !val ||
          /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
        {
          message:
            "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
        }
      )
      .optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null
  );
  const [initialAvatar, setInitialAvatar] = useState<string | null>(
    user.avatar || null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track phone number for real-time updates
  const [phoneDisplay, setPhoneDisplay] = useState(user.phone || "");

  // Initialize React Hook Form with Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: user.phone || "",
    },
    mode: "onChange",
  });

  // Check for changes in form values or avatar
  useEffect(() => {
    const passwordChanged = !!form.watch("newPassword");
    const phoneChanged = form.watch("phone") !== user.phone;
    const avatarChanged = avatarPreview !== initialAvatar;

    setHasChanges(passwordChanged || phoneChanged || avatarChanged);
  }, [
    form.watch("newPassword"),
    form.watch("phone"),
    avatarPreview,
    initialAvatar,
    user.phone,
  ]);

  // Format phone number to ensure it starts with +91
  const formatPhoneNumber = (value: string) => {
    if (!value.startsWith("+91 ")) {
      return "+91 " + value.replace(/^\+91\s*/, "");
    }
    return value;
  };

  // Handle phone input change to maintain +91 prefix
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    let value = e.target.value;
    // Ensure the value always starts with +91
    value = formatPhoneNumber(value);
    // Call the original onChange
    onChange(value);
  };

  const { isSubmitting } = form.formState;

  // Watch phone field for real-time updates
  const phoneValue = form.watch("phone");

  // Update phone display when phone value changes
  React.useEffect(() => {
    if (isEditing) {
      setPhoneDisplay(phoneValue || "");
    }
  }, [phoneValue, isEditing]);

  const handleSaveChanges = (values: FormValues) => {
    // Prepare data for backend. Only include fields that have changed.
    const updatedData = {
      ...(values.newPassword ? { password: values.newPassword } : {}),
      ...(values.phone !== user.phone ? { phone: values.phone } : {}),
      ...(avatarPreview !== initialAvatar ? { avatar: avatarPreview } : {}),
    };

    console.log("Data to be sent to backend:", updatedData);
    console.log("New avatar:", avatarPreview);

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    });

    // Update the initial avatar to the current one
    setInitialAvatar(avatarPreview);
    setIsEditing(false);
    form.reset({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: values.phone,
    });
    setHasChanges(false);
  };

  // Dropzone setup for avatar upload when there is no picture
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    noClick: !isEditing, // Only allow click when editing
  });

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast({
      title: "Avatar Removed",
      description: "Your profile picture has been removed.",
      variant: "default",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        onClose();
        setIsEditing(false);
        form.reset();
        setAvatarPreview(user.avatar || null);
      }, 0);
    }
  };

  // Get first letters of name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] p-6 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
        <div className="p-1">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />{" "}
              Profile Details
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
              View and manage your profile information.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-6 mt-4">
            <div className="relative">
              {/* Hidden file input for non-dropzone upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {/* If avatarPreview exists, show the avatar with edit/delete options */}
              {avatarPreview ? (
                <div
                  className={`relative cursor-pointer ${
                    isEditing
                      ? "hover:opacity-90 transition-opacity duration-300"
                      : ""
                  }`}
                  onClick={isEditing ? handleAvatarClick : undefined}
                >
                  <Avatar className="h-24 w-24 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-600">
                    <AvatarImage
                      src={avatarPreview}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-500 dark:bg-blue-600 text-white text-xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                  )}

                  {/* Only show trash button if user has an avatar and we're in edit mode */}
                  {isEditing && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAvatar();
                      }}
                    >
                      <Trash className="h-4 w-4 text-white" />
                    </Button>
                  )}
                </div>
              ) : (
                // When there is no avatar preview, show a circular dropzone for upload
                <div
                  {...getRootProps()}
                  className={`h-24 w-24 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer bg-blue-600 dark:bg-blue-700 backdrop-blur-sm ${
                    isEditing
                      ? "hover:border-white hover:bg-blue-700/80 dark:hover:bg-blue-800/80 transition-all duration-300"
                      : ""
                  }`}
                  onClick={isEditing ? handleAvatarClick : undefined}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {user.role
                  .replace(/[-_]/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
              {/* Show phone display which updates in real-time */}
              {phoneDisplay && (
                <p className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  {phoneDisplay}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-1 mt-4">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                  Email
                </Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900 shadow-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                  Phone
                </Label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900 shadow-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {user.phone || "Not provided"}
                  </span>
                </div>
              </div>

              {user.role === "Organizer" && user.clubName && (
                <div className="grid gap-3">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                    Club Name
                  </Label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900 shadow-sm">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {user.clubName}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white mt-4 rounded-lg py-3 px-4 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 h-12"
              >
                <Pencil className="mr-2 h-5 w-5" /> Edit Profile
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveChanges)}
                className="space-y-6"
              >
                <div className="grid gap-3">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                    Email (Cannot be changed)
                  </Label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-900 h-12">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-200">
                          <div className="flex items-center justify-center px-3 bg-gray-50 dark:bg-gray-900 h-12 border-r border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              +91
                            </span>
                          </div>
                          <Input
                            placeholder="Enter your phone number"
                            className="border-0 focus:ring-0 focus-visible:ring-0 h-12 pl-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={field.value?.replace(/^\+91\s*/, "")}
                            onChange={(e) =>
                              handlePhoneChange(e, field.onChange)
                            }
                            onBlur={field.onBlur}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                        <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                        Old Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-200">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="border-0 focus:ring-0 focus-visible:ring-0 h-12 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-[5px] top-[5.5px] flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                        <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-200">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="border-0 focus:ring-0 focus-visible:ring-0 h-12 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-[5px] top-[5.5px] flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                        <Key className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all duration-200">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="border-0 focus:ring-0 focus-visible:ring-0 h-12 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            {...field}
                            disabled={!form.watch("newPassword")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-[5px] top-[5.5px] flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                {user.role === "Organizer" && user.clubName && (
                  <div className="grid gap-3">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />{" "}
                      Club Name (Cannot be changed)
                    </Label>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-900 h-12 shadow-inner">
                      <span className="font-medium text-gray-500 dark:text-gray-400">
                        {user.clubName}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-5 mt-2 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 rounded-lg py-3 px-4 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300 h-12"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarPreview(initialAvatar);
                      form.reset({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        phone: user.phone || "",
                      });
                    }}
                  >
                    <X className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />{" "}
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`flex-1 bg-blue-600 dark:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium shadow-md transform transition-all duration-300 h-12 ${
                      hasChanges
                        ? "hover:bg-blue-700 dark:hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-700"
                        : "opacity-50 cursor-not-allowed bg-blue-400 dark:bg-blue-600"
                    }`}
                    disabled={isSubmitting || !hasChanges}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-5 w-5" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
