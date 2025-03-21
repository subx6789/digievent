"use client";

import { AdminLoginForm } from "@/components/Forms/AdminLoginForm";
import { TicketCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

const AdminLogin = () => {
  useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white dark:bg-gray-950">
      <div className="flex flex-col gap-4 p-6 md:p-10 text-gray-900 dark:text-gray-100">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
              <TicketCheck className="size-4" />
            </div>
            Digievent
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AdminLoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted dark:bg-gray-800 lg:block">
        <Image
          src="/Placeholder/event-placeholder.jpg"
          width={1920}
          height={1080}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover opacity-90 dark:opacity-70"
        />
      </div>
    </div>
  );
};

export default AdminLogin;
