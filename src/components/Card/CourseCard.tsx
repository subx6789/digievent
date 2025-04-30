import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onRemove: (courseId: string) => void;
}

const CourseCard = ({ course, onEdit, onRemove }: CourseCardProps) => {
  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${course.courseName}?`)) {
      onRemove(course.courseName);
      toast({
        title: "Course Removed",
        description: `${course.courseName} has been successfully removed.`,
        variant: "default",
      });
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full hover:border-blue-300 dark:hover:border-blue-500">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200 group-hover:from-blue-700 group-hover:to-blue-500 dark:group-hover:from-blue-300 dark:group-hover:to-blue-100 transition-all duration-300">
              {course.courseName}
            </span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Duration:
            </span>
            <div className="ml-2">
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium px-2.5 py-1"
              >
                {course.noOfYears} {course.noOfYears === 1 ? "Year" : "Years"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-3 flex gap-2">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-150 hover:scale-105 h-10"
          onClick={() => onEdit(course)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Course
        </Button>
        <Button
          variant={"destructive"}
          size="icon"
          className="h-10 w-10 text-white transition-all duration-150 hover:scale-105 bg-red-500"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
