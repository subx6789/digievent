"use client";

import Link from "next/link";
import { TicketCheck } from "lucide-react";
import { landing_content } from "@/utils/data/landing_content";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading/Loading";
import { cn } from "@/lib/utils";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} className="relative group">
      <span className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 inline-block relative">
        {children}
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </span>
    </Link>
  );
};

const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use a shorter timeout to avoid perception of delay
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full bg-white dark:bg-gray-950 flex items-center justify-center py-8">
        <div className="animate-pulse">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex items-center group",
              "relative",
              "transition-transform hover:scale-105"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center",
                "rounded-lg bg-blue-600 text-white mr-2",
                "transition-all duration-500",
                "hover:shadow-md hover:shadow-blue-500/20",
                "group-hover:rotate-[360deg]"
              )}
            >
              <TicketCheck className="h-5 w-5" />
            </div>
            <span
              className={cn("text-lg font-bold text-gray-800 dark:text-white")}
            >
              {landing_content.navigation.logo}
            </span>
          </Link>

          {/* Copyright text */}
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center order-3 md:order-2">
            {landing_content.footer.copyright}
          </p>

          {/* Links */}
          <div className="flex space-x-6 order-2 md:order-3">
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/cookies">Cookies</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
