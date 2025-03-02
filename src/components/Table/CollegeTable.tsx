"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import clsx from "clsx";

export type College = {
  id: string;
  name: string;
  phone: string;
  email: string;
  logo: string;
  location: string;
  status: "active" | "suspended";
};

type CollegeTableProps = {
  colleges: College[];
};

export const CollegeTable = ({ colleges }: CollegeTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeData, setCollegeData] = useState(colleges);
  const itemsPerPage = 5;

  // Handle search filter across all fields
  const filteredColleges = collegeData.filter((college) =>
    Object.values(college).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
  const displayedColleges = filteredColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleStatus = (id: string) => {
    setCollegeData((prev) =>
      prev.map((college) =>
        college.id === id
          ? {
              ...college,
              status: college.status === "active" ? "suspended" : "active",
            }
          : college
      )
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="p-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 py-5"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-200 dark:border-gray-800">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="font-medium">College Name</TableHead>
            <TableHead className="font-medium">Location</TableHead>
            <TableHead className="font-medium">Phone Number</TableHead>
            <TableHead className="font-medium">Email Address</TableHead>
            <TableHead className="font-medium text-right pr-6">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedColleges.length > 0 ? (
            displayedColleges.map((college) => (
              <TableRow
                key={college.id}
                className={clsx(
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800",
                  {
                    "opacity-50": college.status === "suspended",
                  }
                )}
              >
                <TableCell className="w-[50px]">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarImage src={college.logo} alt={college.name} />
                      <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        {college.name
                          .toUpperCase()
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>
                <TableCell
                  className={clsx("font-medium", {
                    "text-gray-400": college.status === "suspended",
                  })}
                >
                  {college.name}
                </TableCell>
                <TableCell
                  className={clsx({
                    "text-gray-400": college.status === "suspended",
                  })}
                >
                  {college.location}
                </TableCell>
                <TableCell
                  className={clsx({
                    "text-gray-400": college.status === "suspended",
                  })}
                >
                  {college.phone}
                </TableCell>
                <TableCell
                  className={clsx({
                    "text-gray-400": college.status === "suspended",
                  })}
                >
                  {college.email}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={
                      college.status === "active" ? "default" : "destructive"
                    }
                    size="sm"
                    className={clsx(
                      "hover:scale-105 transition-all duration-150",
                      college.status === "active"
                        ? "bg-blue-600 hover:bg-blue-700 text-white px-6"
                        : "px-6"
                    )}
                    onClick={() => toggleStatus(college.id)}
                  >
                    {college.status === "active" ? "Suspend" : "Resume"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-gray-500 dark:text-gray-400 py-4"
              >
                No colleges found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center space-x-2 py-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
