import type { ApiUser, SessionUser } from "@/lib/api/types";
import {
  resolveChurchLogo,
  resolveChurchName,
  resolveDisplayName,
  resolveRoleLabel,
} from "@/lib/auth/display-identity";
import {
  LEADERSHIP_ACCESS_PERMISSION,
  getUserRoles,
  normalizeRole,
  resolvePrimaryRole,
} from "@/lib/auth/leadership-access";
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
  const churchName = resolveChurchName({ church: user.church, churchName: user.churchName });
  const churchLogo = resolveChurchLogo({ church: user.church, churchLogo: user.churchLogo });

  return {
    id: user.id?.trim() || "",
    email: user.email?.trim() || "",
    name: resolveDisplayName({
      name: user.name,
      fullName: user.fullName,
      email: user.email,
    }),
    role,
    roles: getUserRoles({ role, roles, permissions: [] }),
    roleLabel: resolveRoleLabel(role, user.roleLabel),
    churchName,
    churchLogo,
    permissions: normalizePermissions(user.permissions),
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
    permissions: [],
  };
}

export function getDemoSessionUser(): SessionUser {
  const role = normalizeRole(mockUser.role);
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: "",
    role,
    roles: [role],
    roleLabel: mockUser.roleLabel,
    churchName: mockUser.churchName,
    churchLogo: mockUser.churchLogo,
    permissions: [...mockUser.permissions],
  };
}
