import type { ReactNode } from "react";

import { AdminAuthLayout } from "@/components/admin/layout/admin-auth-layout";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return <AdminAuthLayout>{children}</AdminAuthLayout>;
}
