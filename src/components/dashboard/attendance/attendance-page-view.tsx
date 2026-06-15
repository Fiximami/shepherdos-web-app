"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { PreviewSectionNotice } from "@/components/shared/preview-section-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { fetchMyAttendance } from "@/lib/api/attendance";
import { pickSummaryValue } from "@/lib/api/formatters";
import {
  mapMyAttendanceHistoryItem,
  type MemberAttendanceSessionRow,
} from "@/lib/api/mappers";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import { useAuth } from "@/providers/auth-provider";

const fallbackTrendData = [
  { label: "Jan", total: 298, guests: 14 },
  { label: "Feb", total: 312, guests: 18 },
  { label: "Mar", total: 305, guests: 12 },
  { label: "Apr", total: 328, guests: 22 },
  { label: "May", total: 341, guests: 19 },
  { label: "Jun", total: 336, guests: 16 },
];

const demoSessions: MemberAttendanceSessionRow[] = [
  {
    sessionName: "Sunday Celebration",
    date: "2026-04-20",
    branch: "Main Campus",
    attendanceCount: 1,
    firstTimers: 0,
  },
  {
    sessionName: "Midweek Prayer",
    date: "2026-04-16",
    branch: "North Branch",
    attendanceCount: 1,
    firstTimers: 0,
  },
];

const insightLines = [
  "Sunday gatherings at the main campus have held steady for three weeks—worth a quiet thank-you to your hosts and follow-up team.",
  "First-time guests are slightly higher in April than March; a short pastoral check-in can turn curiosity into belonging.",
  "North Branch midweek numbers dipped once; pairing a leader visit with a simple outreach reminder usually helps the rhythm return.",
];

function buildTrendFromSessions(sessions: MemberAttendanceSessionRow[]) {
  const buckets = new Map<string, { total: number; guests: number }>();

  for (const session of sessions) {
    const parsed = new Date(session.date);
    if (Number.isNaN(parsed.getTime())) continue;
    const label = parsed.toLocaleDateString("en-GB", { month: "short" });
    const current = buckets.get(label) ?? { total: 0, guests: 0 };
    buckets.set(label, {
      total: current.total + session.attendanceCount,
      guests: current.guests + session.firstTimers,
    });
  }

  return Array.from(buckets.entries()).map(([label, values]) => ({
    label,
    total: values.total,
    guests: values.guests,
  }));
}

const columns: ColumnDef<MemberAttendanceSessionRow>[] = [
  { header: "Session Name", accessorKey: "sessionName" },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const parsed = new Date(row.original.date);
      if (Number.isNaN(parsed.getTime())) return row.original.date;
      return parsed.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  { header: "Branch", accessorKey: "branch" },
  { header: "Attendance Count", accessorKey: "attendanceCount" },
  { header: "First Timers", accessorKey: "firstTimers" },
  {
    header: "Actions",
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
        View
      </Button>
    ),
  },
];

export function AttendancePageView() {
  const { isDemo } = useAuth();
  const attendanceQuery = useApiData("member-attendance-me", fetchMyAttendance, EMPTY_MEMBER_SCOPE);

  const isLinked = attendanceQuery.isLive && attendanceQuery.data.linked;

  const sessionsData = useMemo(() => {
    if (isDemo) return demoSessions;
    if (!isLinked) return [];
    return attendanceQuery.data.items.map((item, index) =>
      mapMyAttendanceHistoryItem(item as Record<string, unknown>, index),
    );
  }, [attendanceQuery.data.items, isDemo, isLinked]);

  const trendData = useMemo(() => {
    if (isDemo) return fallbackTrendData;
    if (!isLinked) return [];
    const built = buildTrendFromSessions(sessionsData);
    return built;
  }, [isDemo, isLinked, sessionsData]);

  const summaryCards = useMemo(() => {
    if (isDemo) {
      return [
        {
          label: "Services this week",
          value: "2",
          detail: "Your recorded attendance",
          icon: CalendarCheck2,
        },
        {
          label: "Services this month",
          value: "8",
          detail: "Your participation history",
          icon: CalendarDays,
        },
        {
          label: "Total sessions",
          value: "24",
          detail: "All time on your record",
          icon: Sparkles,
        },
        {
          label: "Latest attendance",
          value: "Present",
          detail: "Most recent service",
          icon: UserRoundPlus,
        },
      ];
    }

    if (!isLinked) {
      return [
        { label: "Services this week", value: "—", detail: "Your recorded attendance", icon: CalendarCheck2 },
        { label: "Services this month", value: "—", detail: "Your participation history", icon: CalendarDays },
        { label: "Total sessions", value: "—", detail: "All time on your record", icon: Sparkles },
        { label: "Latest attendance", value: "—", detail: "Most recent service", icon: UserRoundPlus },
      ];
    }

    return [
      {
        label: "Services this week",
        value: pickSummaryValue(attendanceQuery.data.summary, ["thisWeek", "weekCount", "sessionsThisWeek"], "0"),
        detail: "Your recorded attendance",
        icon: CalendarCheck2,
      },
      {
        label: "Services this month",
        value: pickSummaryValue(attendanceQuery.data.summary, ["thisMonth", "monthCount", "sessionsThisMonth"], "0"),
        detail: "Your participation history",
        icon: CalendarDays,
      },
      {
        label: "Total sessions",
        value: pickSummaryValue(attendanceQuery.data.summary, ["totalSessions", "total", "count"], "0"),
        detail: "All time on your record",
        icon: Sparkles,
      },
      {
        label: "Latest attendance",
        value: pickSummaryValue(attendanceQuery.data.summary, ["latestStatus", "lastStatus"], "—"),
        detail: "Most recent service",
        icon: UserRoundPlus,
      },
    ];
  }, [attendanceQuery.data.summary, isDemo, isLinked]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sessionsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Attendance"
        description="See your personal participation history and gentle signals for follow-up—without losing the human story behind the numbers."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-10 rounded-xl">
              <ClipboardList className="size-4" aria-hidden />
              Record Attendance
            </Button>
            <Button className="h-10 rounded-xl">
              <CalendarDays className="size-4" aria-hidden />
              Create Service Session
            </Button>
          </div>
        }
      />

      <ApiConnectionNotice
        isLoading={attendanceQuery.isLoading}
        error={attendanceQuery.error}
        isLive={attendanceQuery.isLive}
        liveLabel="Showing your personal attendance from /attendance/me."
      />

      {attendanceQuery.isLive && !attendanceQuery.data.linked ? <MemberLinkedNotice /> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            icon={card.icon}
          />
        ))}
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Attendance trend</CardTitle>
            <CardDescription>
              A simple view of total attendance alongside first-time guests—so leaders
              can notice both consistency and new faces.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total attendance"
                  stroke="oklch(0.488 0.243 264.376)"
                  fill="url(#attendanceTrendFill)"
                  strokeWidth={2.2}
                />
                <Area
                  type="monotone"
                  dataKey="guests"
                  name="First-time guests"
                  stroke="oklch(0.556 0 0)"
                  fill="transparent"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Recent sessions</CardTitle>
            <CardDescription>
              Your personal attendance history—services you have been recorded at.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead className="bg-muted/40">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-2.5 text-left font-medium text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                        {isLinked
                          ? "No attendance history recorded for your profile yet."
                          : isDemo
                            ? "Preview attendance rows appear in demo mode."
                            : "Your attendance history will appear here when /attendance/me loads."}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60 bg-background/55">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Attendance insights</CardTitle>
            <CardDescription>
              Plain-language observations from your recent patterns—preview until analytics are connected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PreviewSectionNotice />
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {insightLines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
