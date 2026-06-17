import { getDemoSessionUser } from "@/lib/auth/map-user";
import { canAccessAdminPath } from "@/lib/auth/admin-module-access";
import { canAccessLeadershipConsole } from "@/lib/auth/leadership-access";
import { getSessionUser } from "@/lib/auth/session-store";
import { mockUser, type Permission } from "@/lib/mock-user";
import { isDemoModeEnabled } from "@/lib/api/token-storage";

function getActivePermissions(): string[] {
  const sessionUser = getSessionUser();
  if (sessionUser) return sessionUser.permissions;
  if (isDemoModeEnabled()) return [...mockUser.permissions];
  return [];
}

function getActiveSessionUser() {
  const sessionUser = getSessionUser();
  if (sessionUser) return sessionUser;
  if (isDemoModeEnabled()) return getDemoSessionUser();
  return null;
}

export function hasPermission(permission: Permission) {
  return getActivePermissions().includes(permission);
}

export function hasAnyPermission(permissions: readonly Permission[]) {
  const active = getActivePermissions();
  return permissions.some((permission) => active.includes(permission));
}

export function canAccessLeadershipConsoleFromSession(): boolean {
  const sessionUser = getActiveSessionUser();
  if (!sessionUser) return false;
  return canAccessLeadershipConsole(sessionUser);
}

export function canAccessAdminPathFromSession(path: string): boolean {
  const sessionUser = getActiveSessionUser();
  if (!sessionUser) return false;
  return canAccessAdminPath(sessionUser, path);
}
