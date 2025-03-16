"use client";

import * as React from "react";
import {
  CalendarDays,
  LayoutDashboard,
  TicketCheck,
  Users,
  LucideIcon,
  Building2,
  CalendarCheck,
  ChartNoAxesCombined,
  SquareUserRound,
  BookOpen,
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
import { sidebarDataOrganizer } from "@/utils/data/sidebarDataOrganizer";

// Define valid roles
type Role = "Super Admin" | "Admin" | "Organizer";

// Define role-based icons explicitly as LucideIcon
const roleIcons: Record<Role, Record<string, LucideIcon>> = {
  "Super Admin": {
    Overview: LayoutDashboard,
    "Manage Colleges": Building2,
  },
  Admin: {
    Overview: LayoutDashboard,
    "Event Requests": CalendarDays,
    Organizers: Users,
    Courses: BookOpen,
    Students: SquareUserRound,
  },
  Organizer: {
    Events: CalendarCheck,
    Metrics: ChartNoAxesCombined,
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
              <Link
                href={
                  role === "admin"
                    ? `/admin/dashboard/overview`
                    : role === "super-admin"
                    ? `/super-admin/dashboard/overview`
                    : `/organizer/dashboard/events`
                }
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <TicketCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Digievent</span>
                  <span className="truncate text-xs">
                    {role === "admin"
                      ? sidebarDataAdmin.user.role
                      : role === "super-admin"
                      ? sidebarDataSuperAdmin.user.role
                      : sidebarDataOrganizer.user.role}
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
              : role === "super-admin"
              ? sidebarDataSuperAdmin.navMain.map((item) => ({
                  ...item,
                  icon:
                    roleIcons[sidebarDataSuperAdmin.user.role as Role]?.[
                      item.title
                    ] || LayoutDashboard, // Default icon
                }))
              : sidebarDataOrganizer.navMain.map((item) => ({
                  ...item,
                  icon:
                    roleIcons[sidebarDataOrganizer.user.role as Role]?.[
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
              : role === "super-admin"
              ? sidebarDataSuperAdmin.user
              : sidebarDataOrganizer.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
