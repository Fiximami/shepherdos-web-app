"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  CircleAlert,
  Mail,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  Radio,
  Send,
  Smartphone,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Active Announcements", value: "11", note: "Live on dashboards and feeds" },
  { label: "SMS Sent This Week", value: "2,840", note: "Broadcast + transactional" },
  { label: "Emails Sent This Month", value: "18,200", note: "Campaigns and system mail" },
  { label: "Scheduled Messages", value: "16", note: "SMS, email, and in-app" },
  { label: "Unread Member Messages", value: "58", note: "Awaiting staff response" },
] as const;

const channels = [
  {
    title: "SMS Broadcast",
    description: "Send urgent updates, event reminders, and ministry alerts.",
    icon: Smartphone,
    accent: "from-orange-500/25 to-amber-600/10",
    iconClass: "text-orange-200",
  },
  {
    title: "Email Campaigns",
    description: "Send newsletters, church updates, and structured communication.",
    icon: Mail,
    accent: "from-rose-500/20 to-orange-500/10",
    iconClass: "text-rose-200",
  },
  {
    title: "In-App Messages",
    description: "Direct messages to members, groups, or ministry teams.",
    icon: MessageCircle,
    accent: "from-amber-500/20 to-stone-500/10",
    iconClass: "text-amber-100",
  },
  {
    title: "Official Announcements",
    description: "Admin-approved communication visible across member dashboards.",
    icon: Megaphone,
    accent: "from-orange-400/20 to-amber-800/15",
    iconClass: "text-orange-100",
  },
  {
    title: "Community Feed",
    description: "Member-led sharing, testimonies, updates, and moderated posts.",
    icon: MessagesSquare,
    accent: "from-stone-400/15 to-orange-500/10",
    iconClass: "text-stone-200",
  },
] as const;

type AnnouncementRow = {
  id: string;
  title: string;
  audience: string;
  channel: string;
  status: "Live" | "Scheduled" | "Draft";
  scheduledDate: string | null;
  createdBy: string;
};

const announcements: AnnouncementRow[] = [
  {
    id: "a-1",
    title: "Easter combined service · traffic and parking",
    audience: "All branches",
    channel: "Announcement + SMS",
    status: "Live",
    scheduledDate: null,
    createdBy: "Comms · Lydia Mensah",
  },
  {
    id: "a-2",
    title: "Annual general meeting · papers and quorum",
    audience: "Leaders + workers",
    channel: "Email + in-app",
    status: "Scheduled",
    scheduledDate: "2026-05-02T09:00:00",
    createdBy: "Admin · Joseph Boateng",
  },
  {
    id: "a-3",
    title: "Youth camp registration closes Friday",
    audience: "Youth ministry + parents",
    channel: "Announcement + feed pin",
    status: "Live",
    scheduledDate: null,
    createdBy: "Youth Office · Sam Okoro",
  },
  {
    id: "a-4",
    title: "Water baptism orientation",
    audience: "First-timers + hosts",
    channel: "In-app + email",
    status: "Draft",
    scheduledDate: "2026-05-08T18:30:00",
    createdBy: "Pastoral care · Ruth Eze",
  },
];

const scheduledMessages = [
  { id: "sch-1", channel: "SMS", subject: "Sunday reminder · 9:00 service", when: "2026-04-27T07:30:00", audience: "Main campus · all members" },
  { id: "sch-2", channel: "Email", subject: "May stewardship letter", when: "2026-05-01T08:00:00", audience: "Giving partners segment" },
  { id: "sch-3", channel: "In-app", subject: "Workers briefing deck", when: "2026-04-28T19:00:00", audience: "Usher team + hospitality" },
] as const;

const audienceFilters = [
  "All Members",
  "Department",
  "Branch",
  "Ministry/Group",
  "Workers",
  "First-Timers",
  "Leaders",
  "Custom Segment",
] as const;

const deliveryLogSummary = [
  { status: "Sent" as const, count: 12400, note: "Accepted by provider / queued" },
  { status: "Delivered" as const, count: 11820, note: "Confirmed delivery where supported" },
  { status: "Failed" as const, count: 94, note: "Invalid numbers, bounces, or blocks" },
  { status: "Scheduled" as const, count: 16, note: "Waiting on send window" },
] as const;

type CommunicationLogStatus = "Sent" | "Scheduled" | "Failed";
type CommunicationLogChannel = "SMS" | "Email" | "In-app" | "Announcement";

type CommunicationLogRow = {
  id: string;
  title: string;
  channel: CommunicationLogChannel;
  audience: string;
  status: CommunicationLogStatus;
  date: string;
  createdBy: string;
};

