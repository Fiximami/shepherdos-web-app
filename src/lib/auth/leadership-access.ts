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

const ROLE_ALIASES: Record<string, string> = {
  superadmin: "super_admin",
  super: "super_admin",
  churchadmin: "church_admin",
  churchowner: "church_owner",
  financeofficer: "finance_officer",
  finance_officer: "finance_officer",
  ministryleader: "ministry_leader",
};

const PRIMARY_ROLE_PRIORITY = [
  "super_admin",
  "admin",
  "church_admin",
  "church_owner",
  "owner",
  "pastor",
  "finance_officer",
  "finance",
  "elder",
  "leader",
  "ministry_leader",
  "member",
] as const;

export type LeadershipUser = {
  role: string;
  roles?: readonly string[];
  permissions: readonly Permission[] | readonly string[];
};

export function normalizeRole(role: string | undefined | null): string {
  const raw = (role?.trim() || "member").toLowerCase().replace(/[\s-]+/g, "_");
  return ROLE_ALIASES[raw] ?? raw;
}

export function getUserRoles(user: LeadershipUser): string[] {
  const combined = new Set<string>();

  if (user.role) {
    combined.add(normalizeRole(user.role));
  }

  for (const role of user.roles ?? []) {
    if (role?.trim()) {
      combined.add(normalizeRole(role));
    }
  }

  if (combined.size === 0) {
    combined.add("member");
  }

  return [...combined];
}

export function resolvePrimaryRole(roles: readonly string[]): string {
  const normalized = roles.map(normalizeRole);
  for (const priority of PRIMARY_ROLE_PRIORITY) {
    if (normalized.includes(priority)) {
      return priority;
    }
  }
  return normalized[0] ?? "member";
}

export function isLeadershipRole(role: string | undefined | null): boolean {
  return LEADERSHIP_ROLES.has(normalizeRole(role));
}

export function isSuperAdmin(user: LeadershipUser): boolean {
  return getUserRoles(user).includes("super_admin");
}

export function isMemberOnly(user: LeadershipUser): boolean {
  const roles = getUserRoles(user);
  return roles.every((role) => role === "member");
}

export function hasLeadershipAccessPermission(permissions: readonly string[]): boolean {
  return permissions.some(
    (permission) => permission.trim().toLowerCase() === LEADERSHIP_ACCESS_PERMISSION,
  );
}

export function canAccessLeadershipConsole(user: LeadershipUser): boolean {
  if (hasLeadershipAccessPermission(user.permissions)) {
    return true;
  }

  const roles = getUserRoles(user);
  if (roles.every((role) => role === "member")) {
    return false;
  }

  return roles.some((role) => isLeadershipRole(role));
}
