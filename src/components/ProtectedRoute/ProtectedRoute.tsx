/* eslint-disable react-hooks/exhaustive-deps */
// src/components/ProtectedRoute.tsx
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

  useEffect(() => {
    if (isInitialized && (!user || user.role !== requiredRole)) {
      router.replace("/");
    }
  }, [user, isInitialized, requiredRole]);

  if (!isInitialized || !user) return null;

  return <>{children}</>;
}