const communicationLogs: CommunicationLogRow[] = [
  {
    id: "log-1",
    title: "Sunday service reminder",
    channel: "SMS",
    audience: "All Members · Main Campus",
    status: "Sent",
    date: "2026-04-27T07:30:00",
    createdBy: "Comms · Lydia Mensah",
  },
  {
    id: "log-2",
    title: "May stewardship letter",
    channel: "Email",
    audience: "Giving partners segment",
    status: "Scheduled",
    date: "2026-05-01T08:00:00",
    createdBy: "Finance Desk · A. Mensah",
  },
  {
    id: "log-3",
    title: "Workers briefing deck",
    channel: "In-app",
    audience: "Usher team + hospitality",
    status: "Sent",
    date: "2026-04-28T19:00:00",
    createdBy: "Admin · Joseph Boateng",
  },
  {
    id: "log-4",
    title: "Baptism orientation notice",
    channel: "Announcement",
    audience: "First-timers + hosts",
    status: "Failed",
    date: "2026-04-26T17:00:00",
    createdBy: "Pastoral care · Ruth Eze",
  },
  {
    id: "log-5",
    title: "Youth camp registration close",
    channel: "SMS",
    audience: "Youth ministry + parents",
    status: "Scheduled",
    date: "2026-04-29T09:00:00",
    createdBy: "Youth Office · Sam Okoro",
  },
];

const departmentAudiences = [
  { name: "Choir", members: 34, channel: "In-app + WhatsApp" },
  { name: "Media Team", members: 19, channel: "In-app + Email" },
  { name: "Youth Ministry", members: 118, channel: "SMS + In-app" },
  { name: "Ushering Team", members: 42, channel: "SMS" },
] as const;

function statusPill(status: AnnouncementRow["status"]) {
  const map: Record<AnnouncementRow["status"], string> = {
    Live: "border-emerald-500/30 bg-emerald-950/40 text-emerald-100",
    Scheduled: "border-amber-500/30 bg-amber-950/40 text-amber-50",
    Draft: "border-stone-500/30 bg-stone-900/50 text-stone-200",
  };
  return map[status];
}

function logStatusPill(status: CommunicationLogStatus) {
  const map: Record<CommunicationLogStatus, string> = {
    Sent: "border-emerald-500/30 bg-emerald-950/40 text-emerald-100",
    Scheduled: "border-amber-500/30 bg-amber-950/40 text-amber-50",
    Failed: "border-rose-500/30 bg-rose-950/40 text-rose-100",
  };
  return map[status];
}

