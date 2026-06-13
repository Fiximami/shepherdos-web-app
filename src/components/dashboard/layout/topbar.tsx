"use client";

import { BriefcaseBusiness, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { GlobalSearch } from "@/components/dashboard/layout/global-search";
import { NotificationsMenu } from "@/components/dashboard/layout/notifications-menu";
import { QuickActions } from "@/components/dashboard/layout/quick-actions";
import { UserMenu } from "@/components/dashboard/layout/user-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

type TopbarProps = {
  title: string;
  onOpenSidebar: () => void;
  showLeadershipConsole?: boolean;
  className?: string;
};

export function Topbar({
  title,
  onOpenSidebar,
  showLeadershipConsole = false,
  className,
}: TopbarProps) {
  const [logoMissing, setLogoMissing] = useState(false);
  const currentUser = useCurrentUser();

  const role = currentUser.role;
  const permissions = currentUser.permissions;
  const canAccessLeadershipConsole = useMemo(
    () =>
      showLeadershipConsole &&
      (role !== "member" ||
        permissions.includes("users:manage") ||
        permissions.includes("settings:manage")),
    [permissions, role, showLeadershipConsole],
  );

  return (
    <header
      className={cn(
        "sticky top-3 z-30 flex h-[4.25rem] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 sm:px-6 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl",
        className,
      )}
    >
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
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/12 bg-white/[0.08] p-1">
            {currentUser.churchLogo && !logoMissing ? (
              <Image
                src={currentUser.churchLogo}
                alt={`${currentUser.churchName} logo`}
                fill
                sizes="40px"
                className="object-contain"
                onError={() => setLogoMissing(true)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                {currentUser.churchName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                {currentUser.churchName}
              </p>
              <p className="truncate text-xs text-gray-400">
                {title} · ShepherdOS workspace
              </p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 px-2 md:flex md:justify-center">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden md:block">
            <QuickActions permissions={permissions} />
          </div>

          {canAccessLeadershipConsole ? (
            <Button
              asChild
              size="sm"
              className="hidden h-10 gap-1.5 rounded-xl bg-primary/90 text-primary-foreground shadow-[0_12px_30px_-18px_rgba(59,130,246,0.75)] hover:bg-primary md:inline-flex"
            >
              <Link href="/admin">
                <BriefcaseBusiness className="size-4" aria-hidden />
                Leadership Console
              </Link>
            </Button>
          ) : null}

          <NotificationsMenu role={role} />
          <UserMenu
            name={currentUser.name}
            role={role}
            roleLabel={currentUser.roleLabel}
            workspace={currentUser.churchName}
          />
        </div>
      </div>
    </header>
  );
}
