import {
  canAccessLeadershipConsole,
  getUserRoles,
  hasLeadershipAccessPermission,
  isSuperAdmin,
  normalizeRole,
  type LeadershipUser,
} from "@/lib/auth/leadership-access";

const ADMIN_CORE_PATHS = [
  "/admin",
  "/admin/members",
  "/admin/attendance",
  "/admin/giving",
  "/admin/events",
  "/admin/communication",
  "/admin/prayer-requests",
  "/admin/counselling",
  "/admin/follow-ups",
  "/admin/settings",
  "/admin/notifications",
] as const;

const FINANCE_OFFICER_PATHS = [
  "/admin",
  "/admin/finance",
  "/admin/giving",
  "/admin/reports",
] as const;

const LEADER_PATHS = [
  "/admin",
  "/admin/attendance",
  "/admin/members",
  "/admin/events",
  "/admin/follow-ups",
] as const;

const ADMIN_ROLE_KEYS = new Set(["admin", "church_admin", "pastor", "church_owner", "owner"]);
const FINANCE_ROLE_KEYS = new Set(["finance_officer", "finance"]);
const LEADER_ROLE_KEYS = new Set(["leader", "ministry_leader", "elder"]);

function matchesAdminPath(path: string, allowedPath: string): boolean {
  return path === allowedPath || path.startsWith(`${allowedPath}/`);
}

function matchesAnyAdminPath(path: string, allowedPaths: readonly string[]): boolean {
  return allowedPaths.some((allowedPath) => matchesAdminPath(path, allowedPath));
}

function hasAnyRole(roles: readonly string[], candidates: ReadonlySet<string>): boolean {
  return roles.some((role) => candidates.has(normalizeRole(role)));
}

function hasFinancePermission(user: LeadershipUser): boolean {
  return user.permissions.some((permission) => {
    const normalized = permission.toLowerCase();
    return (
      normalized === "finance:record" ||
      normalized === "finance:approve" ||
      normalized === "finance:report"
    );
  });
}

function hasMembersPermission(user: LeadershipUser): boolean {
  return user.permissions.some((permission) => {
    const normalized = permission.toLowerCase();
    return normalized === "members:create" || normalized === "members:update";
  });
}

function hasCommunicationPermission(user: LeadershipUser): boolean {
  return user.permissions.some((permission) => {
    const normalized = permission.toLowerCase();
    return normalized === "announcements:create" || normalized === "messages:send";
  });
}

function hasCounsellingPermission(user: LeadershipUser): boolean {
  return user.permissions.some((permission) => {
    const normalized = permission.toLowerCase();
    return normalized === "counselling:view" || normalized === "counselling:manage";
  });
}

function hasFollowUpPermission(user: LeadershipUser): boolean {
  return user.permissions.some((permission) => permission.toLowerCase() === "followups:assign");
}

function hasPermissionPathAccess(user: LeadershipUser, path: string): boolean {
  if (path.startsWith("/admin/finance") && hasFinancePermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/members") && hasMembersPermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/communication") && hasCommunicationPermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/counselling") && hasCounsellingPermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/follow-ups") && hasFollowUpPermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/reports") && hasFinancePermission(user)) {
    return true;
  }
  if (path.startsWith("/admin/giving") && (hasFinancePermission(user) || hasLeadershipAccessPermission(user.permissions))) {
    return true;
  }
  return false;
}

export function canAccessAdminPath(user: LeadershipUser, path: string): boolean {
  if (!canAccessLeadershipConsole(user)) {
    return false;
  }

  if (isSuperAdmin(user)) {
    return true;
  }

  const roles = getUserRoles(user);
  let allowed = false;

  if (hasAnyRole(roles, ADMIN_ROLE_KEYS)) {
    allowed = matchesAnyAdminPath(path, ADMIN_CORE_PATHS);
  }

  if (hasAnyRole(roles, FINANCE_ROLE_KEYS)) {
    allowed = allowed || matchesAnyAdminPath(path, FINANCE_OFFICER_PATHS);
  }

  if (hasAnyRole(roles, LEADER_ROLE_KEYS)) {
    allowed = allowed || matchesAnyAdminPath(path, LEADER_PATHS);
  }

  return allowed || hasPermissionPathAccess(user, path);
}

export const adminModuleAccessRules = {
  superAdmin: "all admin modules",
  admin: ADMIN_CORE_PATHS,
  financeOfficer: FINANCE_OFFICER_PATHS,
  leader: LEADER_PATHS,
} as const;
