"use client";

import {
  ArrowLeft,
  BarChart3,
  BellRing,
  CalendarDays,
  ChartNoAxesCombined,
  Church,
  ClipboardCheck,
  Boxes,
  Layers,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Receipt,
  ScrollText,
  Settings2,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-current-user";
import { hasAnyPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Overview", href: "/admin", icon: ChartNoAxesCombined },
  { label: "Members", href: "/admin/members", icon: Users, requiredAny: ["members:create", "members:update"] },
  { label: "Departments & Groups", href: "/admin/departments", icon: Layers },
  { label: "Attendance", href: "/admin/attendance", icon: BellRing },
  { label: "Finance", href: "/admin/finance", icon: Receipt, requiredAny: ["finance:record", "finance:approve"] },
  { label: "Communication", href: "/admin/communication", icon: Megaphone, requiredAny: ["announcements:create", "messages:send"] },
  { label: "Events Management", href: "/admin/events", icon: CalendarDays },
  { label: "Community Feed Management", href: "/admin/community", icon: MessageSquare },
  { label: "Prayer Requests Management", href: "/admin/prayer-requests", icon: Sparkles },
  { label: "Counselling", href: "/admin/counselling", icon: Shield, requiredAny: ["counselling:view", "counselling:manage"] },
  { label: "Follow-ups", href: "/admin/follow-ups", icon: ClipboardCheck, requiredAny: ["followups:assign"] },
  { label: "Giving Management", href: "/admin/giving", icon: Receipt },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Celebrations Management", href: "/admin/celebrations", icon: Sparkles },
  { label: "Notifications Management", href: "/admin/notifications", icon: BellRing },
  { label: "Messages Management", href: "/admin/messages", icon: MessagesSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin/reports", icon: ScrollText },
  { label: "System Settings", href: "/admin/settings", icon: Settings2 },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const visibleNav = adminNav.filter((item) => {
    if (!("requiredAny" in item) || !item.requiredAny) return true;
    return hasAnyPermission(item.requiredAny);
  });

  return (
    <aside className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-[#0e2237]/85 shadow-[0_20px_46px_-30px_rgba(0,0,0,0.72)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-1">
            {currentUser.churchLogo ? (
              <Image
                src={currentUser.churchLogo}
                alt={`${currentUser.churchName} logo`}
                fill
                sizes="40px"
                className="object-contain"
              />
            ) : (
              <Church className="size-4 text-primary" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{currentUser.churchName}</p>
            <p className="text-xs text-blue-100/80">Leadership Console</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Return to Member Dashboard
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Operations Navigation
        </p>
        {visibleNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out",
                isActive
                  ? "border border-white/12 bg-white/[0.11] text-white shadow-[0_0_20px_-14px_rgba(251,191,36,0.8)]"
                  : "border border-transparent text-gray-300 hover:-translate-y-[1px] hover:border-white/10 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              <item.icon className="size-4 text-gray-300 group-hover:text-white" aria-hidden />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
