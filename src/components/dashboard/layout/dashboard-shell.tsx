import type { ReactNode } from "react";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="min-h-svh bg-background text-foreground">{children}</div>;
}
