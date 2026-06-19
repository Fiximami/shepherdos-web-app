import type { ApiUser } from "@/lib/api/types";
import { normalizeRole } from "@/lib/auth/leadership-access";

export const roleLabels: Record<string, string> = {
  member: "Member",
  super_admin: "Super Admin",
  pastor: "Pastor",
  finance: "Finance Officer",
  finance_officer: "Finance Officer",
  admin: "Church Admin",
  church_admin: "Church Admin",
  owner: "Church Owner",
  church_owner: "Church Owner",
  leader: "Leader",
  ministry_leader: "Ministry Leader",
  elder: "Elder",
};

export function resolveDisplayName(options: {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  fallback?: string;
}): string {
  const name = options.name?.trim();
  if (name) return name;

  const fullName = options.fullName?.trim();
  if (fullName) return fullName;

  const email = options.email?.trim();
  if (email?.includes("@")) {
    const localPart = email.split("@")[0]?.trim();
    if (localPart) return localPart;
  }

  return options.fallback ?? "Member";
}

export function resolveFirstName(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0];
  return first || "";
}

export function resolveRoleLabel(role?: string | null, roleLabel?: string | null): string {
  const label = roleLabel?.trim();
  if (label) return label;

  const normalizedRole = normalizeRole(role);
  if (roleLabels[normalizedRole]) {
    return roleLabels[normalizedRole];
  }

  return "Member";
}

export function resolveChurchName(options: {
  churchName?: string | null;
  church?: ApiUser["church"];
}): string {
  return options.church?.name?.trim() || options.churchName?.trim() || "";
}

export function resolveChurchLogo(options: {
  churchLogo?: string | null;
  church?: ApiUser["church"];
}): string {
  return options.church?.logoUrl?.trim() || options.church?.logo?.trim() || options.churchLogo?.trim() || "";
}

export function resolveChurchSlug(options: {
  churchSlug?: string | null;
  church?: ApiUser["church"];
}): string {
  return options.church?.slug?.trim() || options.churchSlug?.trim() || "";
}
