"use client";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  FileBarChart,
  FileStack,
  Landmark,
  PiggyBank,
  Scale,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/use-api-data";
import { fetchAuditLogs } from "@/lib/api/audit-logs";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";
import { pickSummaryCurrency, pickSummaryValue } from "@/lib/api/formatters";
import { mapApiAuditLog, mapApiFinanceTransaction } from "@/lib/api/mappers";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { receiptRecords } from "@/lib/mock-receipts";
import { cn } from "@/lib/utils";

const fallbackOverviewCards = [
  { label: "Total Tithes", value: "GHS 186,400", note: "Posted to general ledger" },
  { label: "Total Offerings", value: "GHS 52,180", note: "General & special offerings" },
  { label: "Special Donations", value: "GHS 28,940", note: "Designated gifts" },
  { label: "Total Expenses", value: "GHS 291,180", note: "Approved & pending posts" },
  { label: "Net Balance", value: "GHS 137,460", note: "Income less expenditure (period)" },
  { label: "Pending Approvals", value: "9", note: "Income + expense workflows" },
] as const;

const incomeBreakdown = [
  { category: "Tithe", amount: 186_400, pct: 43 },
  { category: "Offering", amount: 52_180, pct: 12 },
  { category: "Special Donation", amount: 28_940, pct: 7 },
  { category: "Welfare", amount: 14_220, pct: 3 },
  { category: "Pledge", amount: 41_200, pct: 10 },
  { category: "Project Support", amount: 68_400, pct: 16 },
  { category: "Missions / Outreach", amount: 37_300, pct: 9 },
  { category: "Inventory Sales / Resource Sales", amount: 12_480, pct: 3 },
] as const;

const recentIncome = [
  {
    id: "in-1",
    receiptId: "RCPT-2026-004122",
    date: "2026-04-26",
    category: "Tithe",
    amount: "GHS 2,400.00",
    source: "Member batch · MTN MoMo",
    reference: "INC-2026-08912",
    status: "Posted",
  },
  {
    id: "in-2",
    receiptId: "RCPT-2026-004087",
    date: "2026-04-26",
    category: "Offering",
    amount: "GHS 18,200.00",
    source: "Sunday service · consolidated",
    reference: "INC-2026-08908",
    status: "Posted",
  },
  {
    id: "in-3",
    receiptId: "RCPT-2026-003995",
    date: "2026-04-25",
    category: "Special Donation",
    amount: "GHS 5,000.00",
    source: "M. Osei · bank transfer (building)",
    reference: "INC-2026-08894",
    status: "Posted",
  },
  {
    id: "in-4",
    receiptId: "—",
    date: "2026-04-25",
    category: "Missions / Outreach",
    amount: "GHS 1,200.00",
    source: "Anonymous · card",
    reference: "INC-2026-08890",
    status: "Pending L1",
  },
  {
    id: "in-5",
    receiptId: "INV-RCPT-2026-00124",
    date: "2026-04-27",
    category: "Inventory Sales / Resource Sales",
    amount: "GHS 640.00",
    source: "Church Store order batch · confirmed cash",
    reference: "INV-INC-2026-00452",
    status: "Posted",
  },
  {
    id: "in-6",
    receiptId: "INV-RCPT-2026-00131",
    date: "2026-04-28",
    category: "Inventory Sales / Resource Sales",
    amount: "GHS 320.00",
    source: "Church Store · pending cash confirmation",
    reference: "INV-INC-2026-00470",
    status: "Pending confirmation",
  },
] as const;

const inventoryFinanceSummary = [
  { label: "Inventory Revenue This Month", value: "GHS 12,480", note: "Store sales recognized in finance period." },
  { label: "Pending Cash Inventory Payments", value: "GHS 2,140", note: "Awaiting physical payment confirmation." },
  { label: "Confirmed Inventory Sales", value: "GHS 10,340", note: "Posted to income after confirmation." },
] as const;

type SyncStatus = "Synced" | "Pending Confirmation" | "Requires Review";

