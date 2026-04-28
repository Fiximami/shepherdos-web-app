"use client";

import { CalendarPlus, ClipboardList, QrCode, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";

const summaryCards = [
  { label: "Attendance Today", value: "912", note: "Across recorded services" },
  { label: "This Week", value: "3,441", note: "Cumulative participation" },
  { label: "This Month", value: "12,860", note: "All branches combined" },
  { label: "First-Time Guests", value: "47", note: "This month" },
  { label: "Absentees Needing Follow-up", value: "27", note: "Repeated absence pattern" },
] as const;

type SessionRow = {
  id: string;
  service: string;
  date: string;
  branch: string;
  department: string;
  totalPresent: number;
  firstTimers: number;
  recordedBy: string;
};

const sessions: SessionRow[] = [
  {
    id: "s-1",
    service: "Sunday Celebration",
    date: "2026-04-27",
    branch: "Main Campus",
    department: "Choir",
    totalPresent: 412,
    firstTimers: 6,
    recordedBy: "Ps. Emmanuel Boateng",
  },
  {
    id: "s-2",
    service: "Midweek Prayer",
    date: "2026-04-24",
    branch: "North Branch",
    department: "Prayer Team",
    totalPresent: 118,
    firstTimers: 2,
    recordedBy: "Deborah Afolabi",
  },
  {
    id: "s-3",
    service: "Youth Gathering",
    date: "2026-04-20",
    branch: "Main Campus",
    department: "Youth Ministry",
    totalPresent: 94,
    firstTimers: 5,
    recordedBy: "Samuel Okoro",
  },
  {
    id: "s-4",
    service: "Sunday Celebration",
    date: "2026-04-20",
    branch: "South Branch",
    department: "Ushering Team",
    totalPresent: 267,
    firstTimers: 4,
    recordedBy: "Ruth Eze",
  },
];

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

export default function AdminAttendancePage() {
  const [feedback, setFeedback] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");

  const sessionRows =
    departmentFilter === "All Departments" ? sessions : sessions.filter((row) => row.department === departmentFilter);

  const deptAttendance = [
    { dept: "Choir", present: 146 },
    { dept: "Media Team", present: 62 },
    { dept: "Youth Ministry", present: 188 },
    { dept: "Sunday School", present: 74 },
    { dept: "Ushering Team", present: 91 },
  ] as const;

  return (
    <main className="space-y-5">
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

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label}>
            <p className="text-xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-gray-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Attendance sessions"
        description="Official counts recorded by approved leaders. Members do not self-mark attendance here."
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
              {sessionRows.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard title="Attendance by department" description="Quick view of participation signals across ministry departments (mock).">
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

      <AdminCard title="Participation trend" description="Weekly total attendance with first-time guest overlay (mock).">
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
          description="People who may need a gentle check-in after repeated absence—not a blame list, but a care signal."
        >
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
    </main>
  );
}
