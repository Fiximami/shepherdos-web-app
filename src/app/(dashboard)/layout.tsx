import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";

type DashboardGroupLayoutProps = {
  children: ReactNode;
};

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
