"use client";

import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  CircleDollarSign,
  ClipboardCheck,
  HandCoins,
  Megaphone,
  UserPlus,
  Users,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";

const attendanceData = [
  { week: "Wk 1", attendees: 312 },
  { week: "Wk 2", attendees: 338 },
  { week: "Wk 3", attendees: 327 },
  { week: "Wk 4", attendees: 356 },
  { week: "Wk 5", attendees: 371 },
];

const offeringData = [
  { week: "Wk 1", amount: 825000 },
  { week: "Wk 2", amount: 910000 },
  { week: "Wk 3", amount: 880000 },
  { week: "Wk 4", amount: 990000 },
];

const announcements = [
  {
    title: "Community outreach this Saturday",
    excerpt: "Volunteers meet by 8:00 AM at the main hall for briefing and prayer.",
    publishedAt: "Today, 9:20 AM",
  },
  {
    title: "Leaders' monthly review moved to Thursday",
    excerpt: "Please note the updated schedule for pastors, secretaries, and team leads.",
    publishedAt: "Yesterday",
  },
  {
    title: "Youth worship night follow-up",
    excerpt: "Share attendance notes and first-time guest feedback before Friday noon.",
    publishedAt: "2 days ago",
  },
];

const reminders = [
  "Review 8 first-time visitor follow-ups from this week.",
  "Approve 3 pending finance entries before end of day.",
  "Confirm communication draft for Sunday service updates.",
  "Check attendance outliers in two midweek groups.",
];

const quickActions = [
  { label: "Add Member", icon: UserPlus },
  { label: "Record Attendance", icon: CalendarCheck2 },
  { label: "Create Announcement", icon: Megaphone },
  { label: "Record Transaction", icon: HandCoins },
] as const;

export function DashboardHome() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Welcome back"
        description="Your church workspace is organized for this week—members, attendance, giving, communication, and follow-ups in one calm view."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Members"
          value="1,248"
          detail="+24 over the last 30 days"
          icon={Users}
        />
        <SummaryCard
          label="Attendance This Week"
          value="371"
          detail="Sunday service and weekly groups"
          icon={CalendarCheck2}
        />
        <SummaryCard
          label="Total Offering This Month"
          value="₦3.61M"
          detail="Across Sunday and midweek gatherings"
          icon={CircleDollarSign}
        />
        <SummaryCard
          label="Pending Follow-ups"
          value="8"
          detail="Members waiting for pastoral response"
          icon={ClipboardCheck}
        />
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Attendance Overview</CardTitle>
            <CardDescription>
              Weekly trend showing steady participation and congregation rhythm.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="oklch(0.488 0.243 264.376)"
                  fill="url(#attendanceGradient)"
                  strokeWidth={2.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Offering Overview</CardTitle>
            <CardDescription>
              Monthly giving snapshot to support faithful stewardship and planning.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offeringData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={42} />
                <Tooltip
                  formatter={(value) => {
                    const amount =
                      typeof value === "number" ? value : Number(value ?? 0);
                    return [`₦${amount.toLocaleString()}`, "Offering"];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[8, 8, 2, 2]}
                  fill="oklch(0.556 0 0)"
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Announcements</CardTitle>
            <CardDescription>
              Keep leaders and teams aligned with the latest church communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 bg-background/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-foreground sm:text-base">{item.title}</h3>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.publishedAt}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Pending Actions / Reminders</CardTitle>
            <CardDescription>
              A gentle checklist to keep care, operations, and accountability moving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {reminders.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2.5"
              >
                <BellRing className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Start common tasks quickly while you plan the rest of your day.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-11 justify-between rounded-xl border-border/80 bg-background/70 px-4"
              >
                <span className="inline-flex items-center gap-2">
                  <action.icon className="size-4 text-primary" aria-hidden />
                  {action.label}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
