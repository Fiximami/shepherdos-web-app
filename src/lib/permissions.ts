import { getDemoSessionUser } from "@/lib/auth/map-user";
import { canAccessLeadershipConsole } from "@/lib/auth/leadership-access";
import { getSessionUser } from "@/lib/auth/session-store";
import { mockUser, type Permission } from "@/lib/mock-user";
import { isDemoModeEnabled } from "@/lib/api/token-storage";

function getActivePermissions(): Permission[] {
  const sessionUser = getSessionUser();
  if (sessionUser) return sessionUser.permissions;
  if (isDemoModeEnabled()) return mockUser.permissions;
  return [];
}

export function hasPermission(permission: Permission) {
  return getActivePermissions().includes(permission);
}

export function hasAnyPermission(permissions: readonly Permission[]) {
  const active = getActivePermissions();
  return permissions.some((permission) => active.includes(permission));
}

export function canAccessLeadershipConsoleFromSession(): boolean {
  const sessionUser = getSessionUser();
  if (sessionUser) {
    return canAccessLeadershipConsole(sessionUser);
  }
  if (isDemoModeEnabled()) {
    return canAccessLeadershipConsole(getDemoSessionUser());
  }
  return false;
}
