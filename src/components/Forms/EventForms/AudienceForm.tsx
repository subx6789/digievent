/* eslint-disable react-hooks/exhaustive-deps */
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
import { Event } from "@/types/event";
import { getOrdinalSuffix } from "@/utils/functions/getOrdinalSuffix";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  GraduationCap,
  Search,
  Users,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import clsx from "clsx";

interface AudienceFormProps {
  formData: Partial<Event>;
  updateFormData: (data: Partial<Event>) => void;
  courses: Course[];
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
  // State for selected courses and years
  const [selectedTargets, setSelectedTargets] = useState<{
    [courseName: string]: number[];
  }>({});

  // State for UI improvements
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Form schema
  const formSchema = z.object({
    capacity: z.string().min(1, "Capacity is required"),
    course: z.array(z.string()),
    year: z.array(z.string()),
  });

  // Initialize form with existing data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      capacity: formData.capacity || "",
      course: formData.course || [],
      year: formData.year || [],
    },
  });

  // Filter courses based on search and filter settings
  const filteredCourses = courses.filter((course) => {
    // Filter by search query
    const matchesSearch = course.courseName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filter by selection status if "show only selected" is active
    const isSelected = selectedTargets[course.courseName]?.length > 0;

    return matchesSearch && (!showOnlySelected || isSelected);
  });

  // Toggle course expansion
  const toggleCourseExpansion = (
    courseName: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.stopPropagation();
    }

    setExpandedCourses((prev) => {
      if (prev.includes(courseName)) {
        return prev.filter((name) => name !== courseName);
      } else {
        return [...prev, courseName];
      }
    });
  };

  // Get count of selected courses and years
  const getSelectionSummary = () => {
    const courseCount = Object.keys(selectedTargets).length;
    const yearCount = Object.values(selectedTargets).reduce(
      (sum, years) => sum + years.length,
      0
    );

    return { courseCount, yearCount };
  };

  const { courseCount, yearCount } = getSelectionSummary();

  // Initialize selected targets from form data
  useEffect(() => {
    if (formData.course?.length && formData.year?.length) {
      const initialTargets: { [courseName: string]: number[] } = {};

      // Process existing selections
      formData.course.forEach((courseName) => {
        const course = courses.find((c) => c.courseName === courseName);
        if (course) {
          initialTargets[courseName] = [];

          // Find years for this course
          for (let i = 1; i <= course.noOfYears; i++) {
            const yearStr = `${i}${getOrdinalSuffix(i)} Year`;
            if (formData.year?.includes(yearStr)) {
              initialTargets[courseName].push(i);
            }
          }
        }
      });

      setSelectedTargets(initialTargets);
    } else {
      // Default: select all courses and all years
      const allTargets: { [courseName: string]: number[] } = {};
      courses.forEach((course) => {
        allTargets[course.courseName] = Array.from(
          { length: course.noOfYears },
          (_, i) => i + 1
        );
      });
      setSelectedTargets(allTargets);

      // Update form values
      updateFormValues(allTargets);
    }
  }, []);

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateFormData(values);
  };

  // Auto-save on capacity change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "capacity" && value.capacity) {
        // Ensure capacity is properly formatted as a string
        value.capacity = String(parseInt(value.capacity));
        updateFormData({ capacity: value.capacity });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  // Update form values based on selected targets
  const updateFormValues = (targets: { [courseName: string]: number[] }) => {
    const selectedCourses: string[] = [];
    const selectedYears: string[] = [];

    Object.entries(targets).forEach(([courseName, years]) => {
      if (years.length > 0) {
        selectedCourses.push(courseName);
        years.forEach((year) => {
          const yearStr = `${year}${getOrdinalSuffix(year)} Year`;
          if (!selectedYears.includes(yearStr)) {
            selectedYears.push(yearStr);
          }
        });
      }
    });

    form.setValue("course", selectedCourses);
    form.setValue("year", selectedYears);

    // Update form data
    updateFormData({
      course: selectedCourses,
      year: selectedYears,
    });
  };

  // Toggle year selection for a course
  const toggleYearSelection = (courseName: string, year: number) => {
    setSelectedTargets((prev) => {
      const newTargets = { ...prev };

      // Initialize if not exists
      if (!newTargets[courseName]) {
        newTargets[courseName] = [];
      }

      // Toggle year
      if (newTargets[courseName].includes(year)) {
        newTargets[courseName] = newTargets[courseName].filter(
          (y) => y !== year
        );
      } else {
        newTargets[courseName] = [...newTargets[courseName], year];
      }

      // If no years selected, remove course
      if (newTargets[courseName].length === 0) {
        delete newTargets[courseName];
      }

      // Update form values
      updateFormValues(newTargets);

      return newTargets;
    });
  };

  // Toggle all years for a course
  const toggleAllYearsForCourse = (courseName: string) => {
    const course = courses.find((c) => c.courseName === courseName);
    if (!course) return;

    setSelectedTargets((prev) => {
      const newTargets = { ...prev };

      // If all years are already selected, deselect all
      const allYears = Array.from(
        { length: course.noOfYears },
        (_, i) => i + 1
      );
      const hasAllYears = allYears.every((year) =>
        newTargets[courseName]?.includes(year)
      );

      if (hasAllYears) {
        delete newTargets[courseName];
      } else {
        newTargets[courseName] = [...allYears];
      }

      // Update form values
      updateFormValues(newTargets);

      return newTargets;
    });
  };

  // Select all courses and years
  const selectAllCoursesAndYears = () => {
    const allTargets: { [courseName: string]: number[] } = {};
    courses.forEach((course) => {
      allTargets[course.courseName] = Array.from(
        { length: course.noOfYears },
        (_, i) => i + 1
      );
    });
    setSelectedTargets(allTargets);
    updateFormValues(allTargets);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedTargets({});
    updateFormValues({});
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

        {/* Target Audience - improved */}
        <div>
          <h3 className="text-lg font-medium mb-4">Target Audience</h3>

          {/* Selection summary */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {courseCount > 0 ? (
                <span>
                  Selected: <strong>{courseCount}</strong>{" "}
                  {courseCount === 1 ? "course" : "courses"} with{" "}
                  <strong>{yearCount}</strong>{" "}
                  {yearCount === 1 ? "year" : "years"}
                </span>
              ) : (
                <span>No courses selected</span>
              )}
            </p>

            <Button
              type="button"
              size="sm"
              onClick={selectAllCoursesAndYears}
              className="bg-blue-600 hover:bg-blue-700 h-10 text-white hover:scale-105 transition-all duration-150"
            >
              Select All
            </Button>
          </div>

          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              className={clsx(
                "h-10 flex items-center gap-2 transition-all duration-200 font-medium",
                showOnlySelected
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md hover:scale-[1.02]"
                  : "bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              )}
            >
              <Filter
                className={clsx(
                  "h-4 w-4",
                  showOnlySelected
                    ? "text-white"
                    : "text-blue-500 dark:text-blue-400"
                )}
              />
              <span>
                {showOnlySelected ? "Showing Selected" : "Show Selected Only"}
              </span>
            </Button>
          </div>

          {/* Course list with virtualization for better performance */}
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            {filteredCourses.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchQuery ? (
                  <p>No courses match your search. Try a different term.</p>
                ) : showOnlySelected ? (
                  <p>
                    No courses selected yet. Disable the filter to see all
                    courses.
                  </p>
                ) : (
                  <p>No courses available.</p>
                )}
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map((course) => {
                    const isExpanded = expandedCourses.includes(
                      course.courseName
                    );
                    const selectedYears =
                      selectedTargets[course.courseName] || [];
                    const allYearsSelected =
                      selectedYears.length === course.noOfYears;
                    const someYearsSelected =
                      selectedYears.length > 0 && !allYearsSelected;

                    return (
                      <Collapsible
                        key={course.courseName}
                        open={isExpanded}
                        onOpenChange={() => {}}
                        className="border-0"
                      >
                        <div
                          className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
                            allYearsSelected
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : someYearsSelected
                              ? "bg-blue-50/50 dark:bg-blue-900/10"
                              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                          }`}
                          onClick={() =>
                            toggleAllYearsForCourse(course.courseName)
                          }
                        >
                          <div className="flex items-center gap-2 flex-grow">
                            <GraduationCap
                              className={`h-5 w-5 ${
                                allYearsSelected || someYearsSelected
                                  ? "text-blue-500 dark:text-blue-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                            <div>
                              <span className="font-medium">
                                {course.courseName}
                              </span>
                              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {course.noOfYears}{" "}
                                {course.noOfYears === 1 ? "Year" : "Years"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {allYearsSelected && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
                                <Check className="h-3 w-3" /> All Years
                              </Badge>
                            )}
                            {someYearsSelected && (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                {selectedYears.length}/{course.noOfYears} Years
                              </Badge>
                            )}

                            <CollapsibleTrigger
                              asChild
                              onClick={(e) =>
                                toggleCourseExpansion(course.courseName, e)
                              }
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <CollapsibleContent>
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-800/50">
                            {Array.from(
                              { length: course.noOfYears },
                              (_, i) => i + 1
                            ).map((year) => {
                              const isSelected = selectedYears.includes(year);
                              return (
                                <div
                                  key={`${course.courseName}-${year}`}
                                  onClick={() =>
                                    toggleYearSelection(course.courseName, year)
                                  }
                                  className={`
                                    flex items-center gap-2 p-3 rounded-md cursor-pointer transition-all
                                    ${
                                      isSelected
                                        ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    }
                                  `}
                                >
                                  <Calendar
                                    className={`h-4 w-4 ${
                                      isSelected
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm ${
                                      isSelected
                                        ? "font-medium text-blue-700 dark:text-blue-300"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {year}
                                    {getOrdinalSuffix(year)} Year
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Summary of selections */}
          {yearCount > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Selected Audience:</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSelections}
                  className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear All
                </Button>
              </div>

              <ScrollArea className="max-h-[150px]">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedTargets).map(([courseName, years]) =>
                    years.map((year) => (
                      <Badge
                        key={`${courseName}-${year}`}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1 py-1 px-2"
                      >
                        <span>
                          {courseName} - {year}
                          {getOrdinalSuffix(year)} Year
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleYearSelection(courseName, year)}
                          className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AudienceForm;
