"use client";

import { CalendarDays, Lock, ShieldCheck, UserRound, Users } from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Pending Requests", value: "16", note: "Awaiting first review" },
  { label: "Scheduled Sessions", value: "11", note: "Confirmed this week" },
  { label: "Urgent Requests", value: "4", note: "Needs same-day triage" },
  { label: "Completed This Month", value: "29", note: "Care cycle closed" },
  { label: "Unassigned Requests", value: "6", note: "Needs counsellor assignment" },
] as const;

type Urgency = "Normal" | "Soon" | "Urgent";
type RequestStatus = "Pending" | "Scheduled" | "Completed" | "Cancelled";

type CounsellingRow = {
  id: string;
  member: string;
  type: string;
  urgency: Urgency;
  preferredDate: string;
  assignedCounsellor: string;
  status: RequestStatus;
};

const requests: CounsellingRow[] = [
  {
    id: "c-1",
    member: "Miriam Osei",
    type: "Family",
    urgency: "Soon",
    preferredDate: "2026-04-30",
    assignedCounsellor: "Ps. Joseph Boateng",
    status: "Scheduled",
  },
  {
    id: "c-2",
    member: "Daniel K.",
    type: "Youth / Career",
    urgency: "Normal",
    preferredDate: "2026-05-01",
    assignedCounsellor: "Youth Counsellor · D. Afolabi",
    status: "Pending",
  },
  {
    id: "c-3",
    member: "Anonymous",
    type: "Marriage / Relationship",
    urgency: "Urgent",
    preferredDate: "2026-04-28",
    assignedCounsellor: "Pending assignment",
    status: "Pending",
  },
  {
    id: "c-4",
    member: "Sister A.",
    type: "Grief / Bereavement",
    urgency: "Soon",
    preferredDate: "2026-04-25",
    assignedCounsellor: "Care Team Lead · Ruth Eze",
    status: "Completed",
  },
];

const counsellorAvailability = [
  { role: "Pastor", name: "Ps. Joseph Boateng", availability: "Tue, Thu · 4:00 PM – 7:00 PM", openSlots: 4 },
  { role: "Elder", name: "Elder K. Boateng", availability: "Wed · 5:00 PM – 8:00 PM", openSlots: 3 },
  { role: "Youth Counsellor", name: "Deborah Afolabi", availability: "Fri · 3:00 PM – 6:00 PM", openSlots: 5 },
  { role: "Marriage Counsellor", name: "Grace Nwosu", availability: "Sat · 10:00 AM – 1:00 PM", openSlots: 2 },
  { role: "Care Team Lead", name: "Ruth Eze", availability: "Mon–Thu · 9:00 AM – 12:00 PM", openSlots: 6 },
] as const;

const followUpRows = [
  { title: "Sessions needing follow-up", value: "7", note: "Post-session check-in due within 72 hours." },
  { title: "Members awaiting response", value: "6", note: "No assigned counsellor yet." },
  { title: "Recurring counselling cases", value: "5", note: "Require continuity and periodic pastoral review." },
] as const;

function urgencyBadge(u: Urgency) {
  const map: Record<Urgency, string> = {
    Normal: "border-slate-500/20 bg-slate-900/40 text-slate-200",
    Soon: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    Urgent: "border-rose-500/25 bg-rose-950/40 text-rose-100",
  };
  return map[u];
}

function statusBadge(s: RequestStatus) {
  const map: Record<RequestStatus, string> = {
    Pending: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    Scheduled: "border-sky-500/25 bg-sky-950/35 text-sky-100",
    Completed: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Cancelled: "border-slate-500/20 bg-slate-900/45 text-slate-300",
  };
  return map[s];
}

