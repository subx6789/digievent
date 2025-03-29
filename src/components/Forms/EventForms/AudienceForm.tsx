"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/types/event";
import { Users } from "lucide-react";
import { getOrdinalSuffix } from "@/utils/functions/getOrdinalSuffix";
import { Course } from "@/types/course";

interface AudienceFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
  courses: Course[]; // Using your existing Course type
  editMode?: boolean;
  restrictions?: {
    capacity?: {
      minValue: string;
      canEdit: boolean;
    };
    course?: boolean;
    department?: boolean;
    year?: boolean;
  };
}

const AudienceForm = ({
  formData,
  updateFormData,
  courses,
  editMode,
  restrictions,
}: AudienceFormProps) => {
  // State for departments and years based on selected courses
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    []
  );
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(
    formData.course || []
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    formData.department || []
  );
  const [maxYears, setMaxYears] = useState<number>(0);

  // Form schema
  const formSchema = z.object({
    capacity: z
      .string()
      .min(1, "Capacity is required")
      .refine(
        (val) => {
          const capacityValue = parseInt(val);
          // Only validate if it's a valid number
          if (!isNaN(capacityValue) && hasCapacityRestriction) {
            return capacityValue >= parseInt(restrictions!.capacity!.minValue);
          }
          return true;
        },
        {
          message: `Capacity must be at least ${restrictions?.capacity?.minValue} seats`,
        }
      ),
    course: z.array(z.string()).min(1, "At least one course must be selected"),
    department: z.array(z.string()),
    year: z.array(z.string()),
  });

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      capacity: formData.capacity || "",
      course: formData.course || [],
      department: formData.department || [],
      year: formData.year || [],
    },
  });

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFormData(values);
  };

  // Auto-save on field change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Make sure capacity is properly converted to a string before updating
      if (value.capacity) {
        // Ensure capacity is properly formatted as a string
        value.capacity = String(parseInt(value.capacity));
      }
      updateFormData(value as Partial<Event>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  // Update available departments when courses change
  useEffect(() => {
    if (selectedCourses.length === 0) {
      setAvailableDepartments([]);
      setMaxYears(0);
      return;
    }

    const departments = new Set<string>();
    let maxYearsValue = 0;

    selectedCourses.forEach((courseName) => {
      const course = courses.find((c) => c.course === courseName);
      if (course) {
        course.department.forEach((dept) => departments.add(dept));
        if (course.noOfYears > maxYearsValue) {
          maxYearsValue = course.noOfYears;
        }
      }
    });

    setAvailableDepartments(Array.from(departments));
    setMaxYears(maxYearsValue);
  }, [selectedCourses, courses]);

  // Update available years when max years changes
  useEffect(() => {
    if (maxYears === 0) {
      setAvailableYears([]);
      return;
    }

    const years = [];
    for (let i = 1; i <= maxYears; i++) {
      years.push(`${i}${getOrdinalSuffix(i)} Year`);
    }
    setAvailableYears(years);
  }, [maxYears]);

  // Handle course selection
  const handleCourseChange = (courseName: string, checked: boolean) => {
    const updatedCourses = checked
      ? [...selectedCourses, courseName]
      : selectedCourses.filter((c) => c !== courseName);

    setSelectedCourses(updatedCourses);
    form.setValue("course", updatedCourses);

    // Reset departments and years if no courses selected
    if (updatedCourses.length === 0) {
      setSelectedDepartments([]);
      form.setValue("department", []);
      form.setValue("year", []);
    }
  };

  // Handle department selection
  const handleDepartmentChange = (deptName: string, checked: boolean) => {
    const updatedDepartments = checked
      ? [...selectedDepartments, deptName]
      : selectedDepartments.filter((d) => d !== deptName);

    setSelectedDepartments(updatedDepartments);
    form.setValue("department", updatedDepartments);

    // Reset years if no departments selected
    if (updatedDepartments.length === 0) {
      form.setValue("year", []);
    }
  };

  // Check if capacity has a minimum value restriction
  const hasCapacityRestriction =
    editMode &&
    restrictions?.capacity?.minValue &&
    parseInt(restrictions.capacity.minValue) > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Capacity</FormLabel>
              <FormControl>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    type="number"
                    className="pl-10 h-11 bg-white text-black dark:bg-gray-800 dark:text-white"
                    placeholder="Enter maximum number of attendees"
                    {...field}
                    min={
                      hasCapacityRestriction
                        ? restrictions?.capacity?.minValue
                        : "1"
                    }
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter the maximum number of attendees allowed.
                {hasCapacityRestriction && (
                  <span className="text-amber-500 block mt-1">
                    Capacity cannot be decreased below{" "}
                    {restrictions?.capacity?.minValue} (current capacity)
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Courses */}
        <FormField
          control={form.control}
          name="course"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Target Courses</FormLabel>
                <FormDescription>
                  Select which courses this event is intended for.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <FormItem
                    key={course.course}
                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                  >
                    <FormControl>
                      <Checkbox
                        checked={selectedCourses.includes(course.course)}
                        onCheckedChange={(checked) =>
                          handleCourseChange(course.course, checked as boolean)
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        {course.course}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {course.noOfYears} year program
                      </FormDescription>
                    </div>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Departments - only show if courses are selected */}
        {availableDepartments.length > 0 && (
          <FormField
            control={form.control}
            name="department"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Target Departments
                  </FormLabel>
                  <FormDescription>
                    Select which departments this event is intended for.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableDepartments.map((dept) => (
                    <FormItem
                      key={dept}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                    >
                      <FormControl>
                        <Checkbox
                          checked={selectedDepartments.includes(dept)}
                          onCheckedChange={(checked) =>
                            handleDepartmentChange(dept, checked as boolean)
                          }
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          {dept}
                        </FormLabel>
                      </div>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Years - only show if departments are selected */}
        {availableYears.length > 0 && selectedDepartments.length > 0 && (
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Target Years</FormLabel>
                  <FormDescription>
                    Select which years this event is intended for.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {availableYears.map((year) => (
                    <FormItem
                      key={year}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(year)}
                          onCheckedChange={(checked) => {
                            const updatedYears = checked
                              ? [...(field.value || []), year]
                              : field.value?.filter((y) => y !== year) || [];
                            field.onChange(updatedYears);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          {year}
                        </FormLabel>
                      </div>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};

export default AudienceForm;
