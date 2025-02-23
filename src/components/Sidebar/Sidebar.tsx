import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import React from "react";
import Header from "../Header/Header";

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
      <SidebarInset className="px-4">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;
