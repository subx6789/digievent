"use client";

import * as React from "react";
import {
  CalendarDays,
  LayoutDashboard,
  Settings2,
  TicketCheck,
  Users,
  LucideIcon,
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

// Define valid roles
type Role = "Admin" | "Organiser";

// Define role-based icons explicitly as LucideIcon
const roleIcons: Record<Role, Record<string, LucideIcon>> = {
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
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
                    {sidebarDataAdmin.user.role}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={sidebarDataAdmin.navMain.map((item) => ({
            ...item,
            icon:
              roleIcons[sidebarDataAdmin.user.role as Role]?.[item.title] ||
              LayoutDashboard, // Default icon
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarDataAdmin.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