const inventorySyncRows: Array<{
  id: string;
  orderRef: string;
  itemSummary: string;
  amount: string;
  paymentStatus: string;
  syncStatus: SyncStatus;
}> = [
  {
    id: "is-1",
    orderRef: "ord-2203",
    itemSummary: "Sermon Notes Journal Pack ×3",
    amount: "GHS 120.00",
    paymentStatus: "Cash Confirmed",
    syncStatus: "Synced",
  },
  {
    id: "is-2",
    orderRef: "ord-2202",
    itemSummary: "Church Branded Polo ×1",
    amount: "GHS 120.00",
    paymentStatus: "Pending Cash",
    syncStatus: "Pending Confirmation",
  },
  {
    id: "is-3",
    orderRef: "ord-2241",
    itemSummary: "Choir Robe (Navy/Gold) ×1",
    amount: "GHS 260.00",
    paymentStatus: "Paid Online",
    syncStatus: "Requires Review",
  },
];

const expenseCategoriesIntro = [
  "Operational expenses",
  "Ministry spending",
  "Vendor payments",
  "Utility bills",
  "Event expenses",
  "Welfare disbursements",
] as const;

type ExpApproval = "Approved" | "Pending L1" | "Pending L2" | "Rejected";

type ExpenseRow = {
  id: string;
  date: string;
  expenseCategory: string;
  department: string;
  amount: string;
  paidFrom: string;
  recordedBy: string;
  approvalStatus: ExpApproval;
};

const expenses: ExpenseRow[] = [
  {
    id: "ex-1",
    date: "2026-04-26",
    expenseCategory: "Utility bills",
    department: "Operations",
    amount: "GHS 8,420.00",
    paidFrom: "Main Bank Account",
    recordedBy: "K. Boateng",
    approvalStatus: "Pending L2",
  },
  {
    id: "ex-2",
    date: "2026-04-24",
    expenseCategory: "Ministry spending",
    department: "Youth",
    amount: "GHS 15,000.00",
    paidFrom: "Main Bank Account",
    recordedBy: "D. Osei",
    approvalStatus: "Pending L1",
  },
  {
    id: "ex-3",
    date: "2026-04-22",
    expenseCategory: "Vendor payments",
    department: "Admin",
    amount: "GHS 3,180.00",
    paidFrom: "Petty Cash",
    recordedBy: "A. Mensah",
    approvalStatus: "Approved",
  },
  {
    id: "ex-4",
    date: "2026-04-20",
    expenseCategory: "Welfare disbursements",
    department: "Pastoral care",
    amount: "GHS 2,000.00",
    paidFrom: "Welfare Account",
    recordedBy: "R. Eze",
    approvalStatus: "Approved",
  },
  {
    id: "ex-5",
    date: "2026-04-18",
    expenseCategory: "Event expenses",
    department: "Hosts",
    amount: "GHS 4,650.00",
    paidFrom: "Main Bank Account",
    recordedBy: "J. Ampofo",
    approvalStatus: "Approved",
  },
  {
    id: "ex-6",
    date: "2026-04-15",
    expenseCategory: "Operational expenses",
    department: "IT / Comms",
    amount: "GHS 1,290.00",
    paidFrom: "Main Bank Account",
    recordedBy: "A. Mensah",
    approvalStatus: "Approved",
  },
];

const departmentSpending = [
  { department: "Choir", spent: "GHS 14,200", note: "Music equipment and rehearsals" },
  { department: "Media Team", spent: "GHS 22,100", note: "Streaming, cables, and maintenance" },
  { department: "Youth Ministry", spent: "GHS 58,900", note: "Camp logistics and transport" },
  { department: "Sunday School", spent: "GHS 7,200", note: "Learning materials" },
  { department: "Welfare Group", spent: "GHS 38,200", note: "Care disbursements and emergency support" },
] as const;

type BudgetStatus = "Healthy" | "Warning" | "Exceeded";

type BudgetRow = {
  id: string;
  department: string;
  allocated: string;
  spent: string;
  remaining: string;
  usagePct: number;
  status: BudgetStatus;
};

