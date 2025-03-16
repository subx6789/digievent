"use client";

import React, { useEffect, useState } from "react";
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
  Lock,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  GraduationCap,
  BookOpen,
  Calendar,
  BookUser,
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
import { Student } from "../Table/StudentTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { courses } from "@/utils/data/courses";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
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
  course: z.string({ required_error: "Course is required" }),
  department: z.string({ required_error: "Department is required" }),
  year: z.coerce.number({ required_error: "Year is required" }),
  rollno: z
    .string()
    .min(12, { message: "Roll number must be at least 12 characters" })
    .max(12, { message: "Roll number must not exceed 12 characters" })
    .regex(/^\d{12}$/, { message: "Roll number must be 12 digits" }),
  avatarUrl: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be between 8-12 characters" })
    .max(12, { message: "Password exceeds 12 characters" }),
});

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrlPreview, setAvatavatarUrlPreview] = useState<string | null>(
    null
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      rollno: "",
      course: "",
      department: "",
      year: 1,
      avatarUrl: "",
      password: "",
    },
  });

  // Update department options based on course selection
  useEffect(() => {
    if (selectedCourse) {
      const courseData = courses.find((c) => c.course === selectedCourse);
      if (courseData) {
        // If there's only one department, auto-select it
        if (courseData.department.length === 1) {
          form.setValue("department", courseData.department[0]);
        } else {
          // Reset department if switching to a course with multiple departments
          form.setValue("department", "");
        }

        // Generate available years array based on the course's noOfYears
        const years = Array.from(
          { length: courseData.noOfYears },
          (_, i) => i + 1
        );
        setAvailableYears(years);

        // Reset year if previously selected year is not valid for new course
        const currentYear = form.getValues("year");
        if (!years.includes(currentYear)) {
          form.setValue("year", 1);
        }
      }
    } else {
      form.setValue("department", "");
      form.setValue("year", 1);
      setAvailableYears([]);
    }
  }, [selectedCourse, form]);

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
    // Create a new student object
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: values.name,
      email: values.email,
      course: values.course,
      department: values.department,
      year: values.year,
      avatarUrl: values.avatarUrl || "/placeholder-avatar.jpg",
      rollno: values.rollno, // Initial event count is zero
    };

    // Add the new student
    onAddStudent(newStudent);

    // Show success toast
    toast({
      title: "Student Added",
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
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Student
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
                    <User className="h-4 w-4" /> Student Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student name"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Roll no */}
            <FormField
              control={form.control}
              name="rollno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookUser className="h-4 w-4" /> Student Roll no
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student roll no"
                      {...field}
                      className="h-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <div>
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
            </div>

            {/* Course */}
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Course
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCourse(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={course.course}
                          value={course.course}
                        >
                          {course.course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Department
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCourse}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCourse &&
                        courses
                          .find((c) => c.course === selectedCourse)
                          ?.department.map((dept) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={dept}
                              value={dept}
                            >
                              {dept}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Current Year
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                    disabled={!selectedCourse}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                        <SelectValue placeholder="Select current year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={year}
                          value={year.toString()}
                        >
                          Year {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Create Student
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
