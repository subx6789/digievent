"use client";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import React from "react";

const Sidebar = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) => {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset className="px-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;
