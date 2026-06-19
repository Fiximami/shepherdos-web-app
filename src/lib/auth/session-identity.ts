import type { SessionUser } from "@/lib/api/types";
import {
  resolveDisplayName,
  resolveFirstName,
} from "@/lib/auth/display-identity";
import { getUserRoles, normalizeRole } from "@/lib/auth/leadership-access";
import { resolveTenantLogoUrl } from "@/lib/tenant/workspace-identity";

export type PublicRoleCode = "SUPER_ADMIN" | "ADMIN" | "LEADER" | "MEMBER";

const ADMIN_ROLE_KEYS = new Set([
  "admin",
  "church_admin",
  "church_owner",
  "owner",
  "pastor",
  "finance_officer",
  "finance",
]);

const LEADER_ROLE_KEYS = new Set(["leader", "ministry_leader", "elder"]);

const PUBLIC_ROLE_LABELS: Record<PublicRoleCode, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  LEADER: "Leader",
  MEMBER: "Member",
};

export type SessionIdentity = {
  displayName: string;
  firstName: string;
  email: string;
  role: string;
  roles: string[];
  publicRoleCode: PublicRoleCode;
  roleLabel: string;
  churchName: string;
  churchSlug: string;
  churchLogo: string;
  permissions: string[];
};

export function resolvePublicRoleCode(user: Pick<SessionUser, "role" | "roles" | "permissions">): PublicRoleCode {
  const roles = getUserRoles(user);

  if (roles.includes("super_admin")) {
    return "SUPER_ADMIN";
  }

  if (roles.some((role) => ADMIN_ROLE_KEYS.has(normalizeRole(role)))) {
    return "ADMIN";
  }

  if (roles.some((role) => LEADER_ROLE_KEYS.has(normalizeRole(role)))) {
    return "LEADER";
  }

  return "MEMBER";
}

export function resolveCanonicalRoleLabel(user: Pick<SessionUser, "role" | "roles" | "permissions">): string {
  return PUBLIC_ROLE_LABELS[resolvePublicRoleCode(user)];
}

export function deriveSessionIdentity(user: SessionUser): SessionIdentity {
  const roles = getUserRoles(user);

  return {
    displayName: resolveDisplayName({
      name: user.name,
      fullName: user.name,
      email: user.email,
    }),
    firstName: resolveFirstName(
      resolveDisplayName({
        name: user.name,
        fullName: user.name,
        email: user.email,
      }),
    ),
    email: user.email,
    role: user.role,
    roles,
    publicRoleCode: resolvePublicRoleCode(user),
    roleLabel: resolveCanonicalRoleLabel(user),
    churchName: user.churchName,
    churchSlug: user.churchSlug,
    churchLogo: resolveTenantLogoUrl(user.churchLogo),
    permissions: user.permissions,
  };
}
