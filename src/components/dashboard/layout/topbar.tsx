"use client";

import { Bell, BriefcaseBusiness, Menu, Search, Sparkles, UserCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 shadow-[0_12px_28px_-20px_rgba(0,0,0,0.58)] backdrop-blur-xl",
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

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white">{title}</p>
        <p className="truncate text-xs text-gray-400">
          ShepherdOS church workspace
        </p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-9 w-56 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-gray-400">
          <Search className="size-4" aria-hidden />
          <span>Search people, groups, records</span>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="size-4" aria-hidden />
          Quick actions
        </Button>
      </div>

      {showLeadershipConsole ? (
        <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl">
          <Link href="/admin">
            <BriefcaseBusiness className="size-4" aria-hidden />
            Leadership Console
          </Link>
        </Button>
      ) : null}

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-4" aria-hidden />
      </Button>

      <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 sm:flex">
        <UserCircle2 className="size-4 text-gray-400" aria-hidden />
        <div className="leading-tight">
          <p className="text-xs font-medium text-white">Church team member</p>
          <p className="text-[11px] text-gray-400">Role placeholder</p>
        </div>
      </div>
    </header>
  );
}
