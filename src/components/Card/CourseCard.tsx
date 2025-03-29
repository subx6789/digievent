import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onRemove: (courseId: string) => void;
}

const CourseCard = ({ course, onEdit, onRemove }: CourseCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasManyDepartments = course.department.length > 2;

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${course.course}?`)) {
      onRemove(course.course);
      toast({
        title: "Course Removed",
        description: `${course.course} has been successfully removed.`,
        variant: "default",
      });
    }
  };

  // Display first department and then a +X more text if not expanded
  const visibleDepartments =
    isOpen || !hasManyDepartments
      ? course.department
      : course.department.slice(0, 1);

  const hiddenCount = course.department.length - visibleDepartments.length;

  return (
    <Card className="w-full max-w-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {course.course}
          </CardTitle>
          <Badge
            variant="outline"
            className="px-2 py-1 shrink-0 font-medium bg-gray-500 dark:bg-gray-900 text-white"
          >
            {course.noOfYears} {course.noOfYears > 1 ? "Years" : "Year"}
          </Badge>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{course.noOfYears} Year Program</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-3">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Departments
                  </h3>
                  {hasManyDepartments && (
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-blue-600 dark:text-blue-400"
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap gap-1">
                  {visibleDepartments.map((dept, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                    >
                      {dept}
                    </Badge>
                  ))}

                  {!isOpen && hiddenCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      +{hiddenCount} more
                    </Badge>
                  )}
                </div>

                <CollapsibleContent
                  className={cn(
                    "overflow-hidden transition-all",
                    isOpen ? "mt-2" : "mt-0"
                  )}
                >
                  {hasManyDepartments && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <p className="text-xs italic">
                        All departments listed above
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </div>
          </Collapsible>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 mt-auto flex justify-between gap-2">
        <Button
          className="flex-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow hover:shadow-md hover:scale-105 transition-all duration-150"
          onClick={() => onEdit(course)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Course
        </Button>
        <Button
          className="rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow hover:shadow-md hover:scale-105 transition-all duration-150"
          onClick={handleRemove}
          variant="destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
