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
        "sticky top-3 z-30 flex h-[4.25rem] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl",
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
        <p className="truncate text-base font-semibold tracking-tight text-white">{title}</p>
        <p className="truncate text-xs text-gray-400">
          ShepherdOS church workspace
        </p>
      </div>

      <div className="hidden items-center gap-2.5 md:flex">
        <div className="group flex h-10 w-72 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-sm text-gray-400 transition-[border-color,background-color,box-shadow] duration-250 ease-out focus-within:border-primary/45 focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-primary/20 lg:w-80">
          <Search className="size-4" aria-hidden />
          <span className="truncate">Search people, groups, records</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-1.5 rounded-xl border-primary/20 bg-white/[0.07] text-white/90 hover:bg-white/[0.12]"
        >
          <Sparkles className="size-4" aria-hidden />
          Quick actions
        </Button>
      </div>

      {showLeadershipConsole ? (
        <Button
          asChild
          size="sm"
          className="h-10 gap-1.5 rounded-xl bg-primary/90 text-primary-foreground shadow-[0_12px_30px_-18px_rgba(59,130,246,0.75)] hover:bg-primary"
        >
          <Link href="/admin">
            <BriefcaseBusiness className="size-4" aria-hidden />
            Leadership Console
          </Link>
        </Button>
      ) : null}

      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="rounded-xl text-gray-300 hover:bg-white/10 hover:text-white"
      >
        <Bell className="size-4" aria-hidden />
      </Button>

      <div className="hidden min-w-[180px] items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 transition-[background-color,border-color,transform] duration-250 ease-out hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.1] sm:flex">
        <div className="flex items-center gap-2.5">
        <UserCircle2 className="size-4 text-gray-400" aria-hidden />
        <div className="leading-tight">
          <p className="text-xs font-semibold text-white">Church team member</p>
          <p className="text-[11px] text-gray-400">Role placeholder</p>
          </div>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
          Active
        </span>
      </div>
    </header>
  );
}
