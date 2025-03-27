"use client";

import { BadgeHelp, ChevronsUpDown, LogOut, User } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import HelpModal from "@/components/Modals/HelpModal";
import ProfileModal from "@/components/Modals/ProfileModal";

export function NavUser({
  user,
}: {
  user: {
    avatar: string | undefined;
    name: string;
    email: string;
    role: string;
    phone: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const handleHelpClick = () => {
    // Close dropdown first
    document.body.click(); // This will close the dropdown
    // Then open modal with a small delay
    setTimeout(() => {
      setIsHelpModalOpen(true);
    }, 100);
  };

  const handleProfileClick = () => {
    // Close dropdown first
    document.body.click(); // This will close the dropdown
    // Then open modal with a small delay
    setTimeout(() => {
      setIsProfileModalOpen(true);
    }, 100);
  };

  const handleCloseHelpModal = () => {
    // Force a small delay to ensure proper cleanup
    setTimeout(() => {
      setIsHelpModalOpen(false);
    }, 0);
  };

  const handleCloseProfileModal = () => {
    // Force a small delay to ensure proper cleanup
    setTimeout(() => {
      setIsProfileModalOpen(false);
    }, 0);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:scale-105 transition-all duration-150"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              {pathname?.includes("/admin") && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={handleHelpClick}
                      className="cursor-pointer"
                    >
                      <BadgeHelp className="mr-2 h-4 w-4" />
                      Help
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={handleCloseHelpModal}
        userEmail={user.email}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone,
        }}
      />
    </>
  );
}
