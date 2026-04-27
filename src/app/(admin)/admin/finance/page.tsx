"use client";

import {
  ArrowLeftRight,
  Banknote,
  BookMarked,
  ClipboardCheck,
  FileBarChart,
  FileStack,
  Landmark,
  PiggyBank,
  Receipt,
  Scale,
  ScrollText,
  Shield,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Total Income", value: "GHS 428,640", note: "Recorded in ledgers this period" },
  { label: "Total Expenses", value: "GHS 291,180", note: "Posted after categorisation" },
  { label: "Net Balance", value: "GHS 137,460", note: "Income less expenditure" },
  { label: "Pending Approvals", value: "7", note: "Awaiting reviewer or final sign-off" },
  { label: "Budget Health", value: "On track", note: "Ministry lines within tolerance" },
] as const;

const accountingModules = [
  { title: "Cash & Bank Ledgers", description: "Primary accounts, journals, and posting controls.", icon: Landmark },
  { title: "Income & Expenditure", description: "Classify inflows and outflows for stewardship reporting.", icon: ArrowLeftRight },
  { title: "Payment & Receipt Tracking", description: "Evidence trail for every disbursement and deposit.", icon: Receipt },
  { title: "Bank Reconciliation", description: "Match statements to system balances with variance review.", icon: Scale },
  { title: "Petty Cash Management", description: "Float limits, retirements, and custodian accountability.", icon: Wallet },
  { title: "Budget Control", description: "Envelope lines, commitments, and overspend alerts.", icon: PiggyBank },
  { title: "Audit Trail", description: "Immutable history of who changed what and when.", icon: ScrollText },
  { title: "Approval Workflow", description: "Tiered authority for sensitive transactions.", icon: Shield },
] as const;

type TxRow = {
  id: string;
  reference: string;
  type: "Income" | "Expense";
  category: string;
  amount: string;
  method: string;
  recordedBy: string;
  approvalStatus: "Approved" | "Pending L2" | "Pending L1" | "Rejected";
  date: string;
};

const transactions: TxRow[] = [
  {
    id: "t-1",
    reference: "TX-2026-04182",
    type: "Income",
    category: "Tithes & offerings (general)",
    amount: "GHS 24,500.00",
    method: "Bank transfer",
    recordedBy: "Finance Desk · A. Mensah",
    approvalStatus: "Approved",
    date: "2026-04-26",
  },
  {
    id: "t-2",
    reference: "TX-2026-04179",
    type: "Expense",
    category: "Utilities · electricity",
    amount: "GHS 8,420.00",
    method: "Direct debit",
    recordedBy: "Operations · K. Boateng",
    approvalStatus: "Pending L2",
    date: "2026-04-25",
  },
  {
    id: "t-3",
    reference: "TX-2026-04171",
    type: "Expense",
    category: "Ministry · youth camp deposit",
    amount: "GHS 15,000.00",
    method: "Cheque",
    recordedBy: "Youth Office · D. Osei",
    approvalStatus: "Pending L1",
    date: "2026-04-24",
  },
  {
    id: "t-4",
    reference: "TX-2026-04168",
    type: "Income",
    category: "Facility hire income",
    amount: "GHS 3,200.00",
    method: "Cash (banked)",
    recordedBy: "Finance Desk · A. Mensah",
    approvalStatus: "Approved",
    date: "2026-04-23",
  },
];

const pendingApprovals = [
  {
    ref: "TX-2026-04179",
    summary: "Utilities · electricity — GHS 8,420.00",
    levels: "L1 approved · Awaiting treasurer (L2)",
  },
  {
    ref: "TX-2026-04171",
    summary: "Youth camp deposit — GHS 15,000.00",
    levels: "Awaiting ministry head (L1)",
  },
  {
    ref: "TX-2026-04165",
    summary: "Repairs · roofing partial — GHS 22,100.00",
    levels: "L1 approved · Awaiting board finance (L3)",
  },
] as const;

const auditEntries = [
  {
    action: "Transaction amended",
    detail: "TX-2026-04160 · category corrected from Supplies to Repairs",
    whoRecorded: "J. Ampofo",
    whoApproved: "— (pending)",
    when: "2026-04-26 09:14",
  },
  {
    action: "Approval granted",
    detail: "TX-2026-04158 · L2 sign-off by treasurer",
    whoRecorded: "A. Mensah",
    whoApproved: "R. Eze (Treasurer)",
    when: "2026-04-25 16:02",
  },
  {
    action: "New journal line",
    detail: "Bank charges allocated to Admin · GHS 185.00",
    whoRecorded: "A. Mensah",
    whoApproved: "Auto-post (policy)",
    when: "2026-04-25 08:41",
  },
] as const;

const reportCards = [
  { title: "Income & Expenditure Statement", blurb: "Period P&L for leadership review." },
  { title: "Balance Sheet", blurb: "Assets, liabilities, and net position." },
  { title: "Cash Flow Statement", blurb: "Operating, investing, and financing movement." },
  { title: "Trial Balance", blurb: "Debit and credit integrity before close." },
  { title: "Giving Summary", blurb: "Member giving mapped to ledger lines (not a substitute for full accounts)." },
  { title: "Expense Report", blurb: "Spend by ministry line and vendor." },
] as const;

function statusBadge(status: TxRow["approvalStatus"]) {
  const styles: Record<TxRow["approvalStatus"], string> = {
    Approved: "border-emerald-500/25 bg-emerald-950/40 text-emerald-200/90",
    "Pending L1": "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
    "Pending L2": "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
    Rejected: "border-red-500/20 bg-red-950/35 text-red-200/90",
  };
  return styles[status];
}

