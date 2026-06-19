import type { ApiUser, SessionUser } from "@/lib/api/types";
import {
  resolveChurchLogo,
  resolveChurchName,
  resolveChurchSlug,
  resolveDisplayName,
} from "@/lib/auth/display-identity";
import { resolveCanonicalRoleLabel } from "@/lib/auth/session-identity";
import {
  LEADERSHIP_ACCESS_PERMISSION,
  getUserRoles,
  normalizeRole,
  resolvePrimaryRole,
} from "@/lib/auth/leadership-access";
import { getDefaultChurchSlug } from "@/lib/api/config";
import { mockUser } from "@/lib/mock-user";

function extractApiRoles(user: ApiUser): string[] {
  const rawRoles = [...(user.roles ?? [])];
  if (user.role?.trim()) {
    rawRoles.push(user.role);
  }
  return [...new Set(rawRoles.map(normalizeRole))];
}

function normalizePermissions(permissions: string[] | undefined): string[] {
  if (!permissions?.length) {
    return [];
  }

  return [...new Set(
    permissions
      .map((permission) => permission.trim())
      .filter(Boolean)
      .map((permission) =>
        permission.toLowerCase() === LEADERSHIP_ACCESS_PERMISSION
          ? LEADERSHIP_ACCESS_PERMISSION
          : permission,
      ),
  )];
}

export function mapApiUserToSession(user: ApiUser): SessionUser {
  const roles = extractApiRoles(user);
  const role = resolvePrimaryRole(roles.length > 0 ? roles : ["member"]);
  const permissions = normalizePermissions(user.permissions);
  const sessionRoles = getUserRoles({ role, roles, permissions });
  const churchName = resolveChurchName({ church: user.church, churchName: user.churchName });
  const churchLogo = resolveChurchLogo({ church: user.church, churchLogo: user.churchLogo });
  const churchSlug = resolveChurchSlug({ church: user.church, churchSlug: user.churchSlug });

  return {
    id: user.id?.trim() || "",
    email: user.email?.trim() || "",
    name: resolveDisplayName({
      name: user.name,
      fullName: user.fullName,
      email: user.email,
    }),
    role,
    roles: sessionRoles,
    roleLabel: resolveCanonicalRoleLabel({ role, roles: sessionRoles, permissions }),
    churchName,
    churchLogo,
    churchSlug,
    permissions,
  };
}

export function getEmptySessionUser(): SessionUser {
  return {
    id: "",
    name: "Member",
    email: "",
    role: "member",
    roles: ["member"],
    roleLabel: "Member",
    churchName: "",
    churchLogo: "",
    churchSlug: "",
    permissions: [],
  };
}

export function getDemoSessionUser(): SessionUser {
  const role = normalizeRole(mockUser.role);
  const roles = [role];
  const permissions = [...mockUser.permissions];
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: "",
    role,
    roles,
    roleLabel: resolveCanonicalRoleLabel({ role, roles, permissions }),
    churchName: mockUser.churchName,
    churchLogo: mockUser.churchLogo,
    churchSlug: mockUser.churchSlug || getDefaultChurchSlug(),
    permissions,
  };
}
