import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Student } from "@/types/student";

interface AttendeeTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: Student[];
  eventTitle: string;
}

const AttendeeTableModal = ({
  isOpen,
  onClose,
  attendees,
  eventTitle,
}: AttendeeTableModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredAttendees, setFilteredAttendees] =
    useState<Student[]>(attendees);

  const itemsPerPage = 5;

  // Filter attendees based on search term
  useEffect(() => {
    const filtered = attendees.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollno.includes(searchTerm)
    );
    setFilteredAttendees(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, attendees]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
  const currentAttendees = filteredAttendees.slice(
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

  const handleExportData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exporting attendee data...");
    // Example CSV generation logic:
    // const csvContent = "data:text/csv;charset=utf-8,"
    //   + "S.No,Name,Email,Phone,Roll No,Course\n"
    //   + attendees.map((student, index) =>
    //     `${index+1},${student.name},${student.email},${student.phone},${student.rollno},${student.course}`
    //   ).join("\n");
    // const encodedUri = encodeURI(csvContent);
    // window.open(encodedUri);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-blue-900/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold text-black dark:text-white mb-0">
                Event Attendees
                <span className="block text-sm font-normal text-blue-600/70 dark:text-blue-300/70 mt-1">
                  {eventTitle}
                </span>
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-500 dark:text-blue-400"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search and Export */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-gray-900">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500 dark:text-blue-400" />
                <Input
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900/50 py-5 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-600 text-gray-800 dark:text-gray-100"
                />
              </div>
              <Button
                onClick={handleExportData}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white h-10 px-4 rounded-lg flex items-center gap-2 hover:scale-105 transition-all duration-200 w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                <FileDown className="h-4 w-4" />
                <span>Export Table</span>
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-auto max-h-[calc(90vh-200px)]">
              <Table>
                <TableHeader className="bg-blue-50 dark:bg-blue-950/40 sticky top-0">
                  <TableRow className="border-b-blue-200 dark:border-b-blue-900/50">
                    <TableHead className="w-[60px] text-center text-blue-700 dark:text-blue-400 font-semibold">
                      S.No
                    </TableHead>
                    <TableHead className="w-[150px] text-blue-700 dark:text-blue-400 font-semibold">
                      Name
                    </TableHead>
                    <TableHead className="w-[200px] text-blue-700 dark:text-blue-400 font-semibold">
                      Contact
                    </TableHead>
                    <TableHead className="w-[120px] text-blue-700 dark:text-blue-400 font-semibold">
                      Roll No
                    </TableHead>
                    <TableHead className="w-[120px] text-blue-700 dark:text-blue-400 font-semibold">
                      Course
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAttendees.length > 0 ? (
                    currentAttendees.map((student, index) => (
                      <TableRow
                        key={student.id}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors border-b-gray-200 dark:border-b-gray-800"
                      >
                        <TableCell className="text-center font-medium text-gray-700 dark:text-gray-300">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                          <div className="truncate">{student.name}</div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex flex-col">
                            <span className="text-sm text-blue-600 dark:text-blue-400 truncate">
                              {student.email}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {student.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                          <div className="truncate">{student.rollno}</div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                          <div className="truncate">{student.course}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-gray-500 dark:text-gray-400"
                      >
                        No attendees found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredAttendees.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </PaginationItem>

                    {getPaginationRange().map((page, i) => (
                      <React.Fragment key={i}>
                        {page === "ellipsis-start" ||
                        page === "ellipsis-end" ? (
                          <PaginationItem>
                            <PaginationEllipsis className="text-blue-500 dark:text-blue-400" />
                          </PaginationItem>
                        ) : (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(page as number)}
                              isActive={currentPage === page}
                              className={`${
                                currentPage === page
                                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 cursor-pointer dark:hover:bg-blue-800 border-blue-600 dark:border-blue-700"
                                  : "hover:bg-blue-100 cursor-pointer dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                      </React.Fragment>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AttendeeTableModal;
