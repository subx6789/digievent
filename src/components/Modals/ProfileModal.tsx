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
} from "lucide-react";
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    avatar: string;
    role: string;
    phone?: string;
    organization?: string;
  };
}

// Define the form schema with Zod
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must not exceed 12 characters")
      .optional(),
    confirmPassword: z.string().optional(),
    phone: z
      .string()
      .refine(
        (val) =>
          /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
        {
          message:
            "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
        }
      )
      .optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track phone number for real-time updates
  const [phoneDisplay, setPhoneDisplay] = useState(user.phone || "");

  // Initialize React Hook Form with Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      phone: user.phone || "",
    },
    mode: "onChange",
  });

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

  const { isValid, isSubmitting } = form.formState;

  // Watch phone field for real-time updates
  const phoneValue = form.watch("phone");

  // Update phone display when phone value changes
  React.useEffect(() => {
    if (isEditing) {
      setPhoneDisplay(phoneValue || "");
    }
  }, [phoneValue, isEditing]);

  const handleSaveChanges = (values: FormValues) => {
    console.log("Saving profile changes:", values);
    console.log("New avatar:", avatarPreview);

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    });

    setIsEditing(false);
    form.reset({
      password: "",
      confirmPassword: "",
      phone: values.phone,
    });
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background dark:bg-gray-900 border-none shadow-lg">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5" /> Profile Details
            </DialogTitle>
            <DialogDescription>
              View and manage your profile information.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div
                className={`relative cursor-pointer ${
                  isEditing ? "hover:opacity-80 transition-opacity" : ""
                }`}
                onClick={isEditing ? handleAvatarClick : undefined}
              >
                <Avatar className="h-20 w-20 rounded-full border-2 border-white">
                  <AvatarImage
                    src={avatarPreview || undefined}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-lg bg-blue-600 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                )}
                {/* Only show delete button when there is an avatar preview and in edit mode */}
                {isEditing && avatarPreview && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAvatar();
                    }}
                  >
                    <Trash className="h-3.5 w-3.5 text-white" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm">
                {user.role
                  .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
                  .split(" ") // Split words for capitalization
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                  .join(" ")}
              </p>
              {/* Show phone display which updates in real-time */}
              {phoneDisplay && (
                <p className="text-sm flex items-center mt-1">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  {phoneDisplay}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-sm text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> Email
                </Label>
                <div className="flex items-center gap-2 rounded-md border p-3 dark:bg-gray-800">
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> Phone
                </Label>
                <div className="flex items-center gap-2 rounded-md border p-3 dark:bg-gray-800">
                  <span>{user.phone || "Not provided"}</span>
                </div>
              </div>

              {user.role === "Organizer" && user.organization && (
                <div className="grid gap-2">
                  <Label className="text-sm text-muted-foreground flex items-center">
                    <Building className="h-4 w-4 mr-2" /> Organization
                  </Label>
                  <div className="flex items-center gap-2 rounded-md border p-3 dark:bg-gray-800">
                    <span>{user.organization}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 duration-150 transition-all h-11"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveChanges)}
                className="space-y-4"
              >
                <div className="grid gap-2">
                  <Label className="text-sm text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-2" /> Email (Cannot be changed)
                  </Label>
                  <div className="flex items-center gap-2 rounded-md border p-3 bg-muted/50 dark:bg-gray-800 h-11">
                    <span>{user.email}</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" /> Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 rounded-md border dark:bg-gray-800">
                          <div className="flex items-center ml-3">
                            <span className="font-medium">+91</span>
                          </div>
                          <Input
                            placeholder="Enter your phone number"
                            className="border-0 dark:bg-gray-800 pl-1 h-11"
                            value={field.value?.replace(/^\+91\s*/, "")}
                            onChange={(e) =>
                              handlePhoneChange(e, field.onChange)
                            }
                            onBlur={field.onBlur}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Key className="h-4 w-4 mr-2" /> New Password
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 rounded-md border dark:bg-gray-800">
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="border-0 dark:bg-gray-800 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Key className="h-4 w-4 mr-2" /> Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 rounded-md border dark:bg-gray-800">
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="border-0 dark:bg-gray-800 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user.role === "Organizer" && user.organization && (
                  <div className="grid gap-2">
                    <Label className="text-sm text-muted-foreground flex items-center">
                      <Building className="h-4 w-4 mr-2" /> Organization (Cannot
                      be changed)
                    </Label>
                    <div className="flex items-center gap-2 rounded-md border p-3 bg-muted/50 dark:bg-gray-800 h-11">
                      <span>{user.organization}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 hover:scale-105 duration-150 transition-all h-11"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarPreview(user.avatar || null);
                    }}
                  >
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 duration-150 transition-all h-11"
                    disabled={!isValid || isSubmitting}
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Save Changes
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