export default function AdminCommunicationPage() {
  const canCreateAnnouncements = hasPermission("announcements:create");
  const canSendMessages = hasPermission("messages:send");
  const canAccessCommunication = hasAnyPermission(["announcements:create", "messages:send"]);
  const [feedback, setFeedback] = useState("");
  const [activeAudience, setActiveAudience] = useState<string>("All Members");
  const [logChannelFilter, setLogChannelFilter] = useState<CommunicationLogChannel | "All">("All");
  const [logStatusFilter, setLogStatusFilter] = useState<CommunicationLogStatus | "All">("All");
  const [logDateFilter, setLogDateFilter] = useState("");

  const visibleCommunicationLogs = useMemo(() => {
    return communicationLogs.filter((row) => {
      if (logChannelFilter !== "All" && row.channel !== logChannelFilter) return false;
      if (logStatusFilter !== "All" && row.status !== logStatusFilter) return false;
      if (logDateFilter && !row.date.startsWith(logDateFilter)) return false;
      return true;
    });
  }, [logChannelFilter, logDateFilter, logStatusFilter]);

  return (
    <main className="space-y-5 text-[#f4f0eb]">
      <AdminPageHeader
        title="Communication Center"
        description="Coordinate official church communication across SMS, email, in-app messages, announcements, and community updates. Channels work together—communication is not only announcements."
        actions={
          <>
            {canCreateAnnouncements ? (
              <Button
                className="h-9 rounded-lg border border-orange-400/25 bg-gradient-to-br from-[#2a1810]/90 to-[#1a1410] text-[#fef7ed] shadow-none hover:from-[#352018] hover:to-[#221a12]"
                onClick={() => setFeedback("Create Announcement composer opens when connected.")}
              >
                <Megaphone className="size-4 text-orange-200/90" aria-hidden />
                Create Announcement
              </Button>
            ) : null}
            {canSendMessages ? (
              <>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-stone-500/25 bg-[#1c1612]/80 text-[#f4f0eb] hover:bg-[#261f1a]"
                  onClick={() => setFeedback("Send Broadcast wizard opens when connected.")}
                >
                  <Radio className="size-4 text-orange-200/80" aria-hidden />
                  Send Broadcast
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-stone-500/20 bg-[#1c1612]/80 text-[#f4f0eb] hover:bg-[#261f1a]"
                  onClick={() => setFeedback("Schedule Message opens when connected.")}
                >
                  <CalendarClock className="size-4 text-stone-300" aria-hidden />
                  Schedule Message
                </Button>
              </>
            ) : null}
          </>
        }
      />

      {!canAccessCommunication ? (
        <p className="rounded-lg border border-stone-500/20 bg-[#1c1612]/90 px-3 py-2 text-xs text-stone-300">
          Communication actions are hidden until `announcements:create` or `messages:send` permission is granted.
        </p>
      ) : null}

      {feedback ? (
        <p className="rounded-lg border border-stone-500/20 bg-[#1c1612]/90 px-3 py-2 text-xs text-stone-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard
            key={card.label}
            title={card.label}
            className="border-stone-500/15 bg-gradient-to-b from-[#231c18]/95 to-[#181310]/95 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.55)]"
          >
            <p className="text-xl font-semibold tracking-tight text-[#fef7ed]">{card.value}</p>
            <p className="mt-1 text-xs text-stone-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Channels"
        description="Every lane has a purpose. Use the right channel for urgency, depth, and community voice."
        className="border-stone-500/15 bg-gradient-to-b from-[#1f1814]/95 to-[#14110e]/95"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {channels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.title}
                type="button"
                style={{ animationDelay: `${i * 55}ms` }}
                onClick={() => setFeedback(`${ch.title} workspace opens when connected.`)}
                className={cn(
                  "shepherd-fade-in group relative overflow-hidden rounded-xl border border-stone-500/15 bg-[#1c1612]/90 p-3 text-left",
                  "transition-[transform,border-color,box-shadow] duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-orange-400/25 hover:shadow-[0_14px_32px_-20px_rgba(0,0,0,0.65)]",
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    "bg-gradient-to-br",
                    ch.accent,
                  )}
                  aria-hidden
                />
                <div className="relative flex flex-col gap-2.5">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl border border-stone-500/20 bg-[#14100d]/90",
                      "transition-transform duration-200 ease-out group-hover:scale-[1.03]",
                    )}
                  >
                    <Icon className={cn("size-5", ch.iconClass)} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#fef7ed]">{ch.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-400">{ch.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard
        title="Recent official announcements"
        description="Admin-approved items visible where members expect authority—not the same as informal feed posts."
        className="border-stone-500/15 bg-[#1a1511]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-stone-500/15 bg-[#14100d]/80">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="border-b border-stone-500/15 bg-[#1c1612] text-stone-400">
              <tr>
                {["Title", "Audience", "Channel", "Status", "Scheduled date", "Created by", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {announcements.map((row) => (
                <tr key={row.id} className="border-t border-stone-500/10">
                  <td className="max-w-[240px] px-3 py-2.5 font-medium text-[#f4f0eb]">{row.title}</td>
                  <td className="px-3 py-2.5 text-stone-400">{row.audience}</td>
                  <td className="px-3 py-2.5 text-stone-300">{row.channel}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusPill(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-stone-400">
                    {row.scheduledDate
                      ? new Date(row.scheduledDate).toLocaleString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-stone-400">{row.createdBy}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFeedback(`Preview: ${row.title}`)}
                        className="rounded-md border border-stone-500/20 bg-[#1c1612] px-2 py-1 text-[11px] text-stone-300 hover:border-orange-400/25"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Edit: ${row.title}`)}
                        className="rounded-md border border-stone-500/20 bg-[#1c1612] px-2 py-1 text-[11px] text-stone-300 hover:border-orange-400/25"
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

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard title="Scheduled messages" description="SMS, email, and in-app notices in the outbound queue." className="border-stone-500/15 bg-[#1a1511]/95">
          <ul className="space-y-2">
            {scheduledMessages.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-stone-500/15 bg-[#14100d]/90 px-3 py-2.5 transition-colors hover:border-orange-400/20"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-orange-200/80">{m.channel}</p>
                  <p className="mt-0.5 text-sm text-[#f4f0eb]">{m.subject}</p>
                  <p className="mt-1 text-xs text-stone-500">{m.audience}</p>
                </div>
                <time className="shrink-0 font-mono text-xs text-stone-400">
                  {new Date(m.when).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard
          title="Audience targeting"
          description="Start from a segment before composing—reduces noise and respects consent."
          className="border-stone-500/15 bg-[#1a1511]/95"
        >
          <div className="flex flex-wrap gap-2">
            {audienceFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setActiveAudience(f);
                  setFeedback(`Targeting preset: ${f} — composer uses this when connected.`);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-[transform,background-color,border-color] duration-150",
                  activeAudience === f
                    ? "border-orange-400/35 bg-orange-950/45 text-orange-50"
                    : "border-stone-500/20 bg-[#14100d]/90 text-stone-300 hover:border-stone-400/30",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Selected: <span className="text-stone-300">{activeAudience}</span>
          </p>
        </AdminCard>
      </div>

      <AdminCard
        title="Department audiences"
        description="Target communication by department without sending noise to the full church body."
        className="border-stone-500/15 bg-[#1a1511]/95"
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {departmentAudiences.map((row) => (
            <button
              key={row.name}
              type="button"
              onClick={() => setFeedback(`Target department audience: ${row.name}`)}
              className="rounded-lg border border-stone-500/15 bg-[#14100d]/90 px-3 py-2.5 text-left transition-colors hover:border-orange-400/25"
            >
              <p className="text-sm font-medium text-[#f4f0eb]">{row.name}</p>
              <p className="mt-1 text-xs text-stone-500">{row.members} members</p>
              <p className="mt-1 text-[11px] text-orange-200/80">{row.channel}</p>
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="Communication Log"
        description="Unified audit trail across message channels with clear delivery indicators."
        className="border-stone-500/15 bg-[#1a1511]/95"
      >
        <div className="space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs text-stone-500">Channel</span>
              <select
                value={logChannelFilter}
                onChange={(event) => setLogChannelFilter(event.target.value as CommunicationLogChannel | "All")}
                className="h-9 w-full rounded-lg border border-stone-500/20 bg-[#14100d]/90 px-3 text-sm text-stone-200 outline-none focus:border-orange-400/30"
              >
                {["All", "SMS", "Email", "In-app", "Announcement"].map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs text-stone-500">Status</span>
              <select
                value={logStatusFilter}
                onChange={(event) => setLogStatusFilter(event.target.value as CommunicationLogStatus | "All")}
                className="h-9 w-full rounded-lg border border-stone-500/20 bg-[#14100d]/90 px-3 text-sm text-stone-200 outline-none focus:border-orange-400/30"
              >
                {["All", "Sent", "Scheduled", "Failed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs text-stone-500">Date</span>
              <input
                type="date"
                value={logDateFilter}
                onChange={(event) => setLogDateFilter(event.target.value)}
                className="h-9 w-full rounded-lg border border-stone-500/20 bg-[#14100d]/90 px-3 text-sm text-stone-200 outline-none focus:border-orange-400/30"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryLogSummary.map((row) => (
              <div
                key={row.status}
                className="rounded-xl border border-stone-500/15 bg-[#14100d]/90 p-3 transition-[transform,border-color] duration-200 hover:border-orange-400/20"
              >
                <div className="flex items-center gap-2">
                  <Send className="size-4 shrink-0 text-orange-200/70" aria-hidden />
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{row.status}</p>
                </div>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-[#fef7ed]">{row.count.toLocaleString()}</p>
                <p className="mt-1 text-xs text-stone-500">{row.note}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-500/15 bg-[#14100d]/80">
            <table className="w-full min-w-[960px] border-collapse text-sm">
              <thead className="border-b border-stone-500/15 bg-[#1c1612] text-stone-400">
                <tr>
                  {["Message Title", "Channel", "Audience", "Status", "Date", "Created By"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleCommunicationLogs.length === 0 ? (
                  <tr className="border-t border-stone-500/10">
                    <td colSpan={6} className="px-3 py-8 text-center text-xs text-stone-500">
                      No communication logs match the current filters.
                    </td>
                  </tr>
                ) : (
                  visibleCommunicationLogs.map((row) => (
                    <tr key={row.id} className="border-t border-stone-500/10">
                      <td className="px-3 py-2.5 font-medium text-[#f4f0eb]">{row.title}</td>
                      <td className="px-3 py-2.5 text-stone-300">{row.channel}</td>
                      <td className="px-3 py-2.5 text-stone-400">{row.audience}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium", logStatusPill(row.status))}>
                          {row.status === "Sent" ? <CheckCircle2 className="size-3.5" aria-hidden /> : null}
                          {row.status === "Scheduled" ? <Clock3 className="size-3.5" aria-hidden /> : null}
                          {row.status === "Failed" ? <CircleAlert className="size-3.5" aria-hidden /> : null}
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-stone-400">
                        {new Date(row.date).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-stone-400">{row.createdBy}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>

      <p className="flex items-start gap-2 rounded-lg border border-stone-500/15 bg-[#14100d]/85 px-3 py-2.5 text-xs leading-relaxed text-stone-500">
        <Users className="mt-0.5 size-4 shrink-0 text-orange-200/60" aria-hidden />
        <span>
          Official announcements, SMS and email broadcasts, direct messages, and the <strong className="font-medium text-stone-400">community feed</strong>{" "}
          (moderation and visibility) are all part of one stewardship picture—keep each channel intentional.
        </span>
      </p>
    </main>
  );
}
