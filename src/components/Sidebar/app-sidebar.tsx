"use client";

import * as React from "react";
import {
  CalendarDays,
  LayoutDashboard,
  Settings2,
  TicketCheck,
  Users,
  LucideIcon,
  Building2Icon,
} from "lucide-react";

import { NavMain } from "@/components/Sidebar/nav-main";
import { NavUser } from "@/components/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { sidebarDataAdmin } from "@/utils/data/sidebarDataAdmin";
import { sidebarDataSuperAdmin } from "@/utils/data/sidebarDataSuperAdmin";

// Define valid roles
type Role = "SuperAdmin" | "Admin" | "Organiser";

// Define role-based icons explicitly as LucideIcon
const roleIcons: Record<Role, Record<string, LucideIcon>> = {
  SuperAdmin: {
    Overview: LayoutDashboard,
    "Manage Colleges": Building2Icon,
  },
  Admin: {
    Overview: LayoutDashboard,
    "Event Requests": CalendarDays,
    Organisers: Users,
    Settings: Settings2,
  },
  Organiser: {
    Dashboard: LayoutDashboard,
    "My Events": TicketCheck,
    Settings: Settings2,
  },
};

// Mock user data

export function AppSidebar({ role }: { role: string }) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:scale-105 transition-all duration-150"
            >
              <Link href="/admin/dashboard/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <TicketCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Digievent</span>
                  <span className="truncate text-xs">
                    {role === "admin"
                      ? sidebarDataAdmin.user.role
                      : sidebarDataSuperAdmin.user.role}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            role === "admin"
              ? sidebarDataAdmin.navMain.map((item) => ({
                  ...item,
                  icon:
                    roleIcons[sidebarDataAdmin.user.role as Role]?.[
                      item.title
                    ] || LayoutDashboard, // Default icon
                }))
              : sidebarDataSuperAdmin.navMain.map((item) => ({
                  ...item,
                  icon:
                    roleIcons[sidebarDataSuperAdmin.user.role as Role]?.[
                      item.title
                    ] || LayoutDashboard, // Default icon
                }))
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            role === "admin"
              ? sidebarDataAdmin.user
              : sidebarDataSuperAdmin.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
