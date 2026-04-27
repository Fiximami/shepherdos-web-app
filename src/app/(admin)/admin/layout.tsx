import {
  ArrowLeft,
  BarChart3,
  BellRing,
  CalendarDays,
  ChartNoAxesCombined,
  Church,
  Megaphone,
  Receipt,
  Settings2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { mockUser } from "@/lib/mock-user";
import { cn } from "@/lib/utils";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

const adminNav = [
  { label: "Overview", href: "/admin", icon: ChartNoAxesCombined },
  { label: "Members", href: "/members", icon: Users },
  { label: "Attendance", href: "/attendance", icon: BellRing },
  { label: "Finance", href: "/finance", icon: Receipt },
  { label: "Communication", href: "/communication", icon: Megaphone },
  { label: "Events Management", href: "/events", icon: CalendarDays },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin#reports", icon: ChartNoAxesCombined },
  { label: "System Settings", href: "/settings", icon: Settings2 },
] as const;

const leadershipRoles = new Set([
  "admin",
  "church_admin",
  "owner",
  "church_owner",
  "pastor",
  "finance",
  "finance_officer",
  "leader",
  "ministry_leader",
]);

const leadershipPermissions = new Set(["users:manage", "settings:manage", "finance:approve", "finance:report"]);

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  const canAccessByRole = leadershipRoles.has(mockUser.role);
  const canAccessByPermission = mockUser.permissions.some((permission) =>
    leadershipPermissions.has(permission),
  );

  if (!canAccessByRole && !canAccessByPermission) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-svh bg-transparent text-white [--background:#091726] [--foreground:#ffffff] [--card:rgb(255_255_255_/_0.045)] [--card-foreground:#ffffff] [--muted:rgb(255_255_255_/_0.04)] [--muted-foreground:#94a3b8] [--border:rgb(255_255_255_/_0.12)] [--input:rgb(255_255_255_/_0.1)]"
      style={{ colorScheme: "dark" }}
    >
      <div className="mx-auto grid min-h-svh w-full max-w-[1680px] grid-cols-1 gap-4 p-3 md:grid-cols-[280px_minmax(0,1fr)] md:p-4 lg:gap-5 lg:p-5">
        <aside className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-[#0e2237]/85 shadow-[0_20px_46px_-30px_rgba(0,0,0,0.72)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-1">
                {mockUser.churchLogo ? (
                  <Image
                    src={mockUser.churchLogo}
                    alt={`${mockUser.churchName} logo`}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                ) : (
                  <Church className="size-4 text-primary" aria-hidden />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{mockUser.churchName}</p>
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
            {adminNav.map((item) => {
              const pathWithoutHash = item.href.split("#")[0];
              const isActive = pathWithoutHash === "/admin";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-[background-color,color,border-color] duration-200",
                    isActive
                      ? "border border-white/12 bg-white/[0.11] text-white"
                      : "border border-transparent text-gray-300 hover:border-white/10 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  <item.icon className="size-4 text-gray-300 group-hover:text-white" aria-hidden />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-4 py-3">
            <p className="text-xs text-gray-400">
              Lead with clarity, steward with wisdom, and keep the flock in view.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-3 z-20 flex h-[4.25rem] items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#10263d]/80 px-4 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">Leadership Console</p>
              <p className="truncate text-xs text-gray-400">
                Structured oversight for people, stewardship, communication, and mission momentum.
              </p>
            </div>
            <span className="hidden rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:inline-flex">
              {mockUser.roleLabel}
            </span>
          </header>

          <main className="mt-4 min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0d1f32]/55 p-4 shadow-[0_18px_42px_-32px_rgba(0,0,0,0.72)] backdrop-blur sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
