import type { Permission } from "@/lib/mock-user";

export const LEADERSHIP_ACCESS_PERMISSION = "leadership.access" as const;

const LEADERSHIP_ROLES = new Set([
  "super_admin",
  "admin",
  "church_admin",
  "church_owner",
  "owner",
  "pastor",
  "elder",
  "finance_officer",
  "finance",
  "leader",
  "ministry_leader",
]);

export function normalizeRole(role: string | undefined | null): string {
  return (role?.trim() || "member").toLowerCase().replace(/\s+/g, "_");
}

export function isLeadershipRole(role: string | undefined | null): boolean {
  return LEADERSHIP_ROLES.has(normalizeRole(role));
}

export function hasLeadershipAccessPermission(permissions: readonly string[]): boolean {
  return permissions.includes(LEADERSHIP_ACCESS_PERMISSION);
}

export function canAccessLeadershipConsole(user: {
  role: string;
  permissions: readonly Permission[] | readonly string[];
}): boolean {
  if (hasLeadershipAccessPermission(user.permissions)) {
    return true;
  }

  return isLeadershipRole(user.role);
}
