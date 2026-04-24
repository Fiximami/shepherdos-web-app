"use client";

import {
  HandCoins,
  LineChart as LineChartIcon,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const attendanceSeries = [
  { month: "Jan", value: 312 },
  { month: "Feb", value: 328 },
  { month: "Mar", value: 318 },
  { month: "Apr", value: 341 },
  { month: "May", value: 356 },
  { month: "Jun", value: 348 },
];

const givingSeries = [
  { month: "Jan", value: 2.45 },
  { month: "Feb", value: 2.62 },
  { month: "Mar", value: 2.51 },
  { month: "Apr", value: 2.78 },
  { month: "May", value: 2.91 },
  { month: "Jun", value: 2.84 },
];

const growthInsights = [
  "First-time guests have held above last quarter’s average—your welcome rhythm is doing quiet, faithful work.",
  "Midweek groups show slightly higher consistency in April; leaders may want to celebrate that steadiness with volunteers.",
  "A small lift in returning families suggests follow-up calls are landing—not loud growth, but trustworthy momentum.",
];

const ministryRows = [
  { name: "Youth", score: 88, note: "Strong turnout at gatherings and retreat sign-ups." },
  { name: "Ushering & hosts", score: 92, note: "Coverage is even across Sunday services." },
  { name: "Follow-up care", score: 74, note: "Healthy pace; a few visits still awaiting scheduling." },
  { name: "Worship & tech", score: 85, note: "Teams rotating smoothly with minimal gaps." },
  { name: "Outreach", score: 70, note: "Room to invite one more neighborhood partner this month." },
];

const maxMinistry = Math.max(...ministryRows.map((m) => m.score));

export function AnalyticsPageView() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Analytics"
        description="Patterns across attendance, giving, and ministry life—framed for decisions that care for people, not just numbers on a wall."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Avg. Sunday attendance (4 wk)"
          value="338"
          detail="Calm, steady rhythm across campuses"
          icon={Users}
        />
        <SummaryCard
          label="Giving vs. prior month"
          value="+6%"
          detail="Measured with stewardship language in mind"
          icon={HandCoins}
        />
        <SummaryCard
          label="New households engaged"
          value="14"
          detail="Families taking a second step this quarter"
          icon={Sparkles}
        />
        <SummaryCard
          label="Ministry participation"
          value="High"
          detail="Leaders and volunteers active across key teams"
          icon={TrendingUp}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Attendance trends</CardTitle>
            <CardDescription>
              Rolling view of Sunday-scale attendance—enough to sense drift early, without
              turning Sundays into scoreboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 min-h-[16rem] pt-2 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceSeries} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsAttendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Attendance"
                  stroke="oklch(0.488 0.243 264.376)"
                  fill="url(#analyticsAttendanceFill)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <LineChartIcon className="size-4 text-muted-foreground" aria-hidden />
              Giving trends
            </CardTitle>
            <CardDescription>
              Monthly giving in millions (₦)—a gentle curve for planning conversations, not
              pressure in the hallway.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 min-h-[16rem] pt-2 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={givingSeries} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(v) => `₦${v}M`}
                />
                <Tooltip
                  formatter={(value) => {
                    const v = typeof value === "number" ? value : Number(value ?? 0);
                    return [`₦${v.toFixed(2)}M`, "Giving"];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Giving"
                  stroke="oklch(0.42 0.11 145)"
                  strokeWidth={2.4}
                  dot={{ r: 3, fill: "oklch(0.42 0.11 145)" }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Growth insights</CardTitle>
            <CardDescription>
              Short reads your leadership team can scan before prayer—signals, not alarms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {growthInsights.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Ministry performance</CardTitle>
            <CardDescription>
              A simple engagement index by team—conversation starters for pastors and
              ministry heads, not a league table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ministryRows.map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="tabular-nums text-muted-foreground">{row.score}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-primary/35"
                    style={{ width: `${Math.round((row.score / maxMinistry) * 100)}%` }}
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{row.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
