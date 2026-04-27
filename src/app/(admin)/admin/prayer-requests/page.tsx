"use client";

import { CheckCircle2, HeartHandshake, Sparkles, UserRound, Users } from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "New Requests", value: "14", note: "Since last service day" },
  { label: "Private Requests", value: "9", note: "Leaders-only visibility" },
  { label: "Assigned to Care Team", value: "31", note: "Someone is walking with them" },
  { label: "Awaiting Response", value: "12", note: "Needs a gentle touch soon" },
  { label: "Responded This Week", value: "47", note: "Acknowledged in prayer or care" },
] as const;

type Visibility = "Community" | "Leaders only" | "Private";
type RequestStatus = "New" | "In prayer" | "Assigned" | "Responded" | "Escalated";

type PrayerRow = {
  id: string;
  requester: string;
  visibility: Visibility;
  category: string;
  assignedTeam: string;
  status: RequestStatus;
  date: string;
};

const requests: PrayerRow[] = [
  {
    id: "pr-1",
    requester: "M.K. (member)",
    visibility: "Private",
    category: "Family · health",
    assignedTeam: "Women’s care",
    status: "Assigned",
    date: "2026-04-27",
  },
  {
    id: "pr-2",
    requester: "Brother T.",
    visibility: "Leaders only",
    category: "Faith · anxiety",
    assignedTeam: "—",
    status: "New",
    date: "2026-04-27",
  },
  {
    id: "pr-3",
    requester: "Sister A.",
    visibility: "Community",
    category: "Gratitude · answered prayer",
    assignedTeam: "Prayer chain",
    status: "In prayer",
    date: "2026-04-26",
  },
  {
    id: "pr-4",
    requester: "Anonymous",
    visibility: "Private",
    category: "Marriage · counselling",
    assignedTeam: "Pastoral triage",
    status: "Escalated",
    date: "2026-04-25",
  },
  {
    id: "pr-5",
    requester: "Youth member",
    visibility: "Leaders only",
    category: "School · exams",
    assignedTeam: "Youth leaders",
    status: "Responded",
    date: "2026-04-24",
  },
];

const workload = [
  { team: "Prayer chain", open: 8, note: "Rotating coverage through Sunday" },
  { team: "Women’s care", open: 5, note: "Two visits scheduled this week" },
  { team: "Pastoral triage", open: 3, note: "Includes one escalated case" },
  { team: "Youth leaders", open: 4, note: "Light load · good response times" },
] as const;

const pastoralFollowUps = [
  {
    title: "Private · marriage support",
    detail: "Escalated request pr-4 — senior pastor aware; first pastoral call within 48h.",
    tone: "border-violet-400/20 bg-violet-950/25",
  },
  {
    title: "Leaders only · ongoing anxiety",
    detail: "Brother T. — assign a named companion; avoid public prayer lists.",
    tone: "border-sky-400/20 bg-sky-950/20",
  },
  {
    title: "Community · testimony follow-up",
    detail: "Sister A. — optional thank-you note from care desk; no pressure to share more.",
    tone: "border-emerald-400/20 bg-emerald-950/20",
  },
] as const;

function visibilityBadge(v: Visibility) {
  const map: Record<Visibility, string> = {
    Community: "border-emerald-400/20 bg-emerald-950/30 text-emerald-100",
    "Leaders only": "border-amber-400/20 bg-amber-950/30 text-amber-50",
    Private: "border-violet-400/25 bg-violet-950/35 text-violet-100",
  };
  return map[v];
}

function statusBadge(s: RequestStatus) {
  const map: Record<RequestStatus, string> = {
    New: "border-sky-400/20 bg-sky-950/30 text-sky-100",
    Assigned: "border-indigo-400/20 bg-indigo-950/30 text-indigo-100",
    "In prayer": "border-fuchsia-400/20 bg-fuchsia-950/25 text-fuchsia-100",
    Responded: "border-emerald-400/20 bg-emerald-950/30 text-emerald-100",
    Escalated: "border-rose-400/20 bg-rose-950/30 text-rose-100",
  };
  return map[s];
}

export default function AdminPrayerRequestsPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.06),transparent_50%)]" aria-hidden />

      <AdminPageHeader
        title="Prayer Requests Management"
        description="Respond to care needs with privacy, compassion, and structure. Names and details stay proportionate to visibility—care first, always."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-violet-400/25 bg-gradient-to-br from-violet-950/60 to-[#0f1729] text-violet-50 shadow-none hover:from-violet-900/70 hover:to-[#121c30]"
              onClick={() => setFeedback("Assign Care Team opens the assignment drawer when connected.")}
            >
              <Users className="size-4 text-violet-200/90" aria-hidden />
              Assign Care Team
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-sky-400/25 bg-white/[0.05] text-white hover:bg-white/[0.09]"
              onClick={() => setFeedback("Mark Responded will confirm selected requests when connected.")}
            >
              <CheckCircle2 className="size-4 text-sky-200/90" aria-hidden />
              Mark Responded
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-violet-400/15 bg-violet-950/20 px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard
            key={card.label}
            title={card.label}
            className="border-violet-400/10 bg-gradient-to-b from-violet-950/15 to-transparent"
          >
            <p className="text-xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Privacy-aware request list"
        description="Requester labels respect confidentiality. Full text opens only in the secure detail view."
        className="border-white/10"
      >
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                {["Requester", "Visibility", "Category", "Assigned Team", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06] bg-white/[0.02]">
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-2 font-medium text-white">
                      <UserRound className="size-4 text-violet-300/70" aria-hidden />
                      {row.requester}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", visibilityBadge(row.visibility))}>
                      {row.visibility}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">{row.category}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.assignedTeam}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusBadge(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[340px] flex-wrap gap-1">
                      {(
                        [
                          ["View", () => setFeedback(`View secure detail: ${row.id}`)],
                          ["Assign", () => setFeedback(`Assign team: ${row.id}`)],
                          ["Mark In Prayer", () => setFeedback(`Mark in prayer: ${row.id}`)],
                          ["Mark Responded", () => setFeedback(`Mark responded: ${row.id}`)],
                          ["Escalate to Pastor", () => setFeedback(`Escalate: ${row.id}`)],
                        ] as const
                      ).map(([label, fn]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={fn}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-violet-400/30 hover:bg-violet-950/25"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard
          title="Care team workload"
          description="A gentle snapshot of who is carrying what—so no one team is overwhelmed in silence."
          className="border-sky-400/10 bg-gradient-to-br from-sky-950/10 to-transparent"
        >
          <ul className="space-y-2">
            {workload.map((w) => (
              <li
                key={w.team}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-sky-400/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="size-4 shrink-0 text-sky-300/80" aria-hidden />
                    <span className="font-medium text-white">{w.team}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-sky-100">
                    {w.open} open
                  </span>
                </div>
                <p className="mt-1 pl-6 text-xs text-slate-400">{w.note}</p>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard
          title="Pastoral follow-up"
          description="Rhythm of care after prayer—not a backlog to clear, but people to honour."
          className="border-violet-400/10 bg-gradient-to-br from-violet-950/15 to-transparent"
        >
          <ul className="space-y-2">
            {pastoralFollowUps.map((item) => (
              <li key={item.title} className={cn("rounded-xl border px-3 py-2.5", item.tone)}>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Sparkles className="size-4 text-amber-200/80" aria-hidden />
                  {item.title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.detail}</p>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </main>
  );
}
