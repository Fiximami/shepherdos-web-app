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
        "sticky top-0 z-30 flex h-16 items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.7)] backdrop-blur",
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
        <p className="truncate text-base font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">
          ShepherdOS church workspace
        </p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <div className="flex h-9 w-56 items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 text-sm text-muted-foreground">
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

      <div className="hidden items-center gap-2 rounded-lg border border-border/70 bg-muted/20 px-2.5 py-1.5 sm:flex">
        <UserCircle2 className="size-4 text-muted-foreground" aria-hidden />
        <div className="leading-tight">
          <p className="text-xs font-medium">Church team member</p>
          <p className="text-[11px] text-muted-foreground">Role placeholder</p>
        </div>
      </div>
    </header>
  );
}