const budgets: BudgetRow[] = [
  { id: "b-1", department: "Worship", allocated: "GHS 48,000", spent: "GHS 36,200", remaining: "GHS 11,800", usagePct: 75, status: "Healthy" },
  { id: "b-2", department: "Youth", allocated: "GHS 62,000", spent: "GHS 58,900", remaining: "GHS 3,100", usagePct: 95, status: "Warning" },
  { id: "b-3", department: "Outreach", allocated: "GHS 35,000", spent: "GHS 38,400", remaining: "GHS (3,400)", usagePct: 110, status: "Exceeded" },
  { id: "b-4", department: "Admin", allocated: "GHS 28,000", spent: "GHS 19,100", remaining: "GHS 8,900", usagePct: 68, status: "Healthy" },
];

type DeptGroupBudgetRow = {
  id: string;
  name: string;
  allocated: string;
  spent: string;
  remaining: string;
  usagePct: number;
  status: BudgetStatus;
  assignee: string;
};

const departmentGroupBudgets: DeptGroupBudgetRow[] = [
  {
    id: "db-choir",
    name: "Choir",
    allocated: "GHS 18,000",
    spent: "GHS 14,200",
    remaining: "GHS 3,800",
    usagePct: 79,
    status: "Healthy",
    assignee: "Finance · A. Mensah · Leader · G. Nwosu",
  },
  {
    id: "db-media",
    name: "Media Team",
    allocated: "GHS 24,000",
    spent: "GHS 22,100",
    remaining: "GHS 1,900",
    usagePct: 92,
    status: "Warning",
    assignee: "Finance · A. Mensah · Tech lead · D. Kwarteng",
  },
  {
    id: "db-youth",
    name: "Youth Ministry",
    allocated: "GHS 62,000",
    spent: "GHS 58,900",
    remaining: "GHS 3,100",
    usagePct: 95,
    status: "Warning",
    assignee: "Finance · R. Eze · Pastor youth · S. Okoro",
  },
  {
    id: "db-ss",
    name: "Sunday School",
    allocated: "GHS 10,000",
    spent: "GHS 7,200",
    remaining: "GHS 2,800",
    usagePct: 72,
    status: "Healthy",
    assignee: "Finance · A. Mensah · Coordinator · K. Adjei",
  },
  {
    id: "db-welfare",
    name: "Welfare Group",
    allocated: "GHS 35,000",
    spent: "GHS 38,200",
    remaining: "GHS (3,200)",
    usagePct: 109,
    status: "Exceeded",
    assignee: "Finance · R. Eze · Lead deacon · J. Ampofo",
  },
  {
    id: "db-eva",
    name: "Evangelism Team",
    allocated: "GHS 18,000",
    spent: "GHS 8,400",
    remaining: "GHS 9,600",
    usagePct: 47,
    status: "Healthy",
    assignee: "Finance · A. Mensah · Team lead · P. Osei",
  },
  {
    id: "db-ush",
    name: "Ushering Team",
    allocated: "GHS 12,000",
    spent: "GHS 11,100",
    remaining: "GHS 900",
    usagePct: 93,
    status: "Warning",
    assignee: "Finance · A. Mensah · Head usher · J. Ampofo",
  },
];

const departmentBudgetInsights = [
  {
    title: "Highest spending (period)",
    body: "Youth Ministry leads spend at GHS 58,900—mostly camp deposits and transport.",
    icon: TrendingUp,
    accent: "border-amber-500/20 bg-amber-950/15",
  },
  {
    title: "Departments near limit",
    body: "Media (92%), Ushering (93%), and Youth (95%) are within policy watch—confirm upcoming events before new commitments.",
    icon: AlertTriangle,
    accent: "border-amber-500/20 bg-amber-950/12",
  },
  {
    title: "Unused budget capacity",
    body: "Evangelism Team retains GHS 9,600—consider aligning outreach dates or rolling a modest increase next quarter.",
    icon: PiggyBank,
    accent: "border-emerald-500/15 bg-emerald-950/10",
  },
  {
    title: "Over-budget alert",
    body: "Welfare Group is above envelope by GHS 3,200—pastoral and finance review recommended before further disbursements.",
    icon: AlertTriangle,
    accent: "border-rose-500/20 bg-rose-950/15",
  },
] as const;

