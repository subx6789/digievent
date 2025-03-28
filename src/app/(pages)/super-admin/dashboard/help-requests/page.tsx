"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  CircleCheck,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { HelpRequest } from "@/types/helpRequest";
import { mockHelpRequests } from "@/utils/data/mockHelpRequests";

const SuperAdminHelpRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter and search functionality
  const filteredRequests = mockHelpRequests.filter((request) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && request.status === "unread") ||
      (filter === "read" && request.status === "read");

    const matchesSearch =
      request.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleRequestClick = (request: HelpRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
    // In a real app, you would mark the request as read here
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  const markAsResolved = (id: string) => {
    // In a real app, you would update the status in the database
    console.log(`Marked request ${id} as resolved`);
    setIsDetailOpen(false);
  };

  return (
    <Sidebar role="super-admin">
      <Header />
      <div className="mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Page Header */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filters and Search */}
            <div className="flex w-full gap-3 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search colleges, subjects, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white dark:bg-gray-800 h-11"
                />
              </div>
              <div className="w-[180px] flex-shrink-0">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 h-11">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="all">
                      All
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="unread">
                      Unread
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="read">
                      Read
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {filteredRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <li
                    key={request.id}
                    className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${
                      request.status === "unread"
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                    onClick={() => handleRequestClick(request)}
                  >
                    <div className="p-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              request.status === "unread"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {request.collegeName}
                            </p>
                            <div className="flex items-center mt-1">
                              <Mail className="flex-shrink-0 mr-1.5 h-3 w-3 text-gray-500 dark:text-gray-400" />
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {request.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(request.date, "MMM d, h:mm a")}
                            </p>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="mr-1 h-3 w-3 text-gray-500 dark:text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                              {request.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {request.subject}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {request.message}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center">
                        {request.status === "unread" ? (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50">
                            New Request
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                            Viewed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No help requests found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search or filter criteria"
                    : "All colleges are doing well! No help needed at the moment."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Detail Box */}
      <AnimatePresence>
        {isDetailOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-t-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                      {selectedRequest.collegeName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                      <Mail className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {selectedRequest.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                      <MapPin className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {selectedRequest.location}
                    </p>
                  </div>
                  <button
                    onClick={closeDetail}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      {selectedRequest.subject}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1.5 h-4 w-4" />
                      {format(selectedRequest.date, "PPP")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedRequest.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={closeDetail}
                    className="border-gray-300 dark:border-gray-600 bg-transparent text-black dark:text-white h-11 hover:scale-105 duration-150 transition-all"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => markAsResolved(selectedRequest.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-11 hover:scale-105 duration-150 transition-all"
                  >
                    <CircleCheck className="mr-1 h-5 w-5" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Sidebar>
  );
};

export default SuperAdminHelpRequests;
