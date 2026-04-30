"use client";

import {
  Bell,
  CalendarDays,
  Compass,
  Church,
  Gift,
  CircleUserRound,
  HeartHandshake,
  LayoutGrid,
  MessageCircleHeart,
  MessagesSquare,
  NotebookPen,
  ShoppingBag,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { routes } from "@/lib/constants/navigation";
import { mockUser } from "@/lib/mock-user";
import { cn } from "@/lib/utils";

const memberSidebarItems = [
  { label: "My Dashboard", href: routes.app.dashboard, icon: LayoutGrid },
  { label: "My Profile", href: routes.app.profile, icon: CircleUserRound },
  { label: "Community Feed", href: routes.app.feed, icon: MessageCircleHeart },
  { label: "Events", href: routes.app.events, icon: CalendarDays },
  { label: "Prayer Requests", href: routes.app.prayerRequests, icon: HeartHandshake },
  { label: "Counselling", href: routes.app.counselling, icon: Compass },
  { label: "Giving", href: routes.app.giving, icon: Wallet },
  { label: "Store", href: routes.app.store, icon: ShoppingBag },
  { label: "My Celebrations", href: routes.app.celebrations, icon: Gift },
  { label: "Notifications", href: routes.app.notifications, icon: Bell },
  { label: "Messages", href: routes.app.messages, icon: MessagesSquare },
  { label: "Settings", href: routes.app.settings, icon: Settings },
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
          <p className="text-xs text-gray-400">Member portal</p>
        </div>
      </div>

      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">My Church Space</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {memberSidebarItems.map((item) => {
          const isActive = !item.href.includes("#") && currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-[background-color,color,box-shadow,transform] duration-250 ease-out motion-reduce:transition-none",
                isActive
                  ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:rounded-full before:bg-primary before:shadow-[0_0_12px_rgba(59,130,246,0.75)]"
                  : "text-gray-400 hover:-translate-y-[1px] hover:bg-white/[0.11] hover:text-white",
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
        <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <NotebookPen className="size-3.5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">Welcome, {mockUser.name.split(" ")[0]}</p>
            <p className="truncate text-[11px] text-gray-400">{mockUser.churchName} member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
