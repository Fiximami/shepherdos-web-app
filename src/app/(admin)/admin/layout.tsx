import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { mockUser } from "@/lib/mock-user";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

const leadershipPermissions = new Set([
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
]);

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  const canAccessByPermission = mockUser.permissions.some((permission) => leadershipPermissions.has(permission));

  if (!canAccessByPermission) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
