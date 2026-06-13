"use client";

import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";

type AdminAuthLayoutProps = {
  children: ReactNode;
};

export function AdminAuthLayout({ children }: AdminAuthLayoutProps) {
  return (
    <ProtectedRoute requireLeadership>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
