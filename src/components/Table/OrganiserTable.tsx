"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2, Search, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface Organizer {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  eventCount: number;
  avatarUrl: string;
}

interface OrganizerTableProps {
  organizers: Organizer[];
  onEditOrganizer: (organizerId: string) => void;
  onRemoveOrganizer: (organizerId: string) => void;
}

export default function OrganizerTable({
  organizers,
  onEditOrganizer,
  onRemoveOrganizer,
}: OrganizerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrganizers, setFilteredOrganizers] =
    useState<Organizer[]>(organizers);

  const itemsPerPage = 5;

  // Filter organizers based on search term
  useEffect(() => {
    const filtered = organizers.filter(
      (organizer) =>
        organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.organization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        organizer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        organizer.phone.includes(searchTerm)
    );
    setFilteredOrganizers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, organizers]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage);
  const currentOrganizers = filteredOrganizers.slice(
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

  return (
    <div className="space-y-4 hover:drop-shadow-md">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Integrated header with search and actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search organizers..."
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
                    Organizer
                  </TableHead>
                  <TableHead className="w-[250px] text-gray-700 dark:text-gray-300 p-4">
                    Contact
                  </TableHead>
                  <TableHead className="w-[70px] text-gray-700 dark:text-gray-300 p-4">
                    Events
                  </TableHead>
                  <TableHead className="w-[150px] text-right text-gray-700 dark:text-gray-300 p-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrganizers.length > 0 ? (
                  currentOrganizers.map((organizer) => (
                    <TableRow
                      key={organizer.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <TableCell className="w-[200px] p-4">
                        <div className="h-10 w-full flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage
                              src={organizer.avatarUrl}
                              alt={organizer.name}
                            />
                            <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                              {organizer.name
                                .toUpperCase()
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {organizer.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {organizer.organization}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[250px] p-4">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {organizer.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {organizer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[70px] text-gray-900 dark:text-white p-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium">
                          {organizer.eventCount}
                        </span>
                      </TableCell>
                      <TableCell className="w-[150px] text-right p-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900"
                            onClick={() => onEditOrganizer(organizer.id)}
                            title="Edit Organizer"
                          >
                            <UserRoundPen className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => onRemoveOrganizer(organizer.id)}
                            title="Remove Organizer"
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
                        <p>No organizers found</p>
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
              {Math.min(currentPage * itemsPerPage, filteredOrganizers.length)}{" "}
              of {filteredOrganizers.length} organizers
            </span>
            <Pagination>
              <PaginationContent className="flex items-center gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`
                      border border-gray-200 dark:border-gray-700 
                      hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-gray-700 dark:text-gray-300 
                      rounded-md transition-colors duration-200 cursor-pointer
                      ${
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  />
                </PaginationItem>

                {getPaginationRange().map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "ellipsis-start" || page === "ellipsis-end" ? (
                      <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className={`
                          transition-all duration-200 cursor-pointer
                          border rounded-md
                          ${
                            currentPage === page
                              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white border-blue-600 dark:border-blue-700"
                              : "bg-transparent dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          }
                        `}
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
                    className={`
                      border border-gray-200 dark:border-gray-700 
                      hover:bg-gray-100 dark:hover:bg-gray-800 
                      text-gray-700 dark:text-gray-300 
                      rounded-md transition-colors duration-200 cursor-pointer
                      ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
