import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { RouteAvailabilityGuard } from "@/components/shared/route-availability-guard";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

type DashboardGroupLayoutProps = {
  children: ReactNode;
};

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <ProtectedRoute>
      <RouteAvailabilityGuard scope="member">
        <DashboardShell>{children}</DashboardShell>
      </RouteAvailabilityGuard>
    </ProtectedRoute>
  );
}
