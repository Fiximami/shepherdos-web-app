"use client";

import {
  ArrowLeft,
  BarChart3,
  BellRing,
  CalendarDays,
  ChartColumnIncreasing,
  CircleDollarSign,
  ClipboardCheck,
  HandHeart,
  Megaphone,
  ReceiptText,
  Settings2,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const leadershipMetrics = [
  {
    label: "Active Members",
    value: "1,248",
    trend: "+4.2% from last month",
    icon: Users,
  },
  {
    label: "Attendance This Week",
    value: "912",
    trend: "Steady participation across services",
    icon: UserRoundCheck,
  },
  {
    label: "Giving This Month",
    value: "GHS 128,400",
    trend: "+7.1% in faithful contributions",
    icon: CircleDollarSign,
  },
  {
    label: "Pending Follow-ups",
    value: "18",
    trend: "7 need same-week pastoral response",
    icon: ClipboardCheck,
  },
] as const;

const careInsights = [
  {
    label: "First-timers awaiting follow-up",
    value: "12 people",
    note: "A warm check-in this week can help them feel seen and settled.",
    icon: HandHeart,
  },
  {
    label: "Members inactive for 3 weeks",
    value: "27 people",
    note: "Gentle outreach is encouraged to restore connection and care rhythm.",
    icon: BellRing,
  },
  {
    label: "Prayer requests needing response",
    value: "9 requests",
    note: "Pastoral coverage is open for coordinated prayer and personal support.",
    icon: ReceiptText,
  },
] as const;

const leadershipModules = [
  {
    label: "Members",
    href: "/members",
    description: "Care records, first-timers, workers, and structured follow-up visibility.",
    icon: Users,
  },
  {
    label: "Attendance",
    href: "/attendance",
    description: "Participation trends to help leaders notice rhythm shifts early.",
    icon: ChartColumnIncreasing,
  },
  {
    label: "Finance",
    href: "/finance",
    description: "Giving, approvals, and stewardship snapshots for accountable oversight.",
    icon: CircleDollarSign,
  },
  {
    label: "Communication",
    href: "/communication",
    description: "Announcements and message planning for coordinated church updates.",
    icon: Megaphone,
  },
  {
    label: "Events Management",
    href: "/events",
    description: "Service schedules and event planning for smooth church coordination.",
    icon: CalendarDays,
  },
  {
    label: "Analytics",
    href: "/analytics",
    description: "Growth, giving, and ministry movement insights for wise decisions.",
    icon: TrendingUp,
  },
  {
    label: "Reports",
    href: "/admin#reports",
    description: "Leadership summaries for planning sessions and ministry reviews.",
    icon: BarChart3,
  },
  {
    label: "System Settings",
    href: "/settings",
    description: "Workspace controls, governance clarity, and responsible platform stewardship.",
    icon: Settings2,
  },
] as const;

export function AdminWorkspaceView() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_28px_60px_-42px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.16)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0)_74%)]" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-amber-200/75">
              Leadership Console
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.9rem]">
              Leadership Console
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-[0.95rem]">
              A focused workspace for shepherding people, decisions, and growth with clarity.
            </p>
            <div className="mt-4 h-px w-48 bg-gradient-to-r from-amber-300/70 via-blue-300/50 to-transparent" />
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
          <article
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-[transform,border-color,background-color] duration-250 ease-out hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-300">{metric.label}</p>
              <metric.icon className="size-4 text-amber-300/85" aria-hidden />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-400">{metric.trend}</p>
          </article>
        ))}
      </section>

      <section className="shepherd-fade-in rounded-2xl border border-white/10 bg-[#0f2235]/75 p-4 shadow-[0_20px_48px_-36px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white">Care Attention Needed</p>
          <p className="text-xs text-amber-200/80">Pastoral care rhythm and response visibility</p>
        </div>

        <div className="space-y-2.5">
          {careInsights.map((insight) => (
            <article
              key={insight.label}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 transition-colors duration-200 hover:bg-white/[0.07]"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg border border-white/10 bg-white/[0.06] p-1.5">
                  <insight.icon className="size-4 text-blue-200/85" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{insight.label}</p>
                  <p className="text-xs text-amber-100/80">{insight.value}</p>
                  <p className="mt-1 text-xs text-slate-300">{insight.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shepherd-fade-in rounded-2xl border border-white/10 bg-[#10263a]/70 p-4 shadow-[0_20px_48px_-36px_rgba(0,0,0,0.82)] backdrop-blur-xl sm:p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-300">
          Leadership Workspace Modules
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {leadershipModules.map((module) => (
            <article
              key={module.label}
              className="group rounded-xl border border-white/10 bg-white/[0.045] p-4 transition-[transform,border-color,background-color,box-shadow] duration-250 ease-out hover:-translate-y-[2px] hover:border-amber-200/30 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_-30px_rgba(251,191,36,0.45)]"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] p-1.5">
                  <module.icon className="size-4 text-blue-200/90" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-white">{module.label}</p>
              </div>
              <p className="min-h-[2.75rem] text-xs leading-relaxed text-slate-300">{module.description}</p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mt-4 h-8 rounded-lg border-white/15 bg-white/[0.04] text-xs text-white hover:bg-white/[0.12]"
              >
                <Link href={module.href}>Open module</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
