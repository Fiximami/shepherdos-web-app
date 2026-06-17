"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { canAccessAdminPath } from "@/lib/auth/admin-module-access";
import { canAccessLeadershipConsole, isSuperAdmin } from "@/lib/auth/leadership-access";
import { type Permission } from "@/lib/mock-user";
import { hasAnyPermission } from "@/lib/permissions";
import { useAuth } from "@/providers/auth-provider";

const routePermissions: Array<{ startsWith: string; requiredAny: Permission[] }> = [
  { startsWith: "/admin/finance", requiredAny: ["finance:record", "finance:approve"] },
  { startsWith: "/admin/counselling", requiredAny: ["counselling:view", "counselling:manage"] },
  { startsWith: "/admin/members", requiredAny: ["members:create", "members:update"] },
  { startsWith: "/admin/follow-ups", requiredAny: ["followups:assign"] },
  { startsWith: "/admin/communication", requiredAny: ["announcements:create", "messages:send"] },
];

export function AdminRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (status !== "authenticated") return;

    const canAccessAdmin = canAccessLeadershipConsole(currentUser);
    const canAccessPath = canAccessAdminPath(currentUser, pathname);
    const requiredForRoute = routePermissions.find((item) => pathname.startsWith(item.startsWith));
    const canAccessSpecific =
      isSuperAdmin(currentUser) ||
      !requiredForRoute ||
      hasAnyPermission(requiredForRoute.requiredAny) ||
      canAccessPath;

    if (!canAccessAdmin || !canAccessPath || !canAccessSpecific) {
      router.replace("/dashboard");
    }
  }, [currentUser, pathname, router, status]);

  return null;
}
