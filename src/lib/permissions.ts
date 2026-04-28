import { mockUser, type Permission } from "@/lib/mock-user";

export function hasPermission(permission: Permission) {
  return mockUser.permissions.includes(permission);
}

export function hasAnyPermission(permissions: readonly Permission[]) {
  return permissions.some((permission) => mockUser.permissions.includes(permission));
}
