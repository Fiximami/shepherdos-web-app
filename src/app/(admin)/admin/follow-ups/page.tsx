"use client";

import { ClipboardCheck, MessageCircleHeart, UserCheck } from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Pending Follow-ups", value: "24", note: "New care actions waiting review" },
  { label: "In Progress", value: "13", note: "Assigned and currently being handled" },
  { label: "Completed", value: "41", note: "Closed this month with care notes" },
  { label: "Overdue", value: "6", note: "Past due date and needs attention" },
] as const;

type Priority = "Urgent" | "Normal" | "Low";
type WorkflowStatus = "Pending" | "Assigned" | "In Progress" | "Completed";

type FollowUpRow = {
  id: string;
  member: string;
  triggerSource: string;
  department: string;
  priority: Priority;
  assignedTo: string;
  status: WorkflowStatus;
  dueDate: string;
};

const queueRows: FollowUpRow[] = [
  {
    id: "f-1",
    member: "Miriam Osei",
    triggerSource: "First-time visitor",
    department: "Members Team",
    priority: "Normal",
    assignedTo: "Hosts Team · K. Ampofo",
    status: "Assigned",
    dueDate: "2026-04-30",
  },
  {
    id: "f-2",
    member: "Daniel K.",
    triggerSource: "Member inactive (missed services)",
    department: "Pastoral Care",
    priority: "Urgent",
    assignedTo: "Pastoral Care · R. Eze",
    status: "In Progress",
    dueDate: "2026-04-28",
  },
  {
    id: "f-3",
    member: "Anonymous",
    triggerSource: "Prayer request submitted",
    department: "Prayer Team",
    priority: "Normal",
    assignedTo: "Prayer Follow-up Team",
    status: "Pending",
    dueDate: "2026-05-01",
  },
  {
    id: "f-4",
    member: "Youth Member",
    triggerSource: "Counselling request submitted",
    department: "Counselling Desk",
    priority: "Urgent",
    assignedTo: "Counselling Desk · D. Afolabi",
    status: "Assigned",
    dueDate: "2026-04-29",
  },
  {
    id: "f-5",
    member: "Grace Nwosu",
    triggerSource: "Event no-show",
    department: "Events Team",
    priority: "Low",
    assignedTo: "Events Team · S. Okoro",
    status: "Completed",
    dueDate: "2026-04-25",
  },
];

const careInsights = [
  "5 first-timers need follow-up.",
  "8 members inactive for 3 weeks.",
  "3 counselling requests are awaiting assignment.",
] as const;

function priorityBadge(priority: Priority) {
  const styles: Record<Priority, string> = {
    Urgent: "border-rose-500/20 bg-rose-950/35 text-rose-100",
    Normal: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    Low: "border-slate-500/20 bg-slate-900/45 text-slate-300",
  };
  return styles[priority];
}

function statusBadge(status: WorkflowStatus) {
  const styles: Record<WorkflowStatus, string> = {
    Pending: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    Assigned: "border-sky-500/25 bg-sky-950/35 text-sky-100",
    "In Progress": "border-indigo-500/25 bg-indigo-950/35 text-indigo-100",
    Completed: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
  };
  return styles[status];
}

export default function AdminFollowUpsPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5 text-[#e8edf5]">
      <AdminPageHeader
        title="Follow-up Management"
        description="Track member care actions triggered by attendance, prayer, counselling, and event signals with pastoral structure."
      />

      {feedback ? (
        <p className="rounded-lg border border-amber-500/15 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-amber-500/10 bg-[#0a1426]/90">
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Follow-up queue"
        description="Care actions in sequence: Pending → Assigned → In Progress → Completed."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Member", "Trigger Source", "Department", "Priority", "Assigned To", "Status", "Due Date", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queueRows.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.member}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.triggerSource}</td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-amber-100/90">{row.department}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", priorityBadge(row.priority))}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{row.assignedTo}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusBadge(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[360px] flex-wrap gap-1">
                      {(
                        [
                          ["Assign to leader", `Assign to leader: ${row.member}`],
                          ["Assign by department", `Assign by department: ${row.member} (${row.department})`],
                          ["Change status", `Change status: ${row.member}`],
                          ["Add note", `Add note (placeholder): ${row.member}`],
                          ["Mark completed", `Mark completed: ${row.member}`],
                        ] as const
                      ).map(([label, message]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setFeedback(message)}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
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

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Care insight panel"
          description="Guidance cues for pastoral follow-up priorities."
          className="border-amber-500/10 bg-[#080f1c]/95"
        >
          <ul className="space-y-2.5">
            {careInsights.map((line) => (
              <li key={line} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 font-medium text-white">
                  <MessageCircleHeart className="size-4 text-amber-200/80" aria-hidden />
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard
          title="Workflow support"
          description="Status transitions and ownership reminders for calm, structured care."
          className="border-white/10 bg-[#080f1c]/95"
        >
          <div className="space-y-2 text-sm text-slate-300">
            <p className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
              <span className="font-medium text-white">Pending</span> items are newly raised triggers awaiting ownership.
            </p>
            <p className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
              <span className="font-medium text-white">Assigned</span> means a leader has accepted responsibility.
            </p>
            <p className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
              <span className="font-medium text-white">In Progress</span> means contact/follow-up has started.
            </p>
            <p className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
              <span className="font-medium text-white">Completed</span> records care actions that were followed through.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
              <UserCheck className="size-3.5 text-amber-200/70" aria-hidden />
              This is a pastoral care queue, not a ticketing board.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 h-8 border-white/15 bg-transparent text-slate-200 hover:bg-white/[0.06]"
              onClick={() => setFeedback("Bulk care assignment placeholder opened.")}
            >
              <ClipboardCheck className="size-3.5" aria-hidden />
              Bulk assign follow-ups
            </Button>
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
