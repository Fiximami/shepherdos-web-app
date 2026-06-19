import { asRecord } from "@/lib/api/normalize";
import type { ApiUser } from "@/lib/api/types";
import { LEADERSHIP_ACCESS_PERMISSION } from "@/lib/auth/leadership-access";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }

  if (!isPlainObject(value)) {
    return [];
  }

  return collectStrings(
    value.role ??
      value.name ??
      value.slug ??
      value.code ??
      value.type ??
      value.value ??
      value.key ??
      value.permission ??
      value.permissionKey,
  );
}

function collectPermissions(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) {
    return collectStrings(value);
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return [item.trim()].filter(Boolean);
    }
    if (isPlainObject(item)) {
      const permission = String(
        item.key ?? item.permission ?? item.slug ?? item.name ?? item.code ?? "",
      ).trim();
      return permission ? [permission] : [];
    }
    return [];
  });
}

function normalizePermissionKey(permission: string): string {
  return permission.toLowerCase() === LEADERSHIP_ACCESS_PERMISSION
    ? LEADERSHIP_ACCESS_PERMISSION
    : permission;
}

function resolveUserRecord(response: unknown): Record<string, unknown> {
  const record = asRecord(response);

  const candidates = [
    record,
    record.user,
    record.data,
    asRecord(record.data).user,
    asRecord(record.data).profile,
    asRecord(record.data).account,
    asRecord(record.result).user,
    asRecord(record.result).data,
  ];

  for (const candidate of candidates) {
    if (!isPlainObject(candidate)) continue;
    if (
      candidate.id ||
      candidate.email ||
      candidate.role ||
      candidate.roles ||
      candidate.permissions ||
      candidate.tenantRoles ||
      candidate.tenantRole
    ) {
      return candidate;
    }
  }

  return record;
}

export function unwrapApiUserResponse(response: unknown): ApiUser {
  const raw = resolveUserRecord(response);

  const roleStrings = [
    ...collectStrings(raw.roles),
    ...collectStrings(raw.tenantRoles),
    ...collectStrings(raw.tenantRole),
    ...collectStrings(raw.userRoles),
    ...collectStrings(raw.authorities),
    ...collectStrings(raw.role),
  ];

  const uniqueRoles = [...new Set(roleStrings)];
  const permissions = [
    ...new Set(
      collectPermissions(raw.permissions ?? raw.permissionKeys ?? raw.scopes ?? raw.grants).map(
        normalizePermissionKey,
      ),
    ),
  ];

  const church = isPlainObject(raw.church)
    ? raw.church
    : isPlainObject(raw.tenant)
      ? raw.tenant
      : undefined;

  return {
    id: String(raw.id ?? raw.userId ?? raw.sub ?? ""),
    email: String(raw.email ?? ""),
    name: String(raw.name ?? raw.displayName ?? ""),
    fullName: String(raw.fullName ?? raw.name ?? raw.displayName ?? ""),
    role: uniqueRoles[0] ?? (typeof raw.role === "string" ? raw.role : undefined),
    roles: uniqueRoles,
    roleLabel: typeof raw.roleLabel === "string" ? raw.roleLabel : undefined,
    permissions,
    church: church as ApiUser["church"],
    churchName: String(raw.churchName ?? asRecord(church).name ?? ""),
    churchLogo: String(
      raw.churchLogo ?? asRecord(church).logoUrl ?? asRecord(church).logo ?? "",
    ),
  };
}
