import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { mockUser } from "@/lib/mock-user";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

const leadershipRoles = new Set([
  "admin",
  "church_admin",
  "owner",
  "church_owner",
  "pastor",
  "finance",
  "finance_officer",
  "leader",
  "ministry_leader",
]);

const leadershipPermissions = new Set(["users:manage", "settings:manage", "finance:approve", "finance:report"]);

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  const canAccessByRole = leadershipRoles.has(mockUser.role);
  const canAccessByPermission = mockUser.permissions.some((permission) =>
    leadershipPermissions.has(permission),
  );

  if (!canAccessByRole && !canAccessByPermission) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
