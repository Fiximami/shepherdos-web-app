import { routes } from "@/lib/constants/navigation";
import { isAlphaDeployment, isPasswordResetEnabled, showPreviewRoutes } from "@/lib/config/product";

export type RouteBadge = "Beta" | "Preview";

export type AlphaRouteScope = "member" | "admin" | "auth";

const memberAlphaPaths = new Set<string>([
  routes.app.dashboard,
  routes.app.profile,
  routes.app.attendance,
  routes.app.giving,
  routes.app.settings,
]);

const memberBetaPaths = new Set<string>([
  routes.app.dashboard,
  routes.app.profile,
  routes.app.settings,
]);

const adminAlphaPaths = new Set<string>([
  "/admin",
  "/admin/members",
  "/admin/attendance",
  "/admin/finance",
  "/admin/giving",
  "/admin/settings",
]);

const adminBetaPaths = new Set<string>([
  "/admin",
  "/admin/attendance",
  "/admin/finance",
  "/admin/giving",
  "/admin/settings",
]);

const hiddenMemberPaths = new Set<string>([
  routes.app.finance,
  routes.app.feed,
  routes.app.events,
  routes.app.prayerRequests,
  routes.app.counselling,
  routes.app.store,
  routes.app.celebrations,
  routes.app.notifications,
  routes.app.messages,
  routes.app.members,
  routes.app.communication,
  routes.app.analytics,
  routes.app.engagement,
]);

const hiddenAdminPaths = new Set<string>([
  "/admin/departments",
  "/admin/communication",
  "/admin/events",
  "/admin/community",
  "/admin/prayer-requests",
  "/admin/counselling",
  "/admin/follow-ups",
  "/admin/inventory",
  "/admin/celebrations",
  "/admin/notifications",
  "/admin/messages",
  "/admin/analytics",
  "/admin/reports",
]);

export function isPathAvailable(pathname: string, scope: AlphaRouteScope): boolean {
  if (!isAlphaDeployment() || showPreviewRoutes()) {
    return true;
  }

  if (scope === "auth") {
    if (pathname === routes.auth.forgotPassword || pathname === routes.auth.resetPassword) {
      return isPasswordResetEnabled();
    }
    return true;
  }

  if (scope === "member") {
    return memberAlphaPaths.has(pathname);
  }

  return adminAlphaPaths.has(pathname);
}

export function getRouteBadge(pathname: string, scope: AlphaRouteScope): RouteBadge | null {
  if (!isAlphaDeployment() || showPreviewRoutes()) {
    return null;
  }

  if (scope === "member" && memberBetaPaths.has(pathname)) {
    return "Beta";
  }

  if (scope === "admin" && adminBetaPaths.has(pathname)) {
    return "Beta";
  }

  if (scope === "member" && hiddenMemberPaths.has(pathname)) {
    return "Preview";
  }

  if (scope === "admin" && hiddenAdminPaths.has(pathname)) {
    return "Preview";
  }

  return null;
}

export function getUnavailableRedirect(scope: AlphaRouteScope, pathname?: string): string {
  if (scope === "member" && pathname === routes.app.finance) {
    return routes.app.giving;
  }

  if (scope === "auth") {
    return routes.auth.login;
  }
  if (scope === "admin") {
    return "/admin";
  }
  return routes.app.dashboard;
}

export const alphaRouteSummary = {
  member: [...memberAlphaPaths],
  admin: [...adminAlphaPaths],
  hiddenMember: [...hiddenMemberPaths],
  hiddenAdmin: [...hiddenAdminPaths],
} as const;
