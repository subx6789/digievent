/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requiredRole = "admin",
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  // Map roles to their respective login routes
  const loginRoutes: { [key: string]: string } = {
    admin: "/admin/auth/login",
    "super-admin": "/super-admin/auth/login",
    organizer: "/organizer/auth/login",
  };

  useEffect(() => {
    if (isInitialized && (!user || user.role !== requiredRole)) {
      const redirectTo = loginRoutes[requiredRole] || "/";
      router.replace(redirectTo);
    }
  }, [user, isInitialized, requiredRole, router]);

  // While auth is being initialized or if user is missing, don't render children
  if (!isInitialized || !user) return null;

  return <>{children}</>;
}
