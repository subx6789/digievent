// components/OrganizerTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface Organizer {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  eventCount: number;
}

interface OrganizerTableProps {
  organizers: Organizer[];
}

export default function OrganizerTable({ organizers }: OrganizerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ">
      <Table>
        <TableHeader>
          <TableRow className="w-full bg-gray-100 dark:bg-gray-800">
            <TableHead className="w-[200px] text-gray-700 dark:text-gray-300 p-6">
              Organizer
            </TableHead>
            <TableHead className="w-[250px] text-gray-700 dark:text-gray-300 p-6">
              Contact
            </TableHead>
            <TableHead className="w-[70px] text-gray-700 dark:text-gray-300 p-6">
              Events
            </TableHead>
            <TableHead className="w-[100px] text-right text-gray-700 dark:text-gray-300 p-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.map((organizer) => (
            <TableRow
              key={organizer.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="w-[200px] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                    {organizer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
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
              <TableCell className="w-[250px] p-6">
                <div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {organizer.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {organizer.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[100px] text-gray-900 dark:text-white p-6">
                {organizer.eventCount}
              </TableCell>
              <TableCell className="w-[100px] text-right p-6">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900"
                    onClick={() => console.log("Delete:", organizer.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