export default function AdminCounsellingPage() {
  const canViewCounselling = hasPermission("counselling:view");
  const canManageCounselling = hasPermission("counselling:manage");
  const canAccessCounselling = hasAnyPermission(["counselling:view", "counselling:manage"]);
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5 text-[#e8edf5]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(59,130,246,0.06),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(250,204,21,0.05),transparent_50%)]"
        aria-hidden
      />

      <AdminPageHeader
        title="Counselling Management"
        description="Coordinate pastoral care requests with privacy, wisdom, and structure."
        actions={
          <div className="flex flex-wrap gap-2">
            {canManageCounselling ? (
              <>
                <Button
                  className="h-9 rounded-lg border border-amber-500/25 bg-[#0f1a2e] text-amber-50 shadow-none hover:bg-[#152238]"
                  onClick={() => setFeedback("Assign Counsellor opens assignment workflow when connected.")}
                >
                  <Users className="size-4 text-amber-200/85" aria-hidden />
                  Assign Counsellor
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-white/15 bg-white/[0.06] text-white"
                  onClick={() => setFeedback("Schedule Session opens booking calendar when connected.")}
                >
                  <CalendarDays className="size-4 text-slate-200" aria-hidden />
                  Schedule Session
                </Button>
              </>
            ) : null}
            {canViewCounselling ? (
              <Button
                variant="outline"
                className="h-9 rounded-lg border-white/15 bg-white/[0.06] text-white"
                onClick={() => setFeedback("View Calendar opens counselling calendar when connected.")}
              >
                <CalendarDays className="size-4 text-slate-200" aria-hidden />
                View Calendar
              </Button>
            ) : null}
          </div>
        }
      />

      {!canAccessCounselling ? (
        <p className="rounded-lg border border-white/10 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">
          Counselling actions are hidden until `counselling:view` or `counselling:manage` permission is granted.
        </p>
      ) : null}

      {feedback ? (
        <p className="rounded-lg border border-amber-500/15 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-amber-500/10 bg-[#0a1426]/90">
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Counselling requests"
        description="Sensitive queue for authorized pastors and care leaders. Handle with discretion and prayerful care."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Member", "Type", "Urgency", "Preferred Date", "Assigned Counsellor", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.member}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.type}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", urgencyBadge(row.urgency))}>
                      {row.urgency}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.preferredDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{row.assignedCounsellor}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusBadge(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {canManageCounselling ? (
                      <div className="flex max-w-[340px] flex-wrap gap-1">
                        {(
                          [
                            "View Request",
                            "Assign Counsellor",
                            "Schedule Session",
                            "Mark Completed",
                            "Cancel / Reschedule",
                          ] as const
                        ).map((action) => (
                          <button
                            key={action}
                            type="button"
                            onClick={() => setFeedback(`${action}: ${row.member} (${row.type})`)}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Restricted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Counsellor availability"
          description="Current mock availability across pastoral and care roles."
          className="border-amber-500/10 bg-[#080f1c]/95"
        >
          <ul className="space-y-2">
            {counsellorAvailability.map((item) => (
              <li key={item.role} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{item.role}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.availability}</p>
                  </div>
                  <span className="rounded-full border border-sky-500/20 bg-sky-950/30 px-2 py-0.5 text-xs tabular-nums text-sky-100">
                    {item.openSlots} open
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard
            title="Confidential notes"
            description="Protected section placeholder"
            className="border-dashed border-white/20 bg-[#080f1c]/95"
          >
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-3 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2 font-medium text-white">
                <Lock className="size-4 text-amber-200/85" aria-hidden />
                Confidential session notes — visible only to authorized care leaders.
              </p>
              <p className="mt-1.5 text-xs text-slate-500">
                Session records, prayer notes, and safeguarding comments will live in this secure area when connected.
              </p>
            </div>
          </AdminCard>

          <AdminCard
            title="Care follow-up"
            description="Ongoing care signals for leaders to revisit after sessions."
            className="border-white/10 bg-[#080f1c]/95"
          >
            <ul className="space-y-2">
              {followUpRows.map((row) => (
                <li key={row.title} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
                  <p className="text-sm font-medium text-white">{row.title}</p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums text-amber-100/90">{row.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{row.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheck className="size-3.5 text-amber-200/70" aria-hidden />
              Care continuity remains private to approved leadership roles.
            </p>
          </AdminCard>
        </div>
      </div>
    </main>
  );
}
