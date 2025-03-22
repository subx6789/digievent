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
  Building,
  MapPin,
  Phone,
  Mail,
  Upload,
  Eye,
  EyeOff,
  Lock,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { College } from "../Table/CollegeTable";
import { getCitiesForState, STATES } from "@/utils/data/statesAndCities";
import { useDropzone } from "react-dropzone";

interface AddCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCollege: (newCollege: College) => void;
}

// Updated form validation schema (removed description)
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "College name must be at least 2 characters" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z
    .string()
    .refine(
      (val) => /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
      {
        message:
          "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
      }
    ),
  email: z.string().email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be between 8-12 characters" })
    .max(12, { message: "Password must be 8-12 characters" }),
  logo: z.string().optional(),
});

const AddCollegeModal: React.FC<AddCollegeModalProps> = ({
  isOpen,
  onClose,
  onAddCollege,
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // ✅ Enables real-time validation
    defaultValues: {
      name: "",
      state: "",
      city: "",
      phone: "+91 ", // ✅ Preserving +91 correctly
      email: "",
      password: "",
      logo: "",
    },
  });

  // Watch form values to enable/disable generate password button
  const { name, state } = form.watch();

  // Update available cities when state changes
  useEffect(() => {
    if (state) {
      setAvailableCities(getCitiesForState(state));
      // Reset city when state changes
      form.setValue("city", "");
    } else {
      setAvailableCities([]);
    }
  }, [state, form]);

  // Generate password from name and location
  const generatePassword = () => {
    if (!name || !state) return;

    // Generate a random 8+ character password
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()${name}${state}`;
    let generatedPassword = "";

    for (let i = 0; i < 11; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    // Set the generated password
    form.setValue("password", generatedPassword, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Handle logo file upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoFile(reader.result as string);
          form.setValue("logo", reader.result as string);
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
    try {
      // Create a new college object
      const newCollege: College = {
        id: `college-${Date.now()}`,
        name: values.name,
        phone: values.phone,
        email: values.email,
        password: values.password, // In production, use bcrypt on server
        city: values.city,
        state: values.state,
        logo: logoFile || "/placeholder-college.jpg", // Use uploaded logo or default
        status: "active", // Default status for new colleges
      };

      // console.log("Adding New College:", newCollege); // Debugging

      // Add the new college - ensure this function is properly passed from parent
      onAddCollege(newCollege);

      // Show success toast
      toast({
        title: "College Added",
        description: `${values.name} has been successfully added.`,
        variant: "default",
      });

      // Reset form and close modal
      form.reset();
      setLogoFile(null);
      onClose();
    } catch (error) {
      console.error("Error adding college:", error);
      toast({
        title: "Error",
        description: "Failed to add college. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />{" "}
            Add New College
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-4"
          >
            {/* Logo Upload */}
            <div className="flex justify-center mb-4">
              <div
                {...getRootProps()}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isDragActive ? "scale-105" : ""
                }`}
              >
                <input {...getInputProps()} />
                <Avatar className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200">
                  <AvatarImage
                    src={logoFile || "/placeholder-avatar.jpg"}
                    alt="College Logo"
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                    <Upload className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    College Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter college name"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      State
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {STATES.map((state) => (
                          <SelectItem
                            key={state}
                            value={state}
                            className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                      City
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!state}
                      required
                    >
                      <FormControl>
                        <SelectTrigger
                          className={`h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                            !state
                              ? "opacity-70 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                              : ""
                          }`}
                        >
                          <SelectValue
                            placeholder={
                              state ? "Select city" : "Select state first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {availableCities.map((city) => (
                          <SelectItem
                            key={city}
                            value={city}
                            className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="+91 1234567890"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
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
                        placeholder="college@example.com"
                        {...field}
                        className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>

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
                          className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                          required
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                      onClick={generatePassword}
                      disabled={!name || !state}
                      className={`h-10 whitespace-nowrap bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors ${
                        !name || !state ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" /> Generate
                    </Button>
                  </div>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 w-full sm:w-auto bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-150 hover:scale-105"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="h-11 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add College"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCollegeModal;
