"use client";

import { BriefcaseBusiness, Menu } from "lucide-react";
import Link from "next/link";

import { GlobalSearch } from "@/components/dashboard/layout/global-search";
import { NotificationsMenu } from "@/components/dashboard/layout/notifications-menu";
import { QuickActions } from "@/components/dashboard/layout/quick-actions";
import { UserMenu } from "@/components/dashboard/layout/user-menu";
import { LeadershipAccessDebug } from "@/components/shared/leadership-access-debug";
import { TenantLogo } from "@/components/shared/tenant-logo";
import { Button } from "@/components/ui/button";
import { useDisplayIdentity } from "@/hooks/use-display-identity";
import { useLeadershipAccess } from "@/hooks/use-leadership-access";
import { showPreviewRoutes } from "@/lib/config/product";
import { cn } from "@/lib/utils";

type TopbarProps = {
  title: string;
  onOpenSidebar: () => void;
  className?: string;
};

export function Topbar({
  title,
  onOpenSidebar,
  className,
}: TopbarProps) {
  const identity = useDisplayIdentity();
  const { status, showLeadershipConsole } = useLeadershipAccess();

  const showSearch = showPreviewRoutes();

  return (
    <header
      className={cn(
        "sticky top-3 z-30 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 sm:px-6 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex h-[3.25rem] items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="size-4" aria-hidden />
        </Button>

        <div className="min-w-0 flex flex-1 items-center md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6">
        <div className="min-w-[220px]">
          <div className="flex items-center gap-3 sm:gap-4">
            <TenantLogo churchName={identity.churchName} churchLogo={identity.churchLogo} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                {identity.tenantDisplayName}
              </p>
              <p className="truncate text-xs text-gray-400">
                {identity.formatPageWorkspaceLabel(title)}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 px-2 md:flex md:justify-center">
          {showSearch ? <GlobalSearch /> : null}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden md:block">
            <QuickActions permissions={identity.permissions} />
          </div>

          {showLeadershipConsole ? (
            <Button
              asChild
              size="sm"
              className="h-10 gap-1.5 rounded-xl bg-primary/90 text-primary-foreground shadow-[0_12px_30px_-18px_rgba(59,130,246,0.75)] hover:bg-primary sm:inline-flex"
            >
              <Link href="/admin">
                <BriefcaseBusiness className="size-4" aria-hidden />
                <span className="hidden sm:inline">Leadership Console</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </Button>
          ) : null}

          <NotificationsMenu role={identity.role} />
          <UserMenu showLeadershipConsole={showLeadershipConsole} />
        </div>
        </div>
      </div>

      <LeadershipAccessDebug user={identity.sessionUser} authStatus={status} />
    </header>
  );
}
