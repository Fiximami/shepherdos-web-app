import type { ApiUser, SessionUser } from "@/lib/api/types";
import {
  resolveChurchLogo,
  resolveChurchName,
  resolveDisplayName,
  resolveRoleLabel,
} from "@/lib/auth/display-identity";
import { availablePermissions, mockUser, type Permission } from "@/lib/mock-user";

function isPermission(value: string): value is Permission {
  return (availablePermissions as readonly string[]).includes(value);
}

function normalizePermissions(permissions: string[] | undefined): Permission[] {
  if (!permissions?.length) {
    return [];
  }

  return permissions.filter(isPermission);
}

export function mapApiUserToSession(user: ApiUser): SessionUser {
  const role = user.role?.trim() || "member";
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
    roleLabel: "Member",
    churchName: "",
    churchLogo: "",
    permissions: [],
  };
}

export function getDemoSessionUser(): SessionUser {
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: "",
    role: mockUser.role,
    roleLabel: mockUser.roleLabel,
    churchName: mockUser.churchName,
    churchLogo: mockUser.churchLogo,
    permissions: [...mockUser.permissions],
  };
}
