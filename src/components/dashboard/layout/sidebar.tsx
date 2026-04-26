"use client";

import {
  BarChart3,
  CalendarDays,
  Church,
  CircleUserRound,
  HandHeart,
  LayoutGrid,
  Megaphone,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { routes } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", href: routes.app.dashboard, icon: LayoutGrid },
  { label: "Members", href: routes.app.members, icon: Users },
  { label: "Attendance", href: routes.app.attendance, icon: HandHeart },
  { label: "Finance", href: routes.app.finance, icon: Wallet },
  { label: "Communication", href: routes.app.communication, icon: Megaphone },
  { label: "Events", href: routes.app.events, icon: CalendarDays },
  { label: "Analytics", href: routes.app.analytics, icon: BarChart3 },
  { label: "Engagement", href: routes.app.engagement, icon: Church },
  { label: "Settings", href: routes.app.settings, icon: Settings },
  { label: "Profile", href: routes.app.profile, icon: CircleUserRound },
] as const;

type SidebarProps = {
  currentPath: string;
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({ currentPath, onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Church className="size-4" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">ShepherdOS</p>
          <p className="text-xs text-gray-400">Church workspace</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "size-4",
                  isActive
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-white",
                )}
                aria-hidden
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-xs text-gray-400">
          Serving your church with clarity and care.
        </p>
      </div>
    </aside>
  );
}
