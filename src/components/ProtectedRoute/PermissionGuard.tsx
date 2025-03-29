"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/utils/auth/roleHierarchy";
import { ReactNode } from "react";

interface PermissionGuardProps {
  /**
   * The content to render if the user has permission
   */
  children: ReactNode;

  /**
   * The minimum role required to view the content
   */
  requiredRole?: UserRole | string;

  /**
   * A specific action permission to check
   */
  requiredAction?: string;

  /**
   * Content to show if permission is denied (optional)
   */
  fallback?: ReactNode;
}

/**
 * Component for conditionally rendering UI elements based on user permissions
 */
export default function PermissionGuard({
  children,
  requiredRole,
  requiredAction,
  fallback = null,
}: PermissionGuardProps) {
  const { hasRole, canPerformAction } = usePermissions();

  // Check if user has required permissions
  const hasPermission =
    (requiredRole ? hasRole(requiredRole) : true) &&
    (requiredAction ? canPerformAction(requiredAction) : true);

  // Render children if user has permission, otherwise render fallback
  return <>{hasPermission ? children : fallback}</>;
}
