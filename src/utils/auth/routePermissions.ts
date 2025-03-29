import { UserRole } from "./roleHierarchy";

/**
 * Interface for route permission configuration
 */
export interface RoutePermission {
  path: string;
  requiredRole: UserRole;
  redirectTo?: string;
  exact?: boolean;
}

/**
 * Route permission matrix defining access control for different routes
 */
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Super Admin routes
  {
    path: "/super-admin/dashboard/help-requests",
    requiredRole: "super-admin",
    redirectTo: "/super-admin/auth/login",
  },
  {
    path: "/super-admin/dashboard/overview",
    requiredRole: "super-admin",
    redirectTo: "/super-admin/auth/login",
  },
  {
    path: "/super-admin/dashboard/manage-colleges",
    requiredRole: "super-admin",
    redirectTo: "/super-admin/auth/login",
  },

  // Admin routes
  {
    path: "/admin/dashboard/organizers",
    requiredRole: "admin",
    redirectTo: "/admin/auth/login",
  },
  {
    path: "/admin/dashboard/students",
    requiredRole: "admin",
    redirectTo: "/admin/auth/login",
  },
  {
    path: "/admin/dashboard/overview",
    requiredRole: "admin",
    redirectTo: "/admin/auth/login",
  },
  {
    path: "/admin/dashboard/courses",
    requiredRole: "admin",
    redirectTo: "/admin/auth/login",
  },
  {
    path: "/admin/dashboard/event-requests",
    requiredRole: "admin",
    redirectTo: "/admin/auth/login",
  },

  // Organizer routes
  {
    path: "/organizer/dashboard/metrics",
    requiredRole: "organizer",
    redirectTo: "/organizer/auth/login",
  },
  {
    path: "/organizer/dashboard/events",
    requiredRole: "organizer",
    redirectTo: "/organizer/auth/login",
  },
  {
    path: "/organizer/dashboard/events/request-event",
    requiredRole: "organizer",
    redirectTo: "/organizer/auth/login",
  },
  {
    path: "/organizer/dashboard/events/edit",
    requiredRole: "organizer",
    redirectTo: "/organizer/auth/login",
  },

  // Profile routes - accessible by any authenticated user
  {
    path: "/profile",
    requiredRole: "student",
    redirectTo: "/login",
  },
];

/**
 * Get the permission configuration for a specific route
 * @param path The current route path
 * @returns The matching route permission or undefined if not found
 */
export function getRoutePermission(path: string): RoutePermission | undefined {
  // First try exact match
  const exactMatch = ROUTE_PERMISSIONS.find(
    (route) => route.exact && route.path === path
  );

  if (exactMatch) return exactMatch;

  // Then try prefix match (for nested routes)
  return ROUTE_PERMISSIONS.find(
    (route) => !route.exact && path.startsWith(route.path)
  );
}
