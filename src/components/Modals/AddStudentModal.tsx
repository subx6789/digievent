"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Lock,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  GraduationCap,
  Calendar,
  BookUser,
  Phone,
} from "lucide-react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { courses } from "@/utils/data/courses";
import { useDropzone } from "react-dropzone";
import { Student } from "@/types/student";
import { generatePassword } from "@/utils/functions/generateRandomPassword";
import { getOrdinalSuffix } from "@/utils/functions/getOrdinalSuffix";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent?: (updatedStudent: Student) => void;
  studentToEdit?: Student | null;
  isEditMode?: boolean;
}

// Form validation schema - base schema
const baseSchema = {
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  course: z.string({ required_error: "Course is required" }),
  year: z.coerce.number({ required_error: "Year is required" }),
  rollno: z
    .string()
    .min(12, { message: "Roll number must be at least 12 characters" })
    .max(12, { message: "Roll number must not exceed 12 characters" })
    .regex(/^\d{12}$/, { message: "Roll number must be 12 digits" }),
  avatarUrl: z.string().optional(),
  phone: z
    .string()
    .refine(
      (val) => /^(\+91\s)?(?:\(\d{2,3}\)\s\d{4}\s\d{4}|[6-9]\d{9})$/.test(val),
      {
        message:
          "Please enter a valid 10-digit mobile number or a valid landline number with area code.",
      }
    ),
};

// Create the Add mode schema (with email and password)
const addFormSchema = z.object({
  ...baseSchema,
  email: z.string().email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be between 8-12 characters" })
    .max(12, { message: "Password exceeds 12 characters" }),
});

// Create the Edit mode schema (without password)
const editFormSchema = z.object({
  ...baseSchema,
  email: z.string().email({ message: "Must be a valid email" }),
});

// Create a union type for both form schemas
type FormValues =
  | z.infer<typeof addFormSchema>
  | z.infer<typeof editFormSchema>;

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  onUpdateStudent,
  studentToEdit,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrlPreview, setAvatarUrlPreview] = useState<string | undefined>(
    undefined
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const defaultFormValues = {
    name: "",
    email: "",
    phone: "+91 ", // Always initialize with a string
    rollno: "",
    course: "",
    year: 1,
    avatarUrl: "",
    password: isEditMode ? undefined : "", // Only include password for add mode
  };

  // Use the appropriate schema based on mode
  const form = useForm<FormValues>({
    resolver: zodResolver(isEditMode ? editFormSchema : addFormSchema),
    mode: "onChange",
    defaultValues:
      isEditMode && studentToEdit
        ? {
            name: studentToEdit.name || "",
            email: studentToEdit.email || "",
            phone: studentToEdit.phone || "+91 ",
            rollno: studentToEdit.rollno || "",
            course: studentToEdit.course || "",

            year: studentToEdit.year || 1,
            avatarUrl: studentToEdit.avatarUrl || "",
          }
        : defaultFormValues,
  });

  // Effect to update available years when course changes
  useEffect(() => {
    if (selectedCourse) {
      const selectedCourseData = courses.find(
        (course) => course.courseName === selectedCourse
      );

      if (selectedCourseData) {
        const yearsCount = selectedCourseData.noOfYears || 1;
        const years = Array.from({ length: yearsCount }, (_, i) => i + 1);
        setAvailableYears(years);

        // If current selected year is greater than available years, reset it
        const currentYear = form.getValues("year");
        if (currentYear > yearsCount) {
          form.setValue("year", 1);
        }
      }
    } else {
      setAvailableYears([]);
    }
  }, [selectedCourse, form]);

  // Effect to populate form with existing student data when editing
  useEffect(() => {
    if (isEditMode && studentToEdit) {
      form.reset({
        name: studentToEdit.name,
        email: studentToEdit.email,
        phone: studentToEdit.phone,
        rollno: studentToEdit.rollno,
        course: studentToEdit.course,

        year: studentToEdit.year || 1,
        avatarUrl: studentToEdit.avatarUrl || undefined,
      });

      // Set the avatar preview
      setAvatarUrlPreview(studentToEdit.avatarUrl);

      // Set selected course to initialize departments
      setSelectedCourse(studentToEdit.course);
    } else {
      // Reset form when opening in add mode
      form.reset({
        name: "",
        email: "",
        phone: "+91 ",
        rollno: "",
        course: "",

        year: 1,
        avatarUrl: "",
        password: "",
      });
      setAvatarUrlPreview(undefined);
      setSelectedCourse(null);
    }
  }, [isEditMode, studentToEdit, form]);

  // Replace the handleAvatarUrlUpload with React Dropzone
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

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (isEditMode && studentToEdit && onUpdateStudent) {
      // Update existing student
      const updatedStudent: Student = {
        ...studentToEdit,
        name: values.name,
        course: values.course,

        year: values.year,
        avatarUrl: values.avatarUrl || studentToEdit.avatarUrl,
        rollno: values.rollno,
        email: values.email,
        phone: values.phone,
      };

      // Update the student
      onUpdateStudent(updatedStudent);

      // Show success toast
      toast({
        title: "Student Updated",
        description: `${values.name}'s information has been successfully updated.`,
        variant: "default",
      });
    } else {
      // For add mode, we need to make sure we're working with the addFormSchema
      if ("password" in values) {
        // Create a new student object
        const newStudent: Student = {
          id: `student-${Date.now()}`,
          name: values.name,
          email: values.email,
          phone: values.phone,
          course: values.course,

          year: values.year,
          avatarUrl: values.avatarUrl || "/placeholder-avatar.jpg",
          rollno: values.rollno,
        };

        // Add the new student
        onAddStudent(newStudent);

        // Show success toast
        toast({
          title: "Student Added",
          description: `${values.name} has been successfully added.`,
          variant: "default",
        });
      }
    }

    // Reset form and close modal
    form.reset(defaultFormValues);
    setAvatarUrlPreview(undefined);
    onClose();
  };

  const generateAndSetPassword = () => {
    const newPassword = generatePassword();
    form.setValue("password", newPassword);
    form.trigger("password");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Student" : "Add New Student"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-4"
          >
            {/* AvatarUrl Upload */}
            <div className="flex justify-center mb-4">
              <div
                {...getRootProps()}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isDragActive ? "scale-105" : ""
                }`}
              >
                <input {...getInputProps()} />
                <Avatar className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 rounded-full">
                  <AvatarImage
                    src={avatarUrlPreview || "/placeholder-avatar.jpg"}
                    alt="Student Avatar"
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full">
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
                    Student Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student name"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Roll no */}
            <FormField
              control={form.control}
              name="rollno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <BookUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Student Roll No
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student roll no"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="student@example.com"
                        {...field}
                        disabled={isEditMode} // Disable email field in edit mode
                        className={`h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                          isEditMode
                            ? "opacity-70 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                            : ""
                        }`}
                      />
                    </FormControl>
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
                        placeholder="+91 5674567891"
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
            </div>

            {/* Course */}
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Course
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCourse(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {courses.map((course) => (
                        <SelectItem
                          className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          key={course.courseName}
                          value={course.courseName}
                        >
                          {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Current Year
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                    disabled={!selectedCourse || availableYears.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                          !selectedCourse || availableYears.length === 0
                            ? "opacity-70 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select current year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {availableYears.map((year) => (
                        <SelectItem
                          className="cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          key={year}
                          value={year.toString()}
                        >
                          {year} {getOrdinalSuffix(year)} Year
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedCourse && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Please select a course first
                    </p>
                  )}
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Password - only show in add mode */}
            {!isEditMode && (
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
                        onClick={generateAndSetPassword}
                        className="h-10 whitespace-nowrap bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-105 duration-150 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isEditMode
                    ? !form.formState.isDirty
                    : !form.formState.isValid || form.formState.isSubmitting
                }
                className="h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditMode ? "Update Student" : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
