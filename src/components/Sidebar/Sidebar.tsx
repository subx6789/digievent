import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import React from "react";
import Header from "../Header/Header";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="px-4">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;
