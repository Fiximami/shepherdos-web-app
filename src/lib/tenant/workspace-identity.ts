import { getProductName } from "@/lib/config/product";

export const PLATFORM_LOGO_PATH = "/images/branding/shepherdos-logo.png";

export function getPlatformName(): string {
  return getProductName();
}

export function getPlatformLogoUrl(): string {
  return PLATFORM_LOGO_PATH;
}

export function resolveTenantDisplayName(churchName?: string | null): string {
  const trimmed = churchName?.trim();
  return trimmed || getPlatformName();
}

export function resolveTenantLogoUrl(churchLogo?: string | null): string {
  const trimmed = churchLogo?.trim();
  return trimmed || getPlatformLogoUrl();
}

export function formatWorkspaceName(churchName?: string | null): string {
  const tenant = resolveTenantDisplayName(churchName);
  return `${tenant} Workspace`;
}

export function formatPageWorkspaceLabel(pageTitle: string, churchName?: string | null): string {
  return `${pageTitle} · ${formatWorkspaceName(churchName)}`;
}

export function formatMemberWorkspaceLabel(churchName?: string | null): string {
  const tenant = resolveTenantDisplayName(churchName);
  return `${tenant} member`;
}

export function formatWelcomeDescription(churchName?: string | null): string {
  const tenant = resolveTenantDisplayName(churchName);
  if (churchName?.trim()) {
    return `${tenant} · Your member dashboard keeps church life close and clear with upcoming moments, care updates, and community highlights in one calm place.`;
  }
  return "Your member dashboard keeps church life close and clear with upcoming moments, care updates, and community highlights in one calm place.";
}

export function formatLeadershipContextLine(options: {
  churchName?: string | null;
  displayName: string;
}): string {
  const prefix = options.churchName?.trim() ? `${options.churchName.trim()} · ` : "";
  return `${prefix}${options.displayName} · Structured oversight for people, stewardship, communication, and mission momentum.`;
}
