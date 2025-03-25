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
import { Course } from "@/utils/data/courses";
import { Users } from "lucide-react";

// Form schema
const formSchema = z.object({
  capacity: z.string().min(1, "Capacity is required"),
  course: z.array(z.string()).min(1, "At least one course must be selected"),
  department: z.array(z.string()).optional(),
  year: z.array(z.string()).optional(),
});

interface AudienceFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
  courses: Course[]; // Using your existing Course type
}

const AudienceForm = ({
  formData,
  updateFormData,
  courses,
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

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  // Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };

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
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter maximum number of attendees"
                    {...field}
                    className="pl-10 h-11 bg-white dark:bg-gray-800 text-black dark:text-white"
                    min="1"
                  />
                </div>
              </FormControl>
              <FormDescription>
                The maximum number of people who can attend this event. Enter 0
                for unlimited capacity.
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
