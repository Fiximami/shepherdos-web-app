import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

type AdminGroupLayoutProps = {
  children: ReactNode;
};

export default function AdminGroupLayout({ children }: AdminGroupLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
