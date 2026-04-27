"use client";

import {
  Calendar,
  CalendarClock,
  FileBarChart,
  FileText,
  HandHeart,
  HeartPulse,
  Landmark,
  Mail,
  Users,
} from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Membership Reports",
    description: "Growth, households, first-timers, and follow-up coverage.",
    icon: Users,
  },
  {
    title: "Attendance Reports",
    description: "Participation by service, branch, and period.",
    icon: Calendar,
  },
  {
    title: "Finance Reports",
    description: "Income, expenditure, and ledger-aligned summaries.",
    icon: Landmark,
  },
  {
    title: "Giving Reports",
    description: "Contributions by category—pairs with Finance, not a substitute.",
    icon: HandHeart,
  },
  {
    title: "Events Reports",
    description: "Registrations, attendance, and ministry outcomes.",
    icon: FileBarChart,
  },
  {
    title: "Prayer/Care Reports",
    description: "Requests, response times, and pastoral follow-up (privacy-aware).",
    icon: HeartPulse,
  },
  {
    title: "Communication Reports",
    description: "Reach, delivery, and official announcements activity.",
    icon: Mail,
  },
  {
    title: "Leadership Summary Reports",
    description: "One-pack overview for elders, trustees, and pastors.",
    icon: FileText,
  },
] as const;

type ReportStatus = "Final" | "Draft" | "Under review";

type RecentRow = {
  id: string;
  name: string;
  category: string;
  createdBy: string;
  date: string;
  status: ReportStatus;
};

const recentReports: RecentRow[] = [
  {
    id: "r-1",
    name: "Monthly attendance · April 2026",
    category: "Attendance Reports",
    createdBy: "Operations · K. Boateng",
    date: "2026-04-26",
    status: "Final",
  },
  {
    id: "r-2",
    name: "Giving summary · Q1 2026",
    category: "Giving Reports",
    createdBy: "Finance desk · A. Mensah",
    date: "2026-04-25",
    status: "Final",
  },
  {
    id: "r-3",
    name: "Membership movement · branches",
    category: "Membership Reports",
    createdBy: "Admin · J. Ampofo",
    date: "2026-04-24",
    status: "Under review",
  },
  {
    id: "r-4",
    name: "Leadership summary · March pack",
    category: "Leadership Summary Reports",
    createdBy: "Exec pastor",
    date: "2026-04-22",
    status: "Draft",
  },
];

function statusPill(status: ReportStatus) {
  const map: Record<ReportStatus, string> = {
    Final: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Draft: "border-slate-500/30 bg-slate-900/50 text-slate-200",
    "Under review": "border-amber-500/25 bg-amber-950/35 text-amber-50",
  };
  return map[status];
}

export default function AdminReportsPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5 text-[#e8eaef]">
      <AdminPageHeader
        title="Reports"
        description="Prepare clear reports for leadership review, accountability, and planning."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-slate-400/20 bg-[#141c2a] text-white shadow-none hover:bg-[#1a2435]"
              onClick={() => setFeedback("Generate Report opens the builder when connected.")}
            >
              <FileBarChart className="size-4 text-slate-300" aria-hidden />
              Generate Report
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-amber-500/20 bg-[#0f1624] text-[#f8fafc] hover:bg-[#151d2e]"
              onClick={() => setFeedback("Export PDF will queue downloads when connected.")}
            >
              <FileText className="size-4 text-amber-200/85" aria-hidden />
              Export PDF
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-[#0f1624] px-3 py-2 text-xs text-slate-400">{feedback}</p>
      ) : null}

      <AdminCard
        title="Report categories"
        description="Structured outputs suitable for board, pastoral, and ministry review."
        className="border-white/10 bg-[#0c1220]/90"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => setFeedback(`Open category: ${cat.title}`)}
                className={cn(
                  "flex gap-3 rounded-xl border border-white/[0.08] bg-[#111a2c] p-3 text-left transition-colors",
                  "hover:border-amber-500/20 hover:bg-[#141f34]",
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0c1220]">
                  <Icon className="size-5 text-amber-200/75" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{cat.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{cat.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard title="Recent reports" description="Latest generated packs and their review state." className="border-white/10 bg-[#0c1220]/90">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0f1624]">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0c1220] text-slate-500">
              <tr>
                {["Report Name", "Category", "Created By", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.name}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.category}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.createdBy}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-500">
                    {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusPill(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View: ${row.name}`)}
                        className="rounded border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-400 hover:border-slate-400/30 hover:text-slate-200"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Download: ${row.name}`)}
                        className="rounded border border-white/10 bg-transparent px-2 py-1 text-[11px] text-slate-400 hover:border-slate-400/30 hover:text-slate-200"
                      >
                        Download
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
        title="Scheduled reports"
        description="Automated generation and distribution for recurring governance rhythms—configure when connected."
        className="border-dashed border-amber-500/20 bg-[#0c1220]/80"
      >
        <div className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#0f1624] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0c1220]">
              <CalendarClock className="size-5 text-amber-200/70" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-white">No schedules configured (preview)</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Typical: monthly leadership summary, quarterly giving pack, weekly attendance snapshot for pastors.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 shrink-0 border-white/15 bg-transparent text-slate-300 hover:bg-white/[0.06]"
            onClick={() => setFeedback("Scheduled reports settings open when connected.")}
          >
            Configure schedule
          </Button>
        </div>
      </AdminCard>
    </main>
  );
}
