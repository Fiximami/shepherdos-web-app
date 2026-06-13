import type { ApiUser, SessionUser } from "@/lib/api/types";
import { availablePermissions, mockUser, type Permission } from "@/lib/mock-user";

const roleLabels: Record<string, string> = {
  member: "Member",
  pastor: "Pastor",
  finance: "Finance Officer",
  finance_officer: "Finance Officer",
  admin: "Church Admin",
  church_admin: "Church Admin",
  owner: "Church Owner",
  church_owner: "Church Owner",
  leader: "Leader",
  ministry_leader: "Ministry Leader",
};

function isPermission(value: string): value is Permission {
  return (availablePermissions as readonly string[]).includes(value);
}

function normalizePermissions(permissions: string[] | undefined): Permission[] {
  if (!permissions?.length) {
    return mockUser.permissions;
  }

  const normalized = permissions.filter(isPermission);
  return normalized.length > 0 ? normalized : mockUser.permissions;
}

export function mapApiUserToSession(user: ApiUser): SessionUser {
  const role = user.role ?? mockUser.role;
  const churchName = user.church?.name ?? user.churchName ?? mockUser.churchName;
  const churchLogo = user.church?.logoUrl ?? user.church?.logo ?? user.churchLogo ?? mockUser.churchLogo;

  return {
    id: user.id ?? mockUser.id,
    email: user.email ?? "",
    name: user.name ?? user.fullName ?? mockUser.name,
    role,
    roleLabel: user.roleLabel ?? roleLabels[role] ?? "Team Member",
    churchName,
    churchLogo,
    permissions: normalizePermissions(user.permissions),
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
