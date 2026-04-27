"use client";

import { Bell, BellRing, CalendarClock, Shield, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Active Notifications", value: "24", note: "Live across channels" },
  { label: "Scheduled Reminders", value: "19", note: "Queued for send windows" },
  { label: "Unread Notices", value: "1,240", note: "Member aggregate (mock)" },
  { label: "Failed Deliveries", value: "6", note: "Retry or manual follow-up" },
] as const;

const categories = [
  { label: "Announcements", hint: "Church-wide and branch notices" },
  { label: "Events", hint: "Registrations and reminders" },
  { label: "Giving Receipts", hint: "Post-giving confirmations" },
  { label: "Prayer Updates", hint: "Care-sensitive routing" },
  { label: "System Alerts", hint: "Maintenance and account" },
  { label: "Leadership Alerts", hint: "Role-scoped urgency" },
] as const;

type NotifStatus = "Live" | "Scheduled" | "Paused" | "Failed";

type NotifRow = {
  id: string;
  title: string;
  audience: string;
  type: string;
  channel: string;
  status: NotifStatus;
  scheduledDate: string | null;
};

const notifications: NotifRow[] = [
  {
    id: "n-1",
    title: "Sunday service · earlier start this week",
    audience: "All members",
    type: "Announcement",
    channel: "Push + in-app",
    status: "Live",
    scheduledDate: null,
  },
  {
    id: "n-2",
    title: "Youth camp payment due in 7 days",
    audience: "Registered families",
    type: "Events",
    channel: "Email + in-app",
    status: "Scheduled",
    scheduledDate: "2026-04-29T09:00:00",
  },
  {
    id: "n-3",
    title: "Your giving receipt is ready",
    audience: "Contributors (last batch)",
    type: "Giving Receipts",
    channel: "Email",
    status: "Live",
    scheduledDate: null,
  },
  {
    id: "n-4",
    title: "Prayer team · new assigned request",
    audience: "Intercessors",
    type: "Prayer Updates",
    channel: "In-app",
    status: "Live",
    scheduledDate: null,
  },
  {
    id: "n-5",
    title: "Planned maintenance · Tue 02:00",
    audience: "Admins + tech contacts",
    type: "System Alerts",
    channel: "Email",
    status: "Scheduled",
    scheduledDate: "2026-05-05T01:45:00",
  },
  {
    id: "n-6",
    title: "Board papers available",
    audience: "Trustees & elders",
    type: "Leadership Alerts",
    channel: "In-app",
    status: "Paused",
    scheduledDate: "2026-05-01T08:00:00",
  },
  {
    id: "n-7",
    title: "Midweek prayer reminder",
    audience: "North branch",
    type: "Events",
    channel: "SMS",
    status: "Failed",
    scheduledDate: "2026-04-26T14:00:00",
  },
];

function statusPill(status: NotifStatus) {
  const map: Record<NotifStatus, string> = {
    Live: "border-slate-400/25 bg-slate-800/50 text-slate-100",
    Scheduled: "border-sky-400/25 bg-sky-950/40 text-sky-100",
    Paused: "border-amber-400/25 bg-amber-950/35 text-amber-100",
    Failed: "border-rose-400/20 bg-rose-950/30 text-rose-100",
  };
  return map[status];
}

export default function AdminNotificationsPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5">
      <AdminPageHeader
        title="Notifications Management"
        description="Keep members and teams informed through timely, meaningful alerts—without overwhelming the inbox or the spirit of the app."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-slate-400/20 bg-slate-800/60 text-white shadow-none hover:bg-slate-700/70"
              onClick={() => setFeedback("Create Notification opens the editor when connected.")}
            >
              <Bell className="size-4 text-slate-200" aria-hidden />
              Create Notification
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-slate-500/25 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              onClick={() => setFeedback("Schedule Reminder opens the scheduler when connected.")}
            >
              <CalendarClock className="size-4 text-sky-200/80" aria-hidden />
              Schedule Reminder
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-white/10">
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard title="Notification categories" description="Group alerts by intent so routing and tone stay consistent." className="border-white/10">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setFeedback(`Filter by category: ${cat.label}`)}
              className={cn(
                "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left transition-colors",
                "hover:border-sky-400/20 hover:bg-white/[0.06]",
              )}
            >
              <p className="text-sm font-medium text-white">{cat.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{cat.hint}</p>
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Notifications" description="Scannable list—title first, metadata second." className="border-white/10">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-slate-500">
              <tr>
                {["Title", "Audience", "Type", "Channel", "Status", "Scheduled Date", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notifications.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="max-w-[280px] px-3 py-2.5 font-medium text-white">{row.title}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.audience}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.type}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.channel}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusPill(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-500">
                    {row.scheduledDate
                      ? new Date(row.scheduledDate).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View: ${row.title}`)}
                        className="rounded border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-400 hover:border-slate-400/30 hover:text-slate-200"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Edit: ${row.title}`)}
                        className="rounded border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-400 hover:border-slate-400/30 hover:text-slate-200"
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

      <AdminCard
        title="Role-based alert settings"
        description="Who receives leadership and system alerts—quiet defaults, loud only when necessary."
        className="border-white/10"
      >
        <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-500/25 bg-slate-950/25 px-4 py-5 sm:flex-row sm:items-start">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Shield className="size-5 text-slate-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="size-4 text-slate-500" aria-hidden />
              <p className="text-sm font-medium text-white">Routing matrix (placeholder)</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Future controls: elders vs staff vs ministry heads, quiet hours, escalation paths for prayer and giving
              anomalies, and opt-down (not opt-out of essential account mail) where policy allows.
            </p>
            <button
              type="button"
              onClick={() => setFeedback("Role-based alert settings will open when connected.")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-300/90 hover:text-sky-200"
            >
              <BellRing className="size-3.5" aria-hidden />
              Configure routing
            </button>
          </div>
        </div>
      </AdminCard>
    </main>
  );
}
