"use client";

import { CalendarPlus, ClipboardList, QrCode, ShieldCheck, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { PreviewSectionNotice, previewDescription } from "@/components/shared/preview-section-notice";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/use-api-data";
import { fetchAttendanceRecords, fetchAttendanceSessions, fetchAttendanceSummary } from "@/lib/api/attendance";
import { pickSummaryValue } from "@/lib/api/formatters";
import { mapApiAttendanceRecord, mapApiAttendanceSession, type SessionRow } from "@/lib/api/mappers";
import { readSmartAttendanceRecords } from "@/lib/smart-attendance-storage";
import { cn } from "@/lib/utils";

const fallbackSummaryCardItems = [
  { label: "Attendance Today", value: "—", note: "Loads from /attendance/summary" },
  { label: "This Week", value: "—", note: "Loads from /attendance/summary" },
  { label: "This Month", value: "—", note: "Loads from /attendance/summary" },
  { label: "First-Time Guests", value: "—", note: "Loads from /attendance/summary" },
  { label: "Absentees Needing Follow-up", value: "—", note: "Loads from /attendance/summary" },
] as const;

const fallbackSessions: SessionRow[] = [];

const weeklyTrend = [
  { week: "W1", total: 2980, guests: 38 },
  { week: "W2", total: 3120, guests: 42 },
  { week: "W3", total: 3055, guests: 35 },
  { week: "W4", total: 3280, guests: 47 },
  { week: "W5", total: 3410, guests: 41 },
  { week: "W6", total: 3360, guests: 39 },
];

const absentees = [
  { name: "Miriam Osei", branch: "Main Campus", missed: "3 consecutive Sundays", followUp: "Care team assigned" },
  { name: "Daniel Kwarteng", branch: "North Branch", missed: "4 midweek sessions", followUp: "Pastor notified" },
  { name: "Grace Nwosu", branch: "South Branch", missed: "3 Sundays", followUp: "Awaiting first call" },
] as const;

type AttendanceStatus = "Verified" | "Late" | "Location Mismatch" | "Manual Override" | "Suspicious Pattern";

type SmartAttendanceRow = {
  member: string;
  event: string;
  timestamp: string;
  location: string;
  status: AttendanceStatus;
  verificationNotes: string;
};

const smartAttendanceRows: SmartAttendanceRow[] = [
  {
    member: "Ruth Eze",
    event: "Sunday Celebration — Main Campus",
    timestamp: "2026-04-27T08:52:00",
    location: "5.6037, -0.1871",
    status: "Verified",
    verificationNotes: "Within time window and accepted radius.",
  },
  {
    member: "Samuel Okoro",
    event: "Youth Gathering",
    timestamp: "2026-04-20T10:18:00",
    location: "5.5978, -0.2418",
    status: "Location Mismatch",
    verificationNotes: "Check-in was outside allowed location radius.",
  },
  {
    member: "Miriam Osei",
    event: "Midweek Prayer",
    timestamp: "2026-04-24T19:40:00",
    location: "5.6035, -0.1887",
    status: "Late",
    verificationNotes: "Arrived outside primary window but still accepted.",
  },
  {
    member: "Daniel Kwarteng",
    event: "Sunday Celebration — South Branch",
    timestamp: "2026-04-20T08:45:00",
    location: "5.5721, -0.3155",
    status: "Suspicious Pattern",
    verificationNotes: "Repeated mismatch and instant check-in behavior detected.",
  },
  {
    member: "Grace Nwosu",
    event: "Sunday Celebration — Main Campus",
    timestamp: "2026-04-20T09:02:00",
    location: "5.6036, -0.1870",
    status: "Manual Override",
    verificationNotes: "Leader corrected status after in-person verification.",
  },
];

function buildWeeklyTrendFromSessions(sessions: SessionRow[]) {
  const buckets = new Map<string, { total: number; guests: number }>();

  for (const session of sessions) {
    const parsed = new Date(session.date);
    if (Number.isNaN(parsed.getTime())) continue;

    const weekStart = new Date(parsed);
    weekStart.setDate(parsed.getDate() - parsed.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    const current = buckets.get(key) ?? { total: 0, guests: 0 };
    current.total += session.totalPresent;
    current.guests += session.firstTimers;
    buckets.set(key, current);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([weekKey, values], index) => ({
      week: `W${index + 1}`,
      total: values.total,
      guests: values.guests,
      sortKey: weekKey,
    }));
}

function smartStatusBadge(status: string) {
  const map: Record<AttendanceStatus, string> = {
    Verified: "border-emerald-500/20 bg-emerald-950/35 text-emerald-100",
    Late: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    "Location Mismatch": "border-rose-500/25 bg-rose-950/35 text-rose-100",
    "Manual Override": "border-sky-500/25 bg-sky-950/35 text-sky-100",
    "Suspicious Pattern": "border-fuchsia-500/25 bg-fuchsia-950/35 text-fuchsia-100",
  };

  if (status in map) {
    return map[status as AttendanceStatus];
  }

  return "border-white/10 bg-white/[0.04] text-gray-300";
}

export default function AdminAttendancePage() {
  const [feedback, setFeedback] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [liveSmartRows, setLiveSmartRows] = useState<SmartAttendanceRow[]>([]);

  const sessionsQuery = useApiData(
    "admin-attendance-sessions",
    async () => {
      const rows = await fetchAttendanceSessions();
      return Array.isArray(rows) ? rows.map(mapApiAttendanceSession) : [];
    },
    fallbackSessions,
  );
  const summaryQuery = useApiData("admin-attendance-summary", fetchAttendanceSummary, {});
  const recordsQuery = useApiData(
    "admin-attendance-records",
    async () => {
      const rows = await fetchAttendanceRecords();
      return Array.isArray(rows) ? rows.map(mapApiAttendanceRecord) : [];
    },
    [],
  );

  const sessions = Array.isArray(sessionsQuery.data) ? sessionsQuery.data : fallbackSessions;
  const summaryCardItems = summaryQuery.isLive
    ? [
        {
          label: "Attendance Today",
          value: pickSummaryValue(summaryQuery.data, ["today", "attendanceToday", "todayCount"]),
          note: "Across recorded services",
        },
        {
          label: "This Week",
          value: pickSummaryValue(summaryQuery.data, ["thisWeek", "weekCount"]),
          note: "Cumulative participation",
        },
        {
          label: "This Month",
          value: pickSummaryValue(summaryQuery.data, ["thisMonth", "monthCount"]),
          note: "All branches combined",
        },
        {
          label: "First-Time Guests",
          value: pickSummaryValue(summaryQuery.data, ["firstTimers", "firstTimeGuests"]),
          note: "This month",
        },
        {
          label: "Absentees Needing Follow-up",
          value: pickSummaryValue(summaryQuery.data, ["absenteesNeedingFollowUp", "followUpNeeded"]),
          note: "Repeated absence pattern",
        },
      ]
    : fallbackSummaryCardItems;

  const sessionRows =
    departmentFilter === "All Departments" ? sessions : sessions.filter((row) => row.department === departmentFilter);

  const trendChartData = useMemo(() => {
    if (!sessionsQuery.isLive) return weeklyTrend;
    const built = buildWeeklyTrendFromSessions(sessions);
    return built.length > 0 ? built : weeklyTrend;
  }, [sessions, sessionsQuery.isLive]);

  const apiRecordRows = recordsQuery.isLive && Array.isArray(recordsQuery.data) ? recordsQuery.data : [];

  const deptAttendance = [
    { dept: "Choir", present: 146 },
    { dept: "Media Team", present: 62 },
    { dept: "Youth Ministry", present: 188 },
    { dept: "Sunday School", present: 74 },
    { dept: "Ushering Team", present: 91 },
  ] as const;
  const trustRows = [
    {
      member: "Ruth Eze",
      score: 92,
      trend: "Stable",
      note: "Mostly verified check-ins within expected time and location bounds.",
    },
    {
      member: "Miriam Osei",
      score: 68,
      trend: "Watch",
      note: "Occasional late confirmations with one manual correction.",
    },
    {
      member: "Samuel Okoro",
      score: 48,
      trend: "Needs Review",
      note: "Repeated location mismatches across recent events.",
    },
    {
      member: "Daniel Kwarteng",
      score: 34,
      trend: "Flagged",
      note: "Suspicious pattern due to mismatch and rapid check-ins.",
    },
  ] as const;

  useEffect(() => {
    const stored = readSmartAttendanceRecords();
    const mapped: SmartAttendanceRow[] = stored.map((record) => ({
      member: record.member_id === "member-001" ? "Current Member (Self Check-In)" : record.member_id,
      event: record.event_id,
      timestamp: record.timestamp,
      location: `${record.location.lat.toFixed(4)}, ${record.location.lng.toFixed(4)}`,
      status: record.status,
      verificationNotes: record.verification_notes,
    }));
    setLiveSmartRows(mapped);
  }, []);

  const mergedSmartRows = useMemo(
    () => [...liveSmartRows, ...(recordsQuery.isLive ? apiRecordRows : smartAttendanceRows)],
    [apiRecordRows, liveSmartRows, recordsQuery.isLive],
  );

  return (
    <main className="space-y-5">
      <ApiConnectionNotice
        isLoading={sessionsQuery.isLoading || summaryQuery.isLoading || recordsQuery.isLoading}
        error={sessionsQuery.error ?? summaryQuery.error ?? recordsQuery.error}
        isLive={sessionsQuery.isLive || summaryQuery.isLive || recordsQuery.isLive}
        liveLabel="Showing live data from /attendance/summary, /attendance/sessions, and /attendance/records."
      />

      <AdminPageHeader
        title="Attendance Management"
        description="Track participation patterns and identify people who may need care."
        actions={
          <>
            <Button className="h-9 rounded-lg" onClick={() => setFeedback("Record Attendance will open when connected.")}>
              <ClipboardList className="size-4" aria-hidden />
              Record Attendance
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-white/15 bg-white/[0.06] text-white"
              onClick={() => setFeedback("Create Service Session will open when connected.")}
            >
              <CalendarPlus className="size-4" aria-hidden />
              Create Service Session
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300">{feedback}</p>
      ) : null}

      <AdminCard
        title="Smart check-in management"
        description={previewDescription("Leadership review area for member self check-ins, validation outcomes, and trust scoring.")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="h-8 rounded-lg border-white/15 bg-white/[0.06] text-white"
            onClick={() => setFeedback("Open smart check-in validation list below.")}
          >
            View Smart Check-Ins
          </Button>
          <Button
            variant="outline"
            className="h-8 rounded-lg border-white/15 bg-white/[0.06] text-white"
            onClick={() => setFeedback("Review flagged members and trust score panels below.")}
          >
            Review Flagged Members
          </Button>
        </div>
      </AdminCard>

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCardItems.map((card) => (
          <AdminCard key={card.label} title={card.label}>
            <p className="text-xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-gray-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Attendance sessions"
        description={
          sessionsQuery.isLive
            ? "Official counts from /attendance/sessions."
            : "Official counts — sign in to load /attendance/sessions."
        }
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Department filter:</span>
          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="h-8 rounded-lg border border-white/10 bg-[#11263b] px-2.5 text-xs text-white outline-none"
          >
            {["All Departments", "Choir", "Media Team", "Youth Ministry", "Prayer Team", "Ushering Team", "Sunday School"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-white/[0.06] text-gray-300">
              <tr>
                {["Service/Event", "Date", "Branch", "Department", "Total Present", "First-Timers", "Recorded By", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {sessionRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-400">
                    {sessionsQuery.isLive ? "No attendance sessions recorded yet." : "Sessions will appear here when /attendance/sessions loads."}
                  </td>
                </tr>
              ) : (
                sessionRows.map((row) => (
                <tr key={row.id} className="border-t border-white/10 bg-white/[0.03]">
                  <td className="px-3 py-2 font-medium text-white">{row.service}</td>
                  <td className="px-3 py-2 text-gray-300">
                    {new Date(row.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2 text-gray-300">{row.branch}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-amber-100/90">{row.department}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-gray-200">{row.totalPresent}</td>
                  <td className="px-3 py-2 tabular-nums text-gray-200">{row.firstTimers}</td>
                  <td className="px-3 py-2 text-gray-300">{row.recordedBy}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View session: ${row.service} (${row.date})`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-gray-300 hover:bg-white/[0.08]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Edit session: ${row.service}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-gray-300 hover:bg-white/[0.08]"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard title="Attendance by department" description={previewDescription("Quick view of participation signals across ministry departments.")}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {deptAttendance.map((row) => (
            <div key={row.dept} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <p className="text-sm font-medium text-white">{row.dept}</p>
              <p className="mt-1 text-xs text-gray-400">Attendance this week</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-amber-100/90">{row.present}</p>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="Participation trend"
        description={
          sessionsQuery.isLive
            ? "Weekly totals derived from /attendance/sessions."
            : previewDescription("Weekly total attendance with first-time guest overlay.")
        }
      >
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="adminAttendanceTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59 130 246 / 0.35)" stopOpacity={1} />
                  <stop offset="100%" stopColor="rgb(59 130 246 / 0.05)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="adminAttendanceGuests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(250 204 21 / 0.28)" stopOpacity={1} />
                  <stop offset="100%" stopColor="rgb(250 204 21 / 0.05)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} width={44} />
              <Tooltip
                formatter={(value, name) => {
                  const n = typeof value === "number" ? value : Number(value ?? 0);
                  const label = name === "total" ? "Total present" : "First-time guests";
                  return [`${n.toLocaleString()}`, label];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(16, 38, 59, 0.95)",
                  color: "#fff",
                }}
              />
              <Area type="monotone" dataKey="total" stroke="rgb(96 165 250)" fill="url(#adminAttendanceTotal)" strokeWidth={2} />
              <Area type="monotone" dataKey="guests" stroke="rgb(250 204 21)" fill="url(#adminAttendanceGuests)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Absentee care"
          description={previewDescription("People who may need a gentle check-in after repeated absence—not a blame list, but a care signal.")}
        >
          <PreviewSectionNotice message="Preview only — absentee follow-up lists are not connected to a backend endpoint yet." />
          <ul className="space-y-2">
            {absentees.map((row) => (
              <li
                key={row.name}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-gray-300"
              >
                <span className="font-medium text-white">{row.name}</span>
                <span className="text-gray-500"> · {row.branch}</span>
                <p className="mt-0.5 text-xs text-gray-400">{row.missed}</p>
                <p className="mt-1 text-xs text-amber-100/90">Follow-up: {row.followUp}</p>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard
          title="Controlled check-in (future)"
          description="Attendance stays accurate when only approved leaders record counts, or when members use time-bound, verified check-in—not open self-marking."
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <QrCode className="mt-0.5 size-5 shrink-0 text-amber-200/90" aria-hidden />
              <div>
                <p className="text-sm font-medium text-white">QR check-in</p>
                <p className="text-xs text-gray-400">
                  Placeholder for session-scoped QR codes that expire after the service window.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-200/90" aria-hidden />
              <div>
                <p className="text-sm font-medium text-white">Leader verification</p>
                <p className="text-xs text-gray-400">
                  Placeholder for leader-approved check-ins tied to roster or gate verification.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <Timer className="mt-0.5 size-5 shrink-0 text-emerald-200/85" aria-hidden />
              <div>
                <p className="text-sm font-medium text-white">Time-window validation</p>
                <p className="text-xs text-gray-400">
                  Placeholder for accepting check-ins only during defined pre- and post-service windows.
                </p>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard
        title="Smart member check-in validation"
        description={
          recordsQuery.isLive
            ? "Validated attendance records from /attendance/records, plus any local self check-ins on this device."
            : previewDescription("Validated attendance records with trust signals from time, location, and behavior checks.")
        }
      >
        {!recordsQuery.isLive ? (
          <PreviewSectionNotice message="Preview rows below until /attendance/records loads. Local self check-ins from this browser still appear when present." />
        ) : null}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="bg-white/[0.06] text-gray-300">
              <tr>
                {["Member", "Event", "Timestamp", "Location (lat/long)", "Status", "Verification Notes"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mergedSmartRows.map((row) => (
                <tr key={`${row.member}-${row.timestamp}`} className="border-t border-white/10 bg-white/[0.03]">
                  <td className="px-3 py-2 text-white">{row.member}</td>
                  <td className="px-3 py-2 text-gray-300">{row.event}</td>
                  <td className="px-3 py-2 text-gray-300">
                    {new Date(row.timestamp).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-400">{row.location}</td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", smartStatusBadge(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{row.verificationNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Flagged / suspicious members"
          description={previewDescription("Basic pattern detection flags repeated mismatch, instant check-ins, and inconsistent attendance behavior.")}
        >
          <ul className="space-y-2">
            {mergedSmartRows
              .filter((row) => row.status === "Location Mismatch" || row.status === "Suspicious Pattern")
              .map((row) => (
                <li key={`${row.member}-${row.event}`} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-gray-300">
                  <span className="font-medium text-white">{row.member}</span> · {row.event}
                  <p className="mt-1 text-xs text-amber-100/90">{row.status}</p>
                  <p className="mt-1 text-xs text-gray-400">{row.verificationNotes}</p>
                </li>
              ))}
          </ul>
        </AdminCard>

        <AdminCard
          title="Location mismatch indicators"
          description={previewDescription("Entries requiring leader review before attendance trust score is increased.")}
        >
          <ul className="space-y-2">
            {mergedSmartRows
              .filter((row) => row.status === "Location Mismatch")
              .map((row) => (
                <li key={`${row.member}-${row.timestamp}`} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-gray-300">
                  <span className="font-medium text-white">{row.member}</span>
                  <p className="mt-1 text-xs text-gray-400">Location: {row.location}</p>
                  <p className="mt-1 text-xs text-rose-100/90">{row.verificationNotes}</p>
                </li>
              ))}
          </ul>
        </AdminCard>
      </div>

      <AdminCard
        title="Member trust score review"
        description={previewDescription("Simple confidence scoring for attendance integrity to help leadership prioritize review and pastoral follow-up.")}
      >
        <PreviewSectionNotice message="Preview only — trust scores are not connected to a backend endpoint yet." />
        <div className="space-y-2.5">
          {trustRows.map((row) => (
            <div key={row.member} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{row.member}</p>
                <span className="text-xs text-amber-100/90">{row.score}% · {row.trend}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full",
                    row.score >= 75 ? "bg-emerald-500/70" : row.score >= 50 ? "bg-amber-500/70" : "bg-rose-500/70",
                  )}
                  style={{ width: `${row.score}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">{row.note}</p>
            </div>
          ))}
        </div>
      </AdminCard>
    </main>
  );
}
