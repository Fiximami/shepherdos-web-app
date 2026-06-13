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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { fetchAttendanceSessions, fetchAttendanceSummary } from "@/lib/api/attendance";
import { pickSummaryValue } from "@/lib/api/formatters";
import {
  mapMemberAttendanceSessionRow,
  type MemberAttendanceSessionRow,
} from "@/lib/api/mappers";

const fallbackTrendData = [
  { label: "Jan", total: 298, guests: 14 },
  { label: "Feb", total: 312, guests: 18 },
  { label: "Mar", total: 305, guests: 12 },
  { label: "Apr", total: 328, guests: 22 },
  { label: "May", total: 341, guests: 19 },
  { label: "Jun", total: 336, guests: 16 },
];

const fallbackSessions: MemberAttendanceSessionRow[] = [
  {
    sessionName: "Sunday Celebration",
    date: "2026-04-20",
    branch: "Main Campus",
    attendanceCount: 412,
    firstTimers: 6,
  },
  {
    sessionName: "Midweek Prayer",
    date: "2026-04-16",
    branch: "North Branch",
    attendanceCount: 118,
    firstTimers: 2,
  },
  {
    sessionName: "Youth Gathering",
    date: "2026-04-13",
    branch: "Main Campus",
    attendanceCount: 94,
    firstTimers: 5,
  },
  {
    sessionName: "Sunday Celebration",
    date: "2026-04-13",
    branch: "South Branch",
    attendanceCount: 267,
    firstTimers: 4,
  },
  {
    sessionName: "Workers' Briefing",
    date: "2026-04-10",
    branch: "Main Campus",
    attendanceCount: 56,
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
  const sessionsQuery = useApiData(
    "member-attendance-sessions",
    async () => (await fetchAttendanceSessions()).map(mapMemberAttendanceSessionRow),
    fallbackSessions,
  );
  const summaryQuery = useApiData("member-attendance-summary", fetchAttendanceSummary, {});

  const sessionsData = sessionsQuery.data;
  const trendData = useMemo(() => {
    if (!sessionsQuery.isLive) return fallbackTrendData;
    const built = buildTrendFromSessions(sessionsData);
    return built.length > 0 ? built : fallbackTrendData;
  }, [sessionsData, sessionsQuery.isLive]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Attendance Today",
        value: pickSummaryValue(summaryQuery.data, ["today", "attendanceToday", "todayCount"], "284"),
        detail: "Across recorded services so far",
        icon: CalendarCheck2,
      },
      {
        label: "This Week",
        value: pickSummaryValue(summaryQuery.data, ["thisWeek", "weekCount"], "947"),
        detail: "Including midweek and youth",
        icon: CalendarDays,
      },
      {
        label: "This Month",
        value: pickSummaryValue(summaryQuery.data, ["thisMonth", "monthCount"], "3,892"),
        detail: "Steady pace compared to last month",
        icon: Sparkles,
      },
      {
        label: "First-Time Guests",
        value: pickSummaryValue(summaryQuery.data, ["firstTimers", "firstTimeGuests"], "22"),
        detail: "Invited into follow-up this month",
        icon: UserRoundPlus,
      },
    ],
    [summaryQuery.data],
  );

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
        description="See how your church is gathering—participation, care moments, and gentle signals for follow-up—without losing the human story behind the numbers."
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
        isLoading={sessionsQuery.isLoading || summaryQuery.isLoading}
        error={sessionsQuery.error ?? summaryQuery.error}
        isLive={sessionsQuery.isLive || summaryQuery.isLive}
      />

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
              A short list of recent gatherings—enough context to plan care, not enough
              noise to overwhelm.
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
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60 bg-background/55">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
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
              Plain-language observations from recent patterns—written the way a
              thoughtful leader might speak after reviewing the week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
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