export default function AdminFinancePage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5 text-[#e8edf5]">
      <AdminPageHeader
        title="Finance Management"
        description="Steward church resources with transparency, accuracy, approvals, and audit-ready reports. This workspace is for accounting and controls—not the same as member Giving (contributions), which feeds into ledgers under defined rules."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-amber-500/25 bg-[#0f1a2e] text-amber-50 shadow-none hover:bg-[#152238]"
              onClick={() => setFeedback("Record Transaction will open the journal entry flow when connected.")}
            >
              <Banknote className="size-4 text-amber-200/90" aria-hidden />
              Record Transaction
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-amber-500/20 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]"
              onClick={() => setFeedback("Review Approvals will open the approval queue when connected.")}
            >
              <ClipboardCheck className="size-4 text-amber-200/80" aria-hidden />
              Review Approvals
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]"
              onClick={() => setFeedback("Export Report will offer PDF/CSV packs when connected.")}
            >
              <FileBarChart className="size-4 text-slate-300" aria-hidden />
              Export Report
            </Button>
          </>
        }
      />

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
        title="Accounting modules"
        description="Structured areas for serious church finance—ledgers, controls, and evidence—not consumer banking."
        className="border-amber-500/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {accountingModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.title}
                type="button"
                onClick={() => setFeedback(`${mod.title} module opens when connected.`)}
                className={cn(
                  "rounded-xl border border-white/[0.08] bg-[#0c1524] p-3 text-left transition-colors",
                  "hover:border-amber-500/25 hover:bg-[#101d32]",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-[#0a1426]">
                    <Icon className="size-4 text-amber-200/85" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{mod.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{mod.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard
        title="Recent transactions"
        description="Posted and pending items across the general ledger. Amounts are illustrative."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-400">
              <tr>
                {[
                  "Reference",
                  "Type",
                  "Category",
                  "Amount",
                  "Method",
                  "Recorded By",
                  "Approval Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-100/85">{row.reference}</td>
                  <td className="px-3 py-2.5 text-slate-200">{row.type}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.category}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium text-white">{row.amount}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.method}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.recordedBy}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", statusBadge(row.approvalStatus))}>
                      {row.approvalStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View ${row.reference}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/[0.08]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Open journal for ${row.reference}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/[0.08]"
                      >
                        Journal
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
        <AdminCard title="Approval workflow" description="Pending items and where they sit in delegated authority." className="border-amber-500/10 bg-[#080f1c]/95">
          <ul className="space-y-2">
            {pendingApprovals.map((p) => (
              <li key={p.ref} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
                <p className="font-mono text-xs text-amber-100/85">{p.ref}</p>
                <p className="mt-0.5 text-sm text-slate-200">{p.summary}</p>
                <p className="mt-1 text-xs text-slate-400">{p.levels}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Higher-value or restricted categories route through additional levels before posting is final.
          </p>
        </AdminCard>

        <AdminCard
          title="Bank reconciliation"
          description="Statement-to-ledger matching for month-end confidence."
          className="border-amber-500/10 bg-[#080f1c]/95"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Bank balance (statement)</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">GHS 184,920.44</p>
              <p className="mt-0.5 text-xs text-slate-500">As of 26 Apr 2026 · Main operating account</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">System balance (ledger)</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">GHS 184,631.20</p>
              <p className="mt-0.5 text-xs text-slate-500">Cash book after last import</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unmatched entries</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-amber-100/90">4</p>
              <p className="mt-0.5 text-xs text-slate-500">Timing differences and one missing deposit slip</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Reconciliation status</p>
              <p className="mt-1 text-lg font-semibold text-emerald-200/90">In progress</p>
              <p className="mt-0.5 text-xs text-slate-500">Close expected after unmatched items are cleared</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Audit trail" description="A trustworthy record of custody—who recorded, who approved, what changed, and when." className="border-white/10 bg-[#080f1c]/95">
        <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#0c1524]">
          {auditEntries.map((entry, i) => (
            <li key={i} className="px-3 py-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-white">{entry.action}</p>
                <time className="font-mono text-xs text-slate-500">{entry.when}</time>
              </div>
              <p className="mt-1 text-xs text-slate-400">{entry.detail}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  <span className="text-slate-600">Recorded by</span> {entry.whoRecorded}
                </span>
                <span>
                  <span className="text-slate-600">Approved by</span> {entry.whoApproved}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard
        title="Reports"
        description="Governance-ready outputs. Generate packs for trustees and external reviewers when connected."
        className="border-amber-500/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reportCards.map((r) => (
            <button
              key={r.title}
              type="button"
              onClick={() => setFeedback(`Report: ${r.title} — export when connected.`)}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#0c1524] p-3 text-left",
                "hover:border-amber-500/25 hover:bg-[#101d32]",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-[#0a1426]">
                <FileStack className="size-4 text-amber-200/85" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{r.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{r.blurb}</span>
              </span>
            </button>
          ))}
        </div>
      </AdminCard>

      <p className="rounded-lg border border-white/[0.06] bg-[#0a1426]/80 px-3 py-2 text-xs leading-relaxed text-slate-500">
        <BookMarked className="mr-1.5 inline size-3.5 text-amber-200/70" aria-hidden />
        Member <strong className="font-medium text-slate-400">Giving</strong> captures contributions;{" "}
        <strong className="font-medium text-slate-400">Finance</strong> is where those flows are recognised, controlled,
        reconciled, and reported under your church&apos;s policies.
      </p>
    </main>
  );
}
