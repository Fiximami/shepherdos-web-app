"use client";

import { CalendarDays, CalendarPlus, ClipboardList, Lightbulb, MapPin, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Upcoming Events", value: "19", note: "Published on calendar" },
  { label: "Registrations This Month", value: "1,842", note: "Across all open events" },
  { label: "Pending Event Suggestions", value: "5", note: "From members · needs review" },
  { label: "Events Needing Volunteers", value: "6", note: "Gaps in rosters" },
] as const;

const tabs = [
  { id: "upcoming" as const, label: "Upcoming" },
  { id: "drafts" as const, label: "Drafts" },
  { id: "pending" as const, label: "Pending Approval" },
  { id: "past" as const, label: "Past Events" },
  { id: "suggested" as const, label: "Suggested by Members" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type EventStatus =
  | "Published"
  | "Draft"
  | "Pending approval"
  | "Ended"
  | "Cancelled"
  | "Suggestion received";

type EventRow = {
  id: string;
  tab: TabId;
  name: string;
  date: string;
  location: string;
  audience: string;
  department: string;
  registrationCount: number;
  status: EventStatus;
};

const allEvents: EventRow[] = [
  {
    id: "e-1",
    tab: "upcoming",
    name: "Combined Easter Service",
    date: "2026-04-27",
    location: "Main Auditorium",
    audience: "All branches",
    department: "Worship & Arts",
    registrationCount: 0,
    status: "Published",
  },
  {
    id: "e-2",
    tab: "upcoming",
    name: "Youth Camp · Arise 2026",
    date: "2026-07-14",
    location: "Regional retreat centre",
    audience: "Youth + leaders",
    department: "Youth Ministry",
    registrationCount: 186,
    status: "Published",
  },
  {
    id: "e-3",
    tab: "upcoming",
    name: "Marriage enrichment evening",
    date: "2026-05-10",
    location: "North Branch hall",
    audience: "Married couples",
    department: "Pastoral Care",
    registrationCount: 42,
    status: "Published",
  },
  {
    id: "e-4",
    tab: "drafts",
    name: "Mid-year prayer & fasting launch",
    date: "2026-06-01",
    location: "TBC",
    audience: "Whole church",
    department: "Prayer Team",
    registrationCount: 0,
    status: "Draft",
  },
  {
    id: "e-5",
    tab: "drafts",
    name: "Community health screening",
    date: "2026-05-24",
    location: "Car park canopy",
    audience: "Public + members",
    department: "Welfare Group",
    registrationCount: 0,
    status: "Draft",
  },
  {
    id: "e-6",
    tab: "pending",
    name: "Men's breakfast · Q2",
    date: "2026-05-03",
    location: "Fellowship hall",
    audience: "Men 18+",
    department: "Men's Ministry",
    registrationCount: 0,
    status: "Pending approval",
  },
  {
    id: "e-7",
    tab: "past",
    name: "Palm Sunday procession",
    date: "2026-04-13",
    location: "Main + satellite route",
    audience: "All welcome",
    department: "Ushering Team",
    registrationCount: 520,
    status: "Ended",
  },
  {
    id: "e-8",
    tab: "past",
    name: "New members class · April",
    date: "2026-04-06",
    location: "Room B2",
    audience: "New members",
    department: "Members Team",
    registrationCount: 38,
    status: "Ended",
  },
  {
    id: "e-9",
    tab: "suggested",
    name: "Neighbourhood clean-up day",
    date: "2026-06-07",
    location: "District 4",
    audience: "Outreach volunteers",
    department: "Evangelism Team",
    registrationCount: 0,
    status: "Suggestion received",
  },
  {
    id: "e-10",
    tab: "suggested",
    name: "Singles fellowship hike",
    date: "2026-05-17",
    location: "Aburi trail",
    audience: "Singles ministry",
    department: "Fellowship Groups",
    registrationCount: 0,
    status: "Suggestion received",
  },
];

const calendarMonth = { year: 2026, monthIndex: 3, label: "April 2026" };

function statusClass(status: EventStatus) {
  const map: Record<EventStatus, string> = {
    Published: "border-emerald-500/30 bg-emerald-950/35 text-emerald-100",
    Draft: "border-stone-500/30 bg-stone-900/45 text-stone-200",
    "Pending approval": "border-amber-500/35 bg-amber-950/40 text-amber-50",
    Ended: "border-sky-500/25 bg-sky-950/30 text-sky-100",
    Cancelled: "border-red-500/25 bg-red-950/35 text-red-100",
    "Suggestion received": "border-violet-500/30 bg-violet-950/35 text-violet-100",
  };
  return map[status];
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startWeekday(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

const eventDates = new Set(
  allEvents.filter((e) => e.tab === "upcoming" || e.tab === "pending" || e.tab === "drafts").map((e) => e.date),
);

const timelineStrip = [
  { date: "2026-04-27", title: "Easter combined", tone: "bg-emerald-500/25 border-emerald-400/30" },
  { date: "2026-05-03", title: "Men's breakfast", tone: "bg-amber-500/20 border-amber-400/25" },
  { date: "2026-05-10", title: "Marriage evening", tone: "bg-sky-500/20 border-sky-400/25" },
  { date: "2026-05-24", title: "Health screening (draft)", tone: "bg-stone-500/25 border-stone-400/25" },
  { date: "2026-07-14", title: "Youth camp", tone: "bg-violet-500/20 border-violet-400/25" },
] as const;

export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("upcoming");
  const [feedback, setFeedback] = useState("");

  const rows = useMemo(() => allEvents.filter((e) => e.tab === activeTab), [activeTab]);

  const { year, monthIndex, label } = calendarMonth;
  const totalDays = daysInMonth(year, monthIndex);
  const pad = startWeekday(year, monthIndex);
  const cells = Array.from({ length: pad + totalDays }, (_, i) => {
    if (i < pad) return { type: "empty" as const };
    const day = i - pad + 1;
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasEvent = eventDates.has(iso);
    return { type: "day" as const, day, iso, hasEvent };
  });

  return (
    <main className="space-y-5 text-[#f3f4f6]">
      <AdminPageHeader
        title="Events Management"
        description="Plan church gatherings, track registrations, and coordinate participation. Official public events are created and published by leaders—members may register and submit suggestions, which convert to events only after approval."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-emerald-400/25 bg-gradient-to-br from-emerald-950/80 to-[#0f1f1a] text-emerald-50 shadow-none hover:from-emerald-900/90 hover:to-[#122520]"
              onClick={() => setFeedback("Add Event opens the official event composer when connected.")}
            >
              <CalendarPlus className="size-4 text-emerald-200/90" aria-hidden />
              Add Event
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-amber-400/25 bg-white/[0.04] text-[#f3f4f6] hover:bg-white/[0.08]"
              onClick={() => {
                setActiveTab("suggested");
                setFeedback("Review Event Suggestions — switched to “Suggested by Members”.");
              }}
            >
              <Lightbulb className="size-4 text-amber-200/85" aria-hidden />
              Review Event Suggestions
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <AdminCard
            key={card.label}
            title={card.label}
            className="border-emerald-500/10 bg-gradient-to-b from-[#10241f]/6 to-transparent"
          >
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-gray-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Event pipeline"
        description="Filter by lifecycle stage. Drafts and suggestions never appear as official until published."
        className="border-white/10"
      >
        <div
          className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0c1820]/50 p-1"
          role="tablist"
          aria-label="Event management views"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150",
                activeTab === t.id
                  ? "bg-emerald-900/50 text-emerald-50 ring-1 ring-emerald-400/25"
                  : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-gray-400">
              <tr>
                {["Event Name", "Date", "Location", "Audience", "Department", "Registration Count", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-sm text-gray-500">
                    No events in this view.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-white/[0.06] bg-white/[0.02]">
                    <td className="px-3 py-2.5 font-medium text-white">{row.name}</td>
                    <td className="px-3 py-2.5 tabular-nums text-gray-300">
                      {new Date(row.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2.5 text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 shrink-0 text-emerald-400/70" aria-hidden />
                        {row.location}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-400">{row.audience}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-emerald-100/90">{row.department}</span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-gray-200">{row.registrationCount.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusClass(row.status))}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex max-w-[320px] flex-wrap gap-1">
                        {(
                          [
                            ["View Details", () => setFeedback(`Details: ${row.name}`)],
                            ["Edit", () => setFeedback(`Edit: ${row.name}`)],
                            ["Assign Department", () => setFeedback(`Assign department: ${row.name}`)],
                            ["Approve", () => setFeedback(`Approve: ${row.name}`)],
                            ["Publish", () => setFeedback(`Publish: ${row.name}`)],
                            ["Cancel", () => setFeedback(`Cancel: ${row.name}`)],
                          ] as const
                        ).map(([label, fn]) => (
                          <button
                            key={label}
                            type="button"
                            onClick={fn}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-gray-300 hover:border-emerald-400/25 hover:bg-white/[0.08]"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AdminCard title="Calendar & timeline" description="April overview with event markers; strip shows the next few milestones." className="border-white/10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,260px)_1fr]">
            <div className="rounded-xl border border-white/10 bg-[#0a1520]/80 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <CalendarDays className="size-4 text-emerald-300/80" aria-hidden />
                {label}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wide text-gray-500">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((c, idx) =>
                  c.type === "empty" ? (
                    <div key={`e-${idx}`} className="aspect-square rounded-md bg-transparent" />
                  ) : (
                    <div
                      key={c.iso}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-md text-xs tabular-nums transition-colors",
                        c.hasEvent
                          ? "bg-emerald-500/15 font-semibold text-emerald-100 ring-1 ring-emerald-400/30"
                          : "text-gray-400 hover:bg-white/[0.04]",
                      )}
                      title={c.hasEvent ? "Has event activity" : undefined}
                    >
                      {c.day}
                    </div>
                  ),
                )}
              </div>
              <p className="mt-2 text-[11px] text-gray-500">Highlighted days tie to drafts, pending, or upcoming in this mock.</p>
            </div>
            <div className="min-h-[140px] space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Upcoming strip</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
                {timelineStrip.map((item) => (
                  <div
                    key={item.date}
                    className={cn(
                      "flex min-w-[140px] flex-1 flex-col rounded-lg border px-3 py-2 transition-transform duration-200 hover:-translate-y-0.5",
                      item.tone,
                    )}
                  >
                    <time className="font-mono text-[11px] text-gray-300">
                      {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </time>
                    <span className="mt-0.5 text-sm font-medium text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Event engagement"
          description="After the room fills, stewardship continues—who came, who needs care."
          className="border-emerald-500/10"
        >
          <ul className="space-y-3 text-sm">
            <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                <Users className="size-3.5 text-emerald-300/80" aria-hidden />
                Registered members
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">746</p>
              <p className="text-xs text-gray-500">Across published events still open</p>
            </li>
            <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                <ClipboardList className="size-3.5 text-sky-300/80" aria-hidden />
                Attendance after event
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">612 checked in</p>
              <p className="text-xs text-gray-500">Last 4 ended events · reconciliation in progress for 2</p>
            </li>
            <li className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                <Lightbulb className="size-3.5 text-amber-200/80" aria-hidden />
                Follow-up needs
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums text-amber-100/90">23</p>
              <p className="text-xs text-gray-500">Registered but not checked in, or first-timer flags</p>
            </li>
          </ul>
        </AdminCard>
      </div>
    </main>
  );
}
