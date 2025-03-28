"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { LogOut, History, User, TicketCheck, Ticket } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ThemeToggler/ThemeToggler";
import { usePathname, useRouter } from "next/navigation";
import { studentData } from "@/utils/data/studentData";
import { landing_content } from "@/utils/data/landing_content";

const Navbar = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const pathname = usePathname();

  // State for scroll behavior
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [showScrollProgress, setShowScrollProgress] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Update the scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if navbar should be hidden
      if (currentScrollY < 100) {
        setHidden(false);
      } else {
        setHidden(currentScrollY > lastScrollY);
      }

      // Show progress bar when scrolled down
      setShowScrollProgress(currentScrollY > 100);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handle logout
  const handleLogout = () => {
    router.push("/login");
  };

  // Handle view profile
  const handleViewProfile = () => {
    router.push("/student/profile");
  };

  // Handle booking history
  const handleBookingHistory = () => {
    router.push("/student/bookings");
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 z-[100] origin-left"
        style={{
          scaleX,
          opacity: showScrollProgress ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.6,
        }}
        className="fixed top-0 z-30 w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 h-20 flex items-center justify-center shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with hover animation */}
            <Link href={"/"}>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/90 backdrop-filter backdrop-blur-sm text-white mr-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <TicketCheck className="h-5 w-5" />
                </motion.div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {landing_content.navigation.logo}
                </span>
              </motion.div>
            </Link>

            {/* User Menu and Theme Toggle with animations */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle with animation */}
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ModeToggle />
              </motion.div>

              {/* User Menu with animation */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-md p-0">
                      <Avatar className="h-9 w-9 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 rounded-md">
                        <AvatarImage
                          src={studentData.avatarUrl}
                          alt={studentData.name}
                          className="object-cover rounded-md"
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-md">
                          {studentData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-1 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50"
                  >
                    <motion.div
                      className="flex flex-col space-y-1 p-2"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {studentData.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {studentData.email}
                      </p>
                    </motion.div>
                    <DropdownMenuSeparator />
                    {!pathname.includes("/profile") ? (
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 py-2"
                        onClick={handleViewProfile}
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 py-2"
                        onClick={() => router.push("/events")}
                      >
                        <Ticket className="h-4 w-4" />
                        <span>All events</span>
                      </DropdownMenuItem>
                    )}
                    {!pathname.includes("/booking-history") ? (
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 py-2"
                        onClick={handleBookingHistory}
                      >
                        <History className="h-4 w-4" />
                        <span>Booking History</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2 py-2"
                        onClick={() => router.push("/events")}
                      >
                        <Ticket className="h-4 w-4" />
                        <span>All events</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2 py-2 text-red-500 dark:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
