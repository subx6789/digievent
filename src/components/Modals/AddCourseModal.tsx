"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/modal-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, BookOpen, Calendar, X, Plus } from "lucide-react";
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
import { Course } from "@/types/course";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
  onUpdateCourse?: (updatedCourse: Course, originalCourseId: string) => void;
  editCourse?: Course | null;
}

// Form validation schema
const formSchema = z.object({
  course: z
    .string()
    .min(2, { message: "Course name must be at least 2 characters" }),
  noOfYears: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 year" })
    .max(10, { message: "Duration cannot exceed 10 years" }),
});

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
  onUpdateCourse,
  editCourse,
}) => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<string[]>([""]);
  const [originalCourseId, setOriginalCourseId] = useState<string>("");
  const isEditMode = !!editCourse;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      course: "",
    },
  });

  // Update form when editCourse changes
  useEffect(() => {
    if (editCourse) {
      form.reset({
        course: editCourse.course,
        noOfYears: editCourse.noOfYears,
      });
      setDepartments([...editCourse.department]);
      setOriginalCourseId(editCourse.course);
    } else {
      form.reset({
        course: "",
      });
      setDepartments([""]);
      setOriginalCourseId("");
    }
  }, [editCourse, form]);

  const handleDepartmentChange = (index: number, value: string) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
  };

  const addDepartmentField = () => {
    setDepartments([...departments, ""]);
  };

  const removeDepartmentField = (index: number) => {
    if (departments.length > 1) {
      const newDepartments = departments.filter((_, i) => i !== index);
      setDepartments(newDepartments);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out empty departments
    const filteredDepartments = departments.filter(
      (dept) => dept.trim() !== ""
    );

    if (filteredDepartments.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one department is required",
        variant: "destructive",
      });
      return;
    }

    // Create a course object
    const courseData: Course = {
      course: values.course,
      department: filteredDepartments,
      noOfYears: values.noOfYears,
      id: isEditMode ? originalCourseId : values.course, // Use course name as ID for now
    };

    // Check if we're editing or adding
    if (isEditMode && onUpdateCourse) {
      onUpdateCourse(courseData, originalCourseId);
      toast({
        title: "Course Updated",
        description: `${values.course} has been successfully updated.`,
        variant: "default",
      });
    } else {
      onAddCourse(courseData);
      toast({
        title: "Course Added",
        description: `${values.course} has been successfully added.`,
        variant: "default",
      });
    }

    // Reset form and close modal
    form.reset();
    setDepartments([""]);
    onClose();
  };

  const isFormValid = () => {
    const isFormFieldsValid = form.formState.isValid;
    const hasDepartment = departments.some((dept) => dept.trim() !== "");
    return isFormFieldsValid && hasDepartment;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Course" : "Add New Course"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-4"
          >
            {/* Course Name */}
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Course Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. BTech, MCA, BA-LLB"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Duration in Years */}
            <FormField
              control={form.control}
              name="noOfYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                    Duration (Years)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 4"
                      {...field}
                      className="h-10 pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      min={1}
                      max={10}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Departments */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />{" "}
                Departments
              </Label>

              {departments.map((dept, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={dept}
                    onChange={(e) =>
                      handleDepartmentChange(index, e.target.value)
                    }
                    placeholder="e.g. Computer Science and Engineering"
                    className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDepartmentField(index)}
                    disabled={departments.length === 1}
                    className="shrink-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDepartmentField}
                className="mt-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Department
              </Button>
            </div>

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
                disabled={!isFormValid()}
                className="h-11 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 font-medium transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isEditMode ? "Update Course" : "Add Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
