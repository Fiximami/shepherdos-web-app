import type { ReactNode } from "react";

import { RouteAvailabilityGuard } from "@/components/shared/route-availability-guard";

type AuthGroupLayoutProps = {
  children: ReactNode;
};

export default function AuthGroupLayout({ children }: AuthGroupLayoutProps) {
  return (
    <div className="min-h-svh bg-transparent">
      <RouteAvailabilityGuard scope="auth">{children}</RouteAvailabilityGuard>
    </div>
  );
}
