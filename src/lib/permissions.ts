import { getSessionUser } from "@/lib/auth/session-store";
import { mockUser, type Permission } from "@/lib/mock-user";

function getActivePermissions(): Permission[] {
  return getSessionUser()?.permissions ?? mockUser.permissions;
}

export function hasPermission(permission: Permission) {
  return getActivePermissions().includes(permission);
}

export function hasAnyPermission(permissions: readonly Permission[]) {
  const active = getActivePermissions();
  return permissions.some((permission) => active.includes(permission));
}
