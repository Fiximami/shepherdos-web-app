"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { type Permission } from "@/lib/mock-user";
import { canAccessLeadershipConsoleFromSession, hasAnyPermission } from "@/lib/permissions";

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

  useEffect(() => {
    const requiredForRoute = routePermissions.find((item) => pathname.startsWith(item.startsWith));
    const canAccessSpecific = requiredForRoute ? hasAnyPermission(requiredForRoute.requiredAny) : true;
    const canAccessAdmin = canAccessLeadershipConsoleFromSession();

    if (!canAccessAdmin || !canAccessSpecific) {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return null;
}
