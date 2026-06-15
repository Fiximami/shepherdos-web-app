"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  CircleAlert,
  HandCoins,
  HeartHandshake,
  Info,
  Megaphone,
  Receipt,
  ScrollText,
  Settings2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { PreviewSectionNotice, previewDescription } from "@/components/shared/preview-section-notice";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/use-api-data";
import { fetchLeadershipDashboardSummary } from "@/lib/api/dashboard";
import { pickSummaryCurrency, pickSummaryValue } from "@/lib/api/formatters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const leadershipMetrics = [
  { label: "Active Members", value: "—", note: "Loads from /members/summary when signed in", icon: Users },
  { label: "Attendance This Week", value: "—", note: "Loads from /attendance/summary when signed in", icon: ChartNoAxesCombined },
  { label: "Giving This Month", value: "—", note: "Loads from /finance/summary when signed in", icon: HandCoins },
  { label: "Pending Follow-ups", value: "—", note: "Loads from /members/summary when signed in", icon: Clock3 },
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

type InsightSeverity = "info" | "warning" | "urgent";
type InsightFilter = "all" | "urgent" | "needs-action";

const shepherdInsights = [
  {
    id: "si-1",
    category: "Attendance",
    message: "15 members missed 3 consecutive services",
    severity: "warning" as InsightSeverity,
    needsAction: true,
    icon: ChartNoAxesCombined,
  },
  {
    id: "si-2",
    category: "Giving",
    message: "Giving dropped 12% this week",
    severity: "warning" as InsightSeverity,
    needsAction: true,
    icon: HandCoins,
  },
  {
    id: "si-3",
    category: "Care",
    message: "3 counselling requests unassigned",
    severity: "urgent" as InsightSeverity,
    needsAction: true,
    icon: HeartHandshake,
  },
  {
    id: "si-4",
    category: "Engagement",
    message: "5 prayer requests awaiting response",
    severity: "info" as InsightSeverity,
    needsAction: true,
    icon: Info,
  },
] as const;

function insightSeverityStyle(severity: InsightSeverity) {
  const map: Record<InsightSeverity, string> = {
    info: "border-sky-500/20 bg-sky-950/20 text-sky-100",
    warning: "border-amber-500/20 bg-amber-950/25 text-amber-100",
    urgent: "border-rose-500/20 bg-rose-950/30 text-rose-100",
  };
  return map[severity];
}

export default function AdminPage() {
  const [insightFilter, setInsightFilter] = useState<InsightFilter>("all");
  const dashboardQuery = useApiData("admin-dashboard-summary", fetchLeadershipDashboardSummary, {
    members: {},
    attendance: {},
    finance: {},
  });

  const leadershipMetricValues = dashboardQuery.isLive
    ? [
        {
          label: "Active Members",
          value: pickSummaryValue(dashboardQuery.data.members, ["activeMembers", "totalMembers", "total"]),
          note: "Live member summary from API",
          icon: Users,
        },
        {
          label: "Attendance This Week",
          value: pickSummaryValue(dashboardQuery.data.attendance, ["thisWeek", "weekCount", "attendanceThisWeek"]),
          note: "Live attendance summary from API",
          icon: ChartNoAxesCombined,
        },
        {
          label: "Giving This Month",
          value: pickSummaryCurrency(dashboardQuery.data.finance, [
            "givingThisMonth",
            "monthTotal",
            "totalIncome",
            "total",
          ]),
          note: "Live finance summary from API",
          icon: HandCoins,
        },
        {
          label: "Pending Follow-ups",
          value: pickSummaryValue(dashboardQuery.data.members, ["pendingFollowUps", "followUpNeeded", "needingFollowUp"]),
          note: "From member summary API",
          icon: Clock3,
        },
      ]
    : leadershipMetrics;

  const visibleInsights = useMemo(() => {
    if (insightFilter === "urgent") return shepherdInsights.filter((i) => i.severity === "urgent");
    if (insightFilter === "needs-action") return shepherdInsights.filter((i) => i.needsAction);
    return shepherdInsights;
  }, [insightFilter]);

  return (
    <main className="space-y-5">
      <ApiConnectionNotice
        isLoading={dashboardQuery.isLoading}
        error={dashboardQuery.error}
        isLive={dashboardQuery.isLive}
        liveLabel="Summary cards use live data from /members/summary, /attendance/summary, and /finance/summary."
      />

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
        {leadershipMetricValues.map((metric) => (
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
            <CardDescription>{previewDescription("Gentle prompts to help leaders respond with care and consistency.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <PreviewSectionNotice message="Preview only — care queues will load when follow-up endpoints are available." />
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
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base text-white">Shepherd Insights</CardTitle>
              <CardDescription>{previewDescription("Calm intelligence highlights so leaders can respond early and wisely.")}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "All"],
                  ["urgent", "Urgent"],
                  ["needs-action", "Needs Action"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setInsightFilter(id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    insightFilter === id
                      ? "border-amber-300/35 bg-amber-300/10 text-amber-50 shadow-[0_0_16px_-10px_rgba(251,191,36,0.7)]"
                      : "border-white/15 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <PreviewSectionNotice message="Preview only — insight cards are placeholders until analytics endpoints are available." />
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {visibleInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "rounded-xl border px-3 py-3 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-[1px]",
                    insightSeverityStyle(insight.severity),
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white">
                      <insight.icon className="size-3.5" aria-hidden />
                      {insight.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-300/90">{insight.severity}</span>
                  </div>
                  <p className="mt-2 text-sm text-white">{insight.message}</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-100/90 hover:text-amber-100"
                  >
                    View Details
                    {insight.severity === "urgent" ? (
                      <AlertTriangle className="size-3.5 text-rose-200/90" aria-hidden />
                    ) : insight.severity === "warning" ? (
                      <CircleAlert className="size-3.5 text-amber-200/90" aria-hidden />
                    ) : (
                      <Info className="size-3.5 text-sky-200/90" aria-hidden />
                    )}
                  </button>
                </div>
              ))}
            </div>
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
