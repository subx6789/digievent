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

// Define the Organizer type
export type Organizer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  avatarUrl?: string;
  eventCount: number;
};

interface AddOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrganizer: (newOrganizer: Organizer) => void;
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

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Must be a valid email" }),
  phone: z
    .string()
    .refine(
      (val) => val.startsWith("+91 ") && val.length >= 12 && val.length <= 15,
      {
        message: "Phone number must be atleast 10 digits long",
      }
    ),
  organization: z.string().min(2, { message: "Organization name is required" }),
  avatarUrl: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be between 8-12 characters" })
    .max(12, { message: "Password exceeds 12 characters" }),
});

const AddOrganizerModal: React.FC<AddOrganizerModalProps> = ({
  isOpen,
  onClose,
  onAddOrganizer,
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrlPreview, setAvatavatarUrlPreview] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "+91 ",
      organization: "",
      avatarUrl: "",
      password: "",
    },
  });

  const handleAvatavatarUrlUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatavatarUrlPreview(reader.result as string);
        form.setValue("avatarUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create a new organizer object
    const newOrganizer: Organizer = {
      id: `organizer-${Date.now()}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      organization: values.organization,
      avatarUrl: values.avatarUrl || "/placeholder-avatar.jpg",
      eventCount: 0, // Initial event count is zero
    };

    // Add the new organizer
    onAddOrganizer(newOrganizer);

    // Show success toast
    toast({
      title: "Organizer Added",
      description: `${values.name} has been successfully added.`,
      variant: "default",
    });

    // Reset form and close modal
    form.reset();
    setAvatavatarUrlPreview(null);
    onClose();
  };

  const generateAndSetPassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Organizer
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* AvatavatarUrl Upload */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatarUrl-upload"
                  onChange={handleAvatavatarUrlUpload}
                />
                <Label htmlFor="avatarUrl-upload" className="cursor-pointer">
                  <Avatar className="w-24 h-24 border-2 border-gray-300 hover:border-blue-500 transition-all">
                    <AvatarImage
                      src={avatarUrlPreview || "/placeholder-avatar.jpg"}
                      alt="Organizer AvatavatarUrl"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <Upload />
                    </AvatarFallback>
                  </Avatar>
                </Label>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Organizer Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organizer name"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization */}
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="h-4 w-4" /> Name of the Organization
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
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
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="organizer@example.com"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 234 567 8900"
                        {...field}
                        className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                        value={field.value || "+91 "}
                        onChange={(e) => {
                          if (!e.target.value.startsWith("+91 ")) return;
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Lock className="h-4 w-4" /> Password
                  </FormLabel>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
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
                      className="h-10 whitespace-nowrap dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Generate
                    </Button>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

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
                disabled={!form.formState.isValid}
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Organizer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizerModal;
