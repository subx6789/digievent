/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/utils/auth/roleHierarchy";
import Loading from "@/components/Loading/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole = "user",
  fallback = <Loading />,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const { hasRole } = usePermissions();
  
  // Determine where to redirect if access is denied
  const determineRedirectPath = (): string => {
    // If a specific redirect is provided, use it
    if (redirectTo) return redirectTo;
    
    // Otherwise use role-based login routes
    const loginRoutes: Record<string, string> = {
      "super-admin": "/super-admin/auth/login",
      admin: "/admin/auth/login",
      organizer: "/organizer/auth/login",
      user: "/",
      student: "/",
    };
    
    return loginRoutes[requiredRole as string] || "/";
  };

  useEffect(() => {
    if (isInitialized) {
      // If user is not authenticated or doesn't have required role
      if (!user || !hasRole(requiredRole)) {
        const redirectPath = determineRedirectPath();
        router.replace(redirectPath);
      }
    }
  }, [user, isInitialized, requiredRole, router, hasRole]);

  // While auth is being initialized or if user is missing, show fallback
  if (!isInitialized || !user || !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
