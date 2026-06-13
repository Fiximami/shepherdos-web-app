"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/providers/auth-provider";
import { routes } from "@/lib/constants/navigation";
import { hasAnyPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/mock-user";

type ProtectedRouteProps = {
  children: ReactNode;
  requireLeadership?: boolean;
  requiredAny?: Permission[];
};

const leadershipPermissions: Permission[] = [
  "users:manage",
  "settings:manage",
  "finance:approve",
  "finance:record",
  "finance:report",
  "counselling:view",
  "counselling:manage",
  "members:create",
  "members:update",
  "followups:assign",
  "announcements:create",
  "messages:send",
  "attendance:record",
  "events:create",
];

export function ProtectedRoute({
  children,
  requireLeadership = false,
  requiredAny,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(routes.auth.login);
      return;
    }

    if (status !== "authenticated") return;

    if (requireLeadership && !hasAnyPermission(leadershipPermissions)) {
      router.replace(routes.app.dashboard);
      return;
    }

    if (requiredAny?.length && !hasAnyPermission(requiredAny)) {
      router.replace(routes.app.dashboard);
    }
  }, [requireLeadership, requiredAny, router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-transparent text-muted-foreground">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 px-4 py-3 text-sm shadow-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Checking your session…
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requireLeadership && !hasAnyPermission(leadershipPermissions)) {
    return null;
  }

  if (requiredAny?.length && !hasAnyPermission(requiredAny)) {
    return null;
  }

  return children;
}
