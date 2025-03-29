import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import { hasRequiredRole, UserRole } from "@/utils/auth/roleHierarchy";
import { getRoutePermission } from "@/utils/auth/routePermissions";

interface UsePermissionsReturn {
  /**
   * Check if the current user has access to the current route
   */
  hasRouteAccess: boolean;
  
  /**
   * Check if the current user has a specific role or higher
   */
  hasRole: (requiredRole: UserRole | string) => boolean;
  
  /**
   * Get the redirect path if access is denied
   */
  redirectPath: string | null;
  
  /**
   * Current user role
   */
  userRole: UserRole | null;
  
  /**
   * Check if the current user can perform a specific action
   */
  canPerformAction: (action: string) => boolean;
}

/**
 * Custom hook for checking user permissions
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Get the user's role
  const userRole = user?.role as UserRole | null;
  
  // Get permission configuration for current route
  const routePermission = getRoutePermission(pathname);
  
  // Check if user has access to current route
  const hasRouteAccess = !!userRole && 
    !!routePermission && 
    hasRequiredRole(userRole, routePermission.requiredRole);
  
  // Get redirect path if access is denied
  const redirectPath = routePermission?.redirectTo || "/";
  
  // Function to check if user has a specific role or higher
  const hasRole = (requiredRole: UserRole | string): boolean => {
    if (!userRole) return false;
    return hasRequiredRole(userRole, requiredRole as UserRole);
  };
  
  // Action permissions map - can be expanded as needed
  const ACTION_PERMISSIONS: Record<string, UserRole> = {
    "create-event": "organizer",
    "approve-event": "admin",
    "manage-colleges": "super-admin",
    "manage-courses": "admin",
    "view-analytics": "admin",
    "manage-users": "admin",
  };
  
  // Function to check if user can perform a specific action
  const canPerformAction = (action: string): boolean => {
    if (!userRole) return false;
    const requiredRole = ACTION_PERMISSIONS[action];
    if (!requiredRole) return false;
    return hasRequiredRole(userRole, requiredRole);
  };
  
  return {
    hasRouteAccess,
    hasRole,
    redirectPath,
    userRole,
    canPerformAction,
  };
}