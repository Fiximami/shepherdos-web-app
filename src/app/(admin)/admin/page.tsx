import type { Metadata } from "next";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  HandCoins,
  HeartHandshake,
  Megaphone,
  Receipt,
  ScrollText,
  Settings2,
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
  { label: "Active Members", value: "1,248", note: "Up 4.2% from last month", icon: Users },
  { label: "Attendance This Week", value: "3,441", note: "Steady across branch services", icon: ChartNoAxesCombined },
  { label: "Giving This Month", value: "GHS 128.4k", note: "Consistent stewardship rhythm", icon: HandCoins },
  { label: "Pending Follow-ups", value: "18", note: "Care touchpoints due this week", icon: Clock3 },
] as const;

const careAttention = [
  {
    title: "First-timers awaiting follow-up",
    value: "12 people",
    note: "A welcome message and one caring call can help them settle in.",
  },
  {
    title: "Members inactive for 3 weeks",
    value: "27 people",
    note: "Gentle reconnection from leaders or group hosts is recommended.",
  },
  {
    title: "Prayer requests needing response",
    value: "9 requests",
    note: "Timely acknowledgment helps people feel seen and supported.",
  },
] as const;

const moduleCards = [
  {
    label: "Members",
    href: "/admin/members",
    icon: Users,
    description: "Care profiles, assignments, and movement across the church family.",
  },
  {
    label: "Attendance",
    href: "/admin/attendance",
    icon: ChartNoAxesCombined,
    description: "Participation patterns for follow-up and ministry planning.",
  },
  {
    label: "Finance",
    href: "/admin/finance",
    icon: Receipt,
    description: "Accounting, approvals, and stewardship controls for authorised leaders.",
  },
  {
    label: "Communication",
    href: "/admin/communication",
    icon: Megaphone,
    description: "Official messages across SMS, email, in-app, and announcements.",
  },
  {
    label: "Events Management",
    href: "/admin/events",
    icon: CalendarDays,
    description: "Plan gatherings, manage registrations, and coordinate readiness.",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "See growth, engagement, giving, and care trends in context.",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: ScrollText,
    description: "Generate leadership-ready reports for accountability and planning.",
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: Settings2,
    description: "Workspace structure, permissions, branding, and operating defaults.",
  },
] as const;

export default function AdminPage() {
  return (
    <main className="space-y-5">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/75 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.18]" />
        <div className="pointer-events-none absolute -left-10 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.16)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="pointer-events-none absolute right-10 top-5 hidden h-24 w-24 rounded-full border border-amber-200/15 sm:block" />
        <div className="pointer-events-none absolute right-14 top-9 hidden h-16 w-16 rounded-full border border-blue-200/15 sm:block" />
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
            <div className="mt-4 h-[2px] w-56 rounded-full bg-gradient-to-r from-amber-300/75 via-amber-100/30 to-transparent" />
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
            className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-[2px] hover:border-white/20 hover:shadow-[0_22px_40px_-30px_rgba(251,191,36,0.35)]"
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
            <CardDescription>Gentle prompts to help leaders respond with care and consistency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {careAttention.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <p className="text-sm font-medium text-white">
                  {item.title}: <span className="text-amber-100/95">{item.value}</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white">Leadership Posture</CardTitle>
            <CardDescription>Lead with prayerful clarity, then execute with care and accountability.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm text-gray-300">
            <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              Keep decisions spiritually grounded and operationally clear as teams execute this week.
            </p>
            <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              Balance stewardship and compassion so people, finances, and communication stay healthy together.
            </p>
            <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              Use modules below as focused lanes for members, ministry operations, and accountability reporting.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white">Leadership Workspace Modules</CardTitle>
            <CardDescription>Focused modules for governance, care, stewardship, and strategic oversight.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {moduleCards.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:border-amber-200/35 hover:bg-white/[0.08] hover:shadow-[0_18px_32px_-26px_rgba(251,191,36,0.45)]"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-1.5">
                      <module.icon className="size-4 text-blue-200/90 group-hover:text-amber-200/90" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-white">{module.label}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-400">{module.description}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-100/85 group-hover:text-amber-100">
                        Open module
                        <ChevronRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
