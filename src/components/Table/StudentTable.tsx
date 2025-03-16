import { Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export interface Student {
  id: string;
  name: string;
  email: string;
  rollno: string;
  avatarUrl: string;
  course: string;
  department: string;
  year: number | undefined;
}

interface StudentTableProps {
  students: Student[];
}

const StudentTable = ({ students }: StudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  const itemsPerPage = 5;

  // Filter studentss based on search term
  useEffect(() => {
    const filtered = students.filter(
      (students) =>
        students.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        students.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        students.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        students.rollno.includes(searchTerm)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, students]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Create pagination range with ellipsis for many pages
  const getPaginationRange = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];

    // Always include first page
    range.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      range.push("ellipsis-start");
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      range.push("ellipsis-end");
    }

    // Always include last page if not already included
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  // Handle remove students action
  const handleRemoveStudent = (studentsId: string) => {
    console.log("Remove students:", studentsId);
    // Show confirmation dialog and remove
  };

  return (
    <div className="space-y-4 hover:drop-shadow-md">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Integrated header with search and actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 py-5"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="w-[200px] text-gray-700 dark:text-gray-300 p-4">
                    Students
                  </TableHead>
                  <TableHead className="w-[250px] text-gray-700 dark:text-gray-300 p-4">
                    Email
                  </TableHead>
                  <TableHead className="w-[70px] text-gray-700 dark:text-gray-300 p-4">
                    Roll no
                  </TableHead>
                  <TableHead className="w-[150px] text-right text-gray-700 dark:text-gray-300 p-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((students) => (
                    <TableRow
                      key={students.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <TableCell className="w-[200px] p-4">
                        <div className="h-10 w-full flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage
                              src={students.avatarUrl}
                              alt={students.name}
                            />
                            <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                              {students.name
                                .toUpperCase()
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {students.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {students.course}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[250px] p-4">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {students.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[70px] text-gray-900 dark:text-white p-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium">
                          {students.rollno}
                        </span>
                      </TableCell>
                      <TableCell className="w-[150px] text-right p-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => handleRemoveStudent(students.id)}
                            title="Remove Students"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 mb-2 text-gray-400" />
                        <p>No students found</p>
                        {searchTerm && (
                          <p className="text-sm mt-1">
                            Try adjusting your search term
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination inside the card */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {getPaginationRange().map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "ellipsis-start" || page === "ellipsis-end" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;