const accounts = [
  {
    name: "Main Bank Account",
    balance: "GHS 184,631.20",
    lastActivity: "26 Apr 2026 · Transfer out GHS 8,420",
    recon: "In progress",
    icon: Landmark,
  },
  {
    name: "Mobile Money Account",
    balance: "GHS 42,180.00",
    lastActivity: "26 Apr 2026 · Tithe batch settlement",
    recon: "Matched",
    icon: Smartphone,
  },
  {
    name: "Petty Cash",
    balance: "GHS 1,240.00",
    lastActivity: "24 Apr 2026 · Vendor reimbursement",
    recon: "Matched",
    icon: Wallet,
  },
  {
    name: "Project Account",
    balance: "GHS 68,900.00",
    lastActivity: "22 Apr 2026 · Deposit · building fund",
    recon: "Review",
    icon: Building2,
  },
  {
    name: "Welfare Account",
    balance: "GHS 12,400.00",
    lastActivity: "20 Apr 2026 · Disbursement",
    recon: "Matched",
    icon: Wallet,
  },
] as const;

const approvalQueue = [
  {
    kind: "Expense" as const,
    ref: "EX-2026-04179",
    summary: "Utilities · electricity — GHS 8,420.00",
    level: "L2",
    approver: "Treasurer · R. Eze",
  },
  {
    kind: "Income" as const,
    ref: "INC-2026-08890",
    summary: "Missions / Outreach — GHS 1,200.00",
    level: "L1",
    approver: "Finance officer · A. Mensah",
  },
  {
    kind: "Expense" as const,
    ref: "EX-2026-04171",
    summary: "Youth camp deposit — GHS 15,000.00",
    level: "L1",
    approver: "Youth head · S. Okoro",
  },
] as const;

const fallbackAuditRows = [
  {
    action: "Amount amended",
    transaction: "TX-2026-04160",
    user: "J. Ampofo",
    timestamp: "2026-04-26 09:14",
    previousValue: "GHS 3,100.00",
    newValue: "GHS 3,180.00",
  },
  {
    action: "Approval granted (L2)",
    transaction: "EX-2026-04158",
    user: "R. Eze",
    timestamp: "2026-04-25 16:02",
    previousValue: "Pending L2",
    newValue: "Approved",
  },
  {
    action: "Category reassigned",
    transaction: "TX-2026-04155",
    user: "A. Mensah",
    timestamp: "2026-04-25 11:33",
    previousValue: "Supplies",
    newValue: "Ministry spending",
  },
] as const;

const reportCards = [
  { title: "Tithe & Offering Report", blurb: "Period summary for worship and stewardship review." },
  { title: "Income & Expenditure Statement", blurb: "Official P&L line for leadership packs." },
  { title: "Expense Report", blurb: "Spend by category, ministry, and vendor." },
  { title: "Budget Performance Report", blurb: "Variance against departmental envelopes." },
  { title: "Cash Flow Statement", blurb: "Operating movement across accounts." },
  { title: "Balance Sheet Placeholder", blurb: "Position statement when chart of accounts is complete." },
  { title: "Audit Trail Report", blurb: "Chronological control log for reviewers." },
  { title: "Annual Giving Report", blurb: "Mapped member giving for governance (not member receipts)." },
] as const;

function expStatusBadge(s: ExpApproval) {
  const map: Record<ExpApproval, string> = {
    Approved: "border-emerald-500/25 bg-emerald-950/40 text-emerald-200/90",
    "Pending L1": "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
    "Pending L2": "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
    Rejected: "border-red-500/20 bg-red-950/35 text-red-200/90",
  };
  return map[s];
}

function budgetStatusBadge(s: BudgetStatus) {
  const map: Record<BudgetStatus, string> = {
    Healthy: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Warning: "border-amber-500/25 bg-amber-950/35 text-amber-50",
    Exceeded: "border-rose-500/25 bg-rose-950/35 text-rose-100",
  };
  return map[s];
}

