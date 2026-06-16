import type { ReactNode } from "react";

import { AdminAuthLayout } from "@/components/admin/layout/admin-auth-layout";
import { RouteAvailabilityGuard } from "@/components/shared/route-availability-guard";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return (
    <RouteAvailabilityGuard scope="admin">
      <AdminAuthLayout>{children}</AdminAuthLayout>
    </RouteAvailabilityGuard>
  );
}
