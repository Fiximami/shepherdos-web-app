"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/navigation";
import { mockUser } from "@/lib/mock-user";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const pageTitles: Record<string, string> = {
  "/admin": "Leadership Console",
  [routes.app.dashboard]: "Dashboard",
  [routes.app.members]: "Members",
  [routes.app.attendance]: "Attendance",
  [routes.app.finance]: "Finance",
  [routes.app.communication]: "Communication",
  [routes.app.events]: "Events",
  [routes.app.analytics]: "Analytics",
  [routes.app.engagement]: "Engagement",
  [routes.app.settings]: "Settings",
  [routes.app.profile]: "Profile",
};

const leadershipRoles = new Set(["admin", "pastor", "finance", "leader"]);

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const title = useMemo(() => {
    return pageTitles[pathname] ?? "Workspace";
  }, [pathname]);

  const showLeadershipConsole = leadershipRoles.has(mockUser.role);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto grid min-h-svh w-full max-w-[1600px] grid-cols-1 gap-4 p-3 md:grid-cols-[260px_minmax(0,1fr)] md:p-4 lg:gap-5 lg:p-5">
        <div className="hidden md:block">
          <Sidebar currentPath={pathname} className="sticky top-4 h-[calc(100svh-2rem)]" />
        </div>

        <div className="flex min-w-0 flex-col">
          <Topbar
            title={title}
            onOpenSidebar={() => setIsMobileSidebarOpen(true)}
            showLeadershipConsole={showLeadershipConsole}
          />
          <main className="mt-4 min-w-0 flex-1 rounded-2xl border border-border/70 bg-card/35 p-4 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.5)] sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal>
          <button
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
            type="button"
          />
          <div className="absolute inset-y-0 left-0 w-[88vw] max-w-xs p-3">
            <div className="mb-2 flex justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <Sidebar
              currentPath={pathname}
              onNavigate={() => setIsMobileSidebarOpen(false)}
              className="h-[calc(100svh-5rem)]"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
