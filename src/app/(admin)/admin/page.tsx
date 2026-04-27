import type { Metadata } from "next";
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  CalendarDays,
  ChartNoAxesCombined,
  CheckSquare,
  HandCoins,
  HeartHandshake,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Receipt,
  ScrollText,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Leadership Console · ShepherdOS",
  description:
    "Controlled leadership workspace for members, attendance, finance, communication, and reports.",
};

const leadershipMetrics = [
  { label: "Active Members", value: "1,248", note: "+4.2% from last month", icon: Users },
  { label: "Attendance This Week", value: "3,441", note: "Consistent across branches", icon: ChartNoAxesCombined },
  { label: "Giving This Month", value: "GHS 128.4k", note: "Stewardship remains healthy", icon: HandCoins },
  { label: "Pending Follow-ups", value: "18", note: "Care actions waiting assignment", icon: CheckSquare },
] as const;

const careAttention = [
  "First-timers awaiting follow-up: 12",
  "Members inactive for 3 weeks: 27",
  "Prayer requests needing response: 9",
] as const;

const operationalPriorities = [
  "Finance approvals pending reviewer sign-off: 6",
  "Upcoming events requiring preparation: Youth retreat and outreach weekend",
  "Announcements pending schedule: 4 official updates",
] as const;

const moduleCards = [
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Attendance", href: "/admin/attendance", icon: ChartNoAxesCombined },
  { label: "Finance", href: "/admin/finance", icon: Receipt },
  { label: "Communication", href: "/admin/communication", icon: Megaphone },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Community Feed", href: "/admin/community", icon: MessageSquare },
  { label: "Prayer Requests", href: "/admin/prayer-requests", icon: HeartHandshake },
  { label: "Giving", href: "/admin/giving", icon: HandCoins },
  { label: "Celebrations", href: "/admin/celebrations", icon: Sparkles },
  { label: "Notifications", href: "/admin/notifications", icon: BellRing },
  { label: "Messages", href: "/admin/messages", icon: MessagesSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin/reports", icon: ScrollText },
  { label: "System Settings", href: "/admin/settings", icon: Settings2 },
] as const;

export default function AdminPage() {
  return (
    <main className="space-y-5">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/75 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.16)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-amber-100/80">
              Leadership Console
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.9rem]">
              Leadership Console
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              A focused workspace for shepherding people, decisions, and growth with clarity.
            </p>
          </div>
          <Button asChild variant="outline" className="h-10 rounded-xl border-white/15 bg-white/[0.06] text-white">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" aria-hidden />
              Return to Member Dashboard
            </Link>
          </Button>
        </div>
      </section>

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {leadershipMetrics.map((metric) => (
          <Card
            key={metric.label}
            className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-[2px] hover:border-white/20"
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center justify-between gap-2 text-sm text-white">
                {metric.label}
                <metric.icon className="size-4 text-amber-200/90" aria-hidden />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-gray-400">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="shepherd-fade-in grid gap-4 xl:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white">Care Attention Needed</CardTitle>
            <CardDescription>Pastoral and follow-up signals requiring near-term response.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {careAttention.map((item) => (
              <p key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white">Operational Priorities</CardTitle>
            <CardDescription>Leadership tasks needing structured execution this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {operationalPriorities.map((item) => (
              <p key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white">Leadership Workspace Modules</CardTitle>
            <CardDescription>
              Admin management modules designed for governance, care, stewardship, and growth operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {moduleCards.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:border-amber-200/35 hover:bg-white/[0.08] hover:shadow-[0_18px_32px_-26px_rgba(251,191,36,0.45)]"
                >
                  <module.icon className="size-4 text-blue-200/90 group-hover:text-amber-200/90" aria-hidden />
                  <span className="font-medium">{module.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
