/**
 * Role hierarchy system for the application
 * Higher number means higher privileges
 */
export const ROLE_LEVELS = {
  user: 1,
  student: 1,
  organizer: 2,
  admin: 3,
  "super-admin": 4,
};

export type UserRole = keyof typeof ROLE_LEVELS;

/**
 * Check if a user has sufficient role level to access a resource
 * @param userRole The role of the current user
 * @param requiredRole The minimum role required for access
 * @returns boolean indicating if the user has sufficient privileges
 */
export function hasRequiredRole(
  userRole: UserRole | string,
  requiredRole: UserRole | string
): boolean {
  // If roles don't exist in our hierarchy, deny access
  if (
    !(userRole in ROLE_LEVELS) ||
    !(requiredRole in ROLE_LEVELS)
  ) {
    return false;
  }

  // Compare role levels
  return ROLE_LEVELS[userRole as UserRole] >= ROLE_LEVELS[requiredRole as UserRole];
}