import type { ReactNode } from "react";

import { AdminRouteGuard } from "@/components/admin/layout/admin-route-guard";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminTopbar } from "@/components/admin/layout/admin-topbar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div
      className="min-h-svh bg-transparent text-white [--background:#091726] [--foreground:#ffffff] [--card:rgb(255_255_255_/_0.045)] [--card-foreground:#ffffff] [--muted:rgb(255_255_255_/_0.04)] [--muted-foreground:#94a3b8] [--border:rgb(255_255_255_/_0.12)] [--input:rgb(255_255_255_/_0.1)]"
      style={{ colorScheme: "dark" }}
    >
      <AdminRouteGuard />
      <div className="mx-auto grid min-h-svh w-full max-w-[1680px] grid-cols-1 gap-4 p-3 md:grid-cols-[320px_minmax(0,1fr)] md:p-4 lg:gap-5 lg:p-5">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <div className="flex min-w-0 flex-col">
          <AdminTopbar />
          <main className="shepherd-fade-in mt-4 min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0d1f32]/55 p-4 shadow-[0_18px_42px_-32px_rgba(0,0,0,0.72)] backdrop-blur sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