function syncStatusBadge(s: SyncStatus) {
  const map: Record<SyncStatus, string> = {
    Synced: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    "Pending Confirmation": "border-amber-500/25 bg-amber-950/35 text-amber-50",
    "Requires Review": "border-rose-500/25 bg-rose-950/35 text-rose-100",
  };
  return map[s];
}

function formatGhs(n: number) {
  return `GHS ${n.toLocaleString("en-GH")}`;
}

export default function AdminFinancePage() {
  const canRecordFinance = hasPermission("finance:record");
  const canApproveFinance = hasPermission("finance:approve");
  const canAccessFinance = hasAnyPermission(["finance:record", "finance:approve"]);
  const [feedback, setFeedback] = useState("");

  const summaryQuery = useApiData("admin-finance-summary", fetchFinanceSummary, {});
  const transactionsQuery = useApiData(
    "admin-finance-transactions",
    async () => {
      const transactions = await fetchFinanceTransactions();
      return Array.isArray(transactions) ? transactions.map(mapApiFinanceTransaction) : [];
    },
    recentIncome,
  );
  const auditQuery = useApiData(
    "admin-audit-logs",
    async () => {
      const logs = await fetchAuditLogs({ page: 1, limit: 10 });
      return Array.isArray(logs) ? logs.map(mapApiAuditLog) : [];
    },
    fallbackAuditRows.map((row, index) => ({
      id: `audit-${index}`,
      action: row.action,
      actor: row.user,
      entity: row.transaction,
      timestamp: row.timestamp,
      details: `${row.previousValue} → ${row.newValue}`,
    })),
  );

  const overviewCards = summaryQuery.isLive
    ? [
        { label: "Total Tithes", value: pickSummaryCurrency(summaryQuery.data, ["totalTithes", "tithes"]), note: "Posted to general ledger" },
        { label: "Total Offerings", value: pickSummaryCurrency(summaryQuery.data, ["totalOfferings", "offerings"]), note: "General & special offerings" },
        { label: "Special Donations", value: pickSummaryCurrency(summaryQuery.data, ["specialDonations", "donations"]), note: "Designated gifts" },
        { label: "Total Expenses", value: pickSummaryCurrency(summaryQuery.data, ["totalExpenses", "expenses"]), note: "Approved & pending posts" },
        { label: "Net Balance", value: pickSummaryCurrency(summaryQuery.data, ["netBalance", "balance"]), note: "Income less expenditure (period)" },
        { label: "Pending Approvals", value: pickSummaryValue(summaryQuery.data, ["pendingApprovals", "pendingCount"]), note: "Income + expense workflows" },
      ]
    : fallbackOverviewCards;

  const liveRecentIncome =
    transactionsQuery.isLive && Array.isArray(transactionsQuery.data)
      ? transactionsQuery.data
      : recentIncome;
  const auditRows =
    auditQuery.isLive && Array.isArray(auditQuery.data)
      ? auditQuery.data.map((row) => {
          const details = typeof row.details === "string" ? row.details : String(row.details ?? "—");
          const parts = details.split(" → ");

          return {
            action: row.action ?? "Updated",
            transaction: row.entity ?? "—",
            user: row.actor ?? "—",
            timestamp: row.timestamp ?? "—",
            previousValue: parts[0] ?? "—",
            newValue: parts[1] ?? details,
          };
        })
      : fallbackAuditRows;

  return (
    <main className="space-y-5 text-[#e8edf5]">
      <ApiConnectionNotice
        isLoading={summaryQuery.isLoading || transactionsQuery.isLoading || auditQuery.isLoading}
        error={summaryQuery.error ?? transactionsQuery.error ?? auditQuery.error}
        isLive={summaryQuery.isLive || transactionsQuery.isLive || auditQuery.isLive}
      />

      <AdminPageHeader
        title="Finance Management"
        description="Steward church resources with transparency, accuracy, approvals, and audit-ready reporting."
        actions={
          <div className="flex flex-wrap gap-2">
            {canRecordFinance ? (
              <>
                <Button
                  className="h-9 rounded-lg border border-amber-500/25 bg-[#0f1a2e] text-amber-50 shadow-none hover:bg-[#152238]"
                  onClick={() => setFeedback("Record Income will open the income journal when connected.")}
                >
                  <ArrowDownLeft className="size-4 text-amber-200/90" aria-hidden />
                  Record Income
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-amber-500/20 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]"
                  onClick={() => setFeedback("Record Expense will open the expense entry when connected.")}
                >
                  <ArrowUpRight className="size-4 text-amber-200/80" aria-hidden />
                  Record Expense
                </Button>
              </>
            ) : null}
            {canApproveFinance ? (
              <>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]"
                  onClick={() => setFeedback("Reconcile Account will open the reconciliation workspace when connected.")}
                >
                  <Scale className="size-4 text-slate-300" aria-hidden />
                  Reconcile Account
                </Button>
                <Button
                  variant="outline"
                  className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]"
                  onClick={() => setFeedback("Generate Report will offer PDF/CSV packs when connected.")}
                >
                  <FileBarChart className="size-4 text-slate-300" aria-hidden />
                  Generate Report
                </Button>
              </>
            ) : null}
          </div>
        }
      />

      {!canAccessFinance ? (
        <p className="rounded-lg border border-white/10 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">
          Finance actions are hidden until `finance:record` or `finance:approve` permission is granted.
        </p>
      ) : null}

      {feedback ? (
        <p className="rounded-lg border border-amber-500/15 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {overviewCards.map((card) => (
          <AdminCard key={card.label} title={card.label} className="border-amber-500/10 bg-[#0a1426]/90">
            <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Inventory sales finance integration"
        description="Inventory and resource sales are tracked separately from Giving and posted only after payment confirmation."
        className="border-amber-500/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inventoryFinanceSummary.map((row) => (
            <div key={row.label} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-3">
              <p className="text-xs text-slate-500">{row.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{row.value}</p>
              <p className="mt-1 text-[11px] text-slate-500">{row.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5 text-xs text-slate-400">
          Inventory Sales / Resource Sales become finance income only after payment is confirmed. Giving (tithes, offerings, donations,
          pledges) remains separate from inventory transactions.
        </div>
      </AdminCard>

      <AdminCard
        title="Income tracking"
        description="Recognised inflows by stewardship category. Member giving posts here under policy—separate from the member Giving screen."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Category breakdown</p>
            <ul className="mt-2 space-y-2">
              {incomeBreakdown.map((row) => (
                <li key={row.category} className="rounded-lg border border-white/[0.06] bg-[#0c1524] px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-300">{row.category}</span>
                    <span className="tabular-nums font-medium text-white">{formatGhs(row.amount)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-amber-500/40" style={{ width: `${row.pct}%` }} />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-600">{row.pct}% of period income (illustrative)</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Recent income transactions</p>
            <div className="mt-2 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
              <table className="w-full min-w-[840px] border-collapse text-sm">
                <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
                  <tr>
                    {["Receipt ID", "Date", "Category", "Amount", "Source / contribution", "Reference", "Status"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {liveRecentIncome.map((r) => (
                    <tr key={r.id} className="border-t border-white/[0.06]">
                      <td className="px-3 py-2 font-mono text-[11px] text-amber-100/80">{r.receiptId}</td>
                      <td className="px-3 py-2 tabular-nums text-slate-400">
                        {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-3 py-2 text-slate-200">{r.category}</td>
                      <td className="px-3 py-2 font-medium tabular-nums text-white">{r.amount}</td>
                      <td className="max-w-[220px] px-3 py-2 text-slate-400">{r.source}</td>
                      <td className="px-3 py-2 font-mono text-xs text-amber-100/80">{r.reference}</td>
                      <td className="px-3 py-2 text-xs text-slate-400">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Receipt-to-finance linkage"
        description="Official receipt fields are mapped to finance references for audit, member support, and reconciliation."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Receipt ID", "Date", "Amount", "Category", "Payment method", "Finance reference", "Created by"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receiptRecords.map((row) => (
                <tr key={row.receiptId} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-amber-100/85">{row.receiptId}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.dateISO).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5 font-medium tabular-nums text-white">GHS {row.amount.toLocaleString("en-GH")}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.category}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.paymentMethod}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-100/80">{row.financeReference}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard
        title="Inventory finance sync status"
        description="Track whether inventory sale records are posted, pending confirmation, or flagged for review."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Order Ref", "Item / Sales Entry", "Amount", "Payment Status", "Finance Sync Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventorySyncRows.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-100/85">{row.orderRef}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.itemSummary}</td>
                  <td className="px-3 py-2.5 tabular-nums text-white">{row.amount}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.paymentStatus}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", syncStatusBadge(row.syncStatus))}>
                      {row.syncStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard
        title="Expense management"
        description="Operational and ministry outflows with clear custody. Every expense line links to a department or ministry."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {expenseCategoriesIntro.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-[#0c1524] px-2.5 py-1 text-[11px] text-slate-400"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1080px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {[
                  "Date",
                  "Expense Category",
                  "Department / Ministry",
                  "Amount",
                  "Paid From",
                  "Recorded By",
                  "Approval Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2 tabular-nums text-slate-400">
                    {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2 text-slate-200">{row.expenseCategory}</td>
                  <td className="px-3 py-2 text-slate-400">{row.department}</td>
                  <td className="px-3 py-2 font-medium tabular-nums text-white">{row.amount}</td>
                  <td className="px-3 py-2 text-slate-400">{row.paidFrom}</td>
                  <td className="px-3 py-2 text-slate-500">{row.recordedBy}</td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", expStatusBadge(row.approvalStatus))}>
                      {row.approvalStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View expense ${row.id}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/[0.08]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback(`Approve flow ${row.id}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300 hover:bg-white/[0.08]"
                      >
                        Route
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
        title="Department spending"
        description="Cross-module stewardship view: how departments are spending in Finance (mock mapping)."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {departmentSpending.map((row) => (
            <div key={row.department} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
              <p className="text-sm font-medium text-white">{row.department}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-amber-100/90">{row.spent}</p>
              <p className="mt-1 text-xs text-slate-500">{row.note}</p>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Budget control" description="Departmental envelopes—early warning before overspend harms ministry plans." className="border-amber-500/10 bg-[#080f1c]/95">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Department / Ministry", "Budget Allocated", "Amount Spent", "Remaining Balance", "Budget Usage %", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{b.department}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{b.allocated}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{b.spent}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">{b.remaining}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            b.status === "Exceeded" ? "bg-rose-500/70" : b.status === "Warning" ? "bg-amber-500/70" : "bg-emerald-500/50",
                          )}
                          style={{ width: `${Math.min(b.usagePct, 100)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs text-slate-400">{b.usagePct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", budgetStatusBadge(b.status))}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard title="Department budget control" className="border-amber-500/15 bg-[#080f1c]/95">
        <p className="text-xs leading-relaxed text-slate-400">
          Budget envelopes tied to{" "}
          <Link href="/admin/departments" className="font-medium text-amber-200/90 underline-offset-2 hover:underline">
            Departments &amp; Groups
          </Link>
          —so finance officers and ministry leaders share one stewardship picture.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {departmentBudgetInsights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div key={ins.title} className={cn("rounded-xl border px-3 py-3", ins.accent)}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Icon className="size-4 shrink-0 text-amber-200/75" aria-hidden />
                  {ins.title}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{ins.body}</p>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {[
                  "Department / group",
                  "Allocated",
                  "Spent",
                  "Remaining",
                  "Usage",
                  "Status",
                  "Finance / leadership",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departmentGroupBudgets.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.name}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{row.allocated}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{row.spent}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">{row.remaining}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex min-w-[140px] items-center gap-2">
                      <div className="h-2 flex-1 max-w-[120px] overflow-hidden rounded-full bg-white/10">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width]",
                            row.status === "Exceeded"
                              ? "bg-rose-500/65"
                              : row.status === "Warning"
                                ? "bg-amber-500/60"
                                : "bg-emerald-500/45",
                          )}
                          style={{ width: `${Math.min(row.usagePct, 100)}%` }}
                        />
                      </div>
                      <span className="shrink-0 tabular-nums text-xs text-slate-400">{row.usagePct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", budgetStatusBadge(row.status))}>
                      {row.status}
                    </span>
                  </td>
                  <td className="max-w-[260px] px-3 py-2.5 text-xs text-slate-500">{row.assignee}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[280px] flex-wrap gap-1">
                      {(
                        [
                          ["View Budget", `View budget · ${row.name}`],
                          ["Adjust Budget", `Adjust budget · ${row.name}`],
                          ["View Expenses", `View expenses · ${row.name}`],
                          ["Export Budget Report", `Export budget report · ${row.name}`],
                        ] as const
                      ).map(([label, msg]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setFeedback(`${msg} (preview).`)}
                          className="rounded-md border border-amber-500/10 bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-amber-400/25 hover:bg-amber-950/20"
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

      <AdminCard title="Multi-account management" description="Balances are illustrative—live feeds connect when your bank and MoMo integrations are enabled." className="border-white/10 bg-[#080f1c]/95">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((acc) => {
            const Icon = acc.icon;
            return (
              <div key={acc.name} className="rounded-xl border border-white/[0.08] bg-[#0c1524] p-3">
                <div className="flex items-start gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-[#0a1426]">
                    <Icon className="size-4 text-amber-200/80" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{acc.name}</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">{acc.balance}</p>
                    <p className="mt-1 text-xs text-slate-500">Last activity: {acc.lastActivity}</p>
                    <p className="mt-2 text-[11px] text-slate-600">
                      Reconciliation: <span className="text-slate-400">{acc.recon}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard title="Bank / cash reconciliation" description="Month-end discipline: agree the ledger to what the bank or custodian shows." className="border-amber-500/10 bg-[#080f1c]/95">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">System balance</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">GHS 184,631.20</p>
              <p className="mt-0.5 text-xs text-slate-500">General ledger · main operating</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Bank / cash balance</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">GHS 184,920.44</p>
              <p className="mt-0.5 text-xs text-slate-500">Statement as of 26 Apr 2026</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Difference</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-amber-100/90">GHS 289.24</p>
              <p className="mt-0.5 text-xs text-slate-500">Outstanding items not yet cleared</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unresolved entries</p>
              <p className="mt-1 text-lg font-semibold text-white">6</p>
              <p className="mt-0.5 text-xs text-slate-500">Timing, fees, and one uncoded deposit</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Approval workflow" description="Income and expense lines awaiting sign-off—each row shows level and named approver." className="border-amber-500/10 bg-[#080f1c]/95">
          <ul className="space-y-2">
            {approvalQueue.map((item) => (
              <li key={item.ref} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      item.kind === "Income" ? "bg-emerald-950/50 text-emerald-200" : "bg-rose-950/40 text-rose-200",
                    )}
                  >
                    {item.kind}
                  </span>
                  <span className="font-mono text-xs text-amber-100/85">{item.ref}</span>
                </div>
                <p className="mt-1 text-sm text-slate-200">{item.summary}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Level {item.level} · Assigned: <span className="text-slate-400">{item.approver}</span>
                </p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setFeedback("Open full approval queue when connected.")}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-200/90 hover:text-amber-100"
          >
            <ClipboardCheck className="size-3.5" aria-hidden />
            Open queue
          </button>
        </AdminCard>
      </div>

      <AdminCard title="Audit trail" description="Immutable-style log for accountability—who changed what, when, and from which values." className="border-white/10 bg-[#080f1c]/95">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Action", "Transaction", "User", "Timestamp", "Previous value", "New value"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditRows.map((row, i) => (
                <tr key={i} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.action}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-100/80">{row.transaction}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.user}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{row.timestamp}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.previousValue}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminCard
        title="Finance reports"
        description="Governance-ready outputs. PDF export remains a placeholder until generation is connected."
        className="border-amber-500/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reportCards.map((r) => (
            <button
              key={r.title}
              type="button"
              onClick={() => setFeedback(`Generate: ${r.title} (preview).`)}
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
        Authorised roles only—finance officers, church admins, pastors, and delegates you assign. Member-facing{" "}
        <strong className="font-medium text-slate-400">Giving</strong> never exposes these controls.
      </p>
    </main>
  );
}
