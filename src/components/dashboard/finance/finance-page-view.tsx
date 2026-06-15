"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Activity,
  ClipboardCheck,
  Download,
  HandCoins,
  Receipt,
} from "lucide-react";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { PreviewSectionNotice } from "@/components/shared/preview-section-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { fetchMyFinance } from "@/lib/api/finance";
import { formatCurrency, pickSummaryCurrency, pickSummaryValue } from "@/lib/api/formatters";
import { mapMemberFinanceTransaction, type MemberFinanceTxRow } from "@/lib/api/mappers";
import { emptyMemberScope } from "@/lib/api/member-scope";
import type { ApiFinanceTransaction } from "@/lib/api/types";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const fallbackGivingTrend = [
  { month: "Jan", giving: 2_450_000 },
  { month: "Feb", giving: 2_620_000 },
  { month: "Mar", giving: 2_510_000 },
  { month: "Apr", giving: 2_780_000 },
  { month: "May", giving: 2_910_000 },
  { month: "Jun", giving: 2_840_000 },
];

const demoTransactions: MemberFinanceTxRow[] = [
  {
    reference: "TXN-24089",
    category: "Tithe",
    member: "You",
    amount: 120_000,
    paymentMethod: "Bank transfer",
    date: "2026-04-22",
    status: "Cleared",
  },
  {
    reference: "TXN-24091",
    category: "Offering",
    member: "You",
    amount: 45_000,
    paymentMethod: "Mobile money",
    date: "2026-04-21",
    status: "Cleared",
  },
];

const categoryBreakdown = [
  { name: "Tithe", amount: 1_420_000 },
  { name: "Offering", amount: 680_000 },
  { name: "Donation", amount: 240_000 },
  { name: "Welfare", amount: 310_000 },
  { name: "Pledge", amount: 520_000 },
] as const;

const pendingApprovals = [
  {
    title: "Welfare disbursement — medical support",
    reference: "APR-118",
    amount: "GHS 180,000",
    note: "Awaiting second signature from treasurer.",
  },
  {
    title: "Youth camp vendor deposit",
    reference: "APR-122",
    amount: "GHS 350,000",
    note: "Receipt attached; ministry lead to confirm headcount.",
  },
  {
    title: "Building maintenance invoice",
    reference: "APR-125",
    amount: "GHS 92,500",
    note: "Compare against agreed vendor quote before release.",
  },
];

function formatDisplayAmount(value: number) {
  return formatCurrency(value);
}

function buildGivingTrend(transactions: MemberFinanceTxRow[]) {
  const buckets = new Map<string, number>();

  for (const transaction of transactions) {
    const parsed = new Date(transaction.date);
    if (Number.isNaN(parsed.getTime())) continue;
    const month = parsed.toLocaleDateString("en-GB", { month: "short" });
    buckets.set(month, (buckets.get(month) ?? 0) + transaction.amount);
  }

  return Array.from(buckets.entries()).map(([month, giving]) => ({ month, giving }));
}

function buildCategoryBreakdown(transactions: MemberFinanceTxRow[]) {
  const buckets = new Map<string, number>();

  for (const transaction of transactions) {
    buckets.set(transaction.category, (buckets.get(transaction.category) ?? 0) + transaction.amount);
  }

  return Array.from(buckets.entries()).map(([name, amount]) => ({ name, amount }));
}

const columns: ColumnDef<MemberFinanceTxRow>[] = [
  { header: "Reference", accessorKey: "reference" },
  { header: "Category", accessorKey: "category" },
  { header: "Member", accessorKey: "member" },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums text-foreground">
        {formatDisplayAmount(row.original.amount)}
      </span>
    ),
  },
  { header: "Payment Method", accessorKey: "paymentMethod" },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      const parsed = new Date(row.original.date);
      if (Number.isNaN(parsed.getTime())) return row.original.date;
      return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
            s === "Cleared" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            s === "Pending" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
            s === "Review" && "bg-sky-500/10 text-sky-800 dark:text-sky-300",
          )}
        >
          {s}
        </span>
      );
    },
  },
];

export function FinancePageView() {
  const { isDemo } = useAuth();
  const financeQuery = useApiData("member-finance-me", fetchMyFinance, emptyMemberScope<ApiFinanceTransaction>());

  const isLinked = financeQuery.isLive && financeQuery.data.linked;

  const transactions = useMemo(() => {
    if (isDemo) return demoTransactions;
    if (!isLinked) return [];
    return financeQuery.data.items.map(mapMemberFinanceTransaction);
  }, [financeQuery.data.items, isDemo, isLinked]);

  const givingTrend = useMemo(() => {
    if (isDemo) return fallbackGivingTrend;
    if (!isLinked || transactions.length === 0) return [];
    return buildGivingTrend(transactions);
  }, [isDemo, isLinked, transactions]);

  const liveCategoryBreakdown = useMemo(() => {
    if (isDemo) return [...categoryBreakdown];
    if (!isLinked || transactions.length === 0) return [];
    return buildCategoryBreakdown(transactions);
  }, [isDemo, isLinked, transactions]);

  const maxCategory = Math.max(...liveCategoryBreakdown.map((c) => c.amount), 1);

  const summaryCards = useMemo(() => {
    if (isDemo) {
      return [
        {
          label: "Total Giving This Month",
          value: "GHS 165,000",
          detail: "Your recorded giving",
          icon: HandCoins,
        },
        {
          label: "Total This Year",
          value: "GHS 420,000",
          detail: "Your giving history",
          icon: Receipt,
        },
        {
          label: "Recent Transactions",
          value: "2",
          detail: "On your personal record",
          icon: ClipboardCheck,
        },
        {
          label: "Last gift",
          value: "GHS 45,000",
          detail: "Most recent contribution",
          icon: Activity,
        },
      ];
    }

    if (!isLinked) {
      return [
        { label: "Total Giving This Month", value: "—", detail: "Your recorded giving", icon: HandCoins },
        { label: "Total This Year", value: "—", detail: "Your giving history", icon: Receipt },
        { label: "Recent Transactions", value: "0", detail: "On your personal record", icon: ClipboardCheck },
        { label: "Last gift", value: "—", detail: "Most recent contribution", icon: Activity },
      ];
    }

    return [
      {
        label: "Total Giving This Month",
        value: pickSummaryCurrency(financeQuery.data.summary, ["givingThisMonth", "monthTotal", "totalThisMonth"], "GHS 0"),
        detail: "Your recorded giving",
        icon: HandCoins,
      },
      {
        label: "Total This Year",
        value: pickSummaryCurrency(financeQuery.data.summary, ["totalThisYear", "yearTotal", "yearToDate"], "GHS 0"),
        detail: "Your giving history",
        icon: Receipt,
      },
      {
        label: "Recent Transactions",
        value: pickSummaryValue(
          financeQuery.data.summary,
          ["transactionCount", "count", "totalTransactions"],
          String(transactions.length),
        ),
        detail: "On your personal record",
        icon: ClipboardCheck,
      },
      {
        label: "Last gift",
        value: pickSummaryCurrency(financeQuery.data.summary, ["lastGift", "lastContribution", "lastTransactionAmount"], "—"),
        detail: "Most recent contribution",
        icon: Activity,
      },
    ];
  }, [financeQuery.data.summary, isDemo, isLinked, transactions.length]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Finance"
        description="A steady view of your giving and contributions—so your personal stewardship stays visible and accountable."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="h-10 rounded-xl">
              <HandCoins className="size-4" aria-hidden />
              Record Transaction
            </Button>
            <Button variant="outline" className="h-10 rounded-xl">
              <Download className="size-4" aria-hidden />
              Export Report
            </Button>
          </div>
        }
      />

      <ApiConnectionNotice
        isLoading={financeQuery.isLoading}
        error={financeQuery.error}
        isLive={financeQuery.isLive}
        liveLabel="Showing your personal finance records from /finance/me."
      />

      {financeQuery.isLive && !financeQuery.data.linked ? <MemberLinkedNotice /> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
            detail={card.detail}
            icon={card.icon}
          />
        ))}
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Giving trend</CardTitle>
            <CardDescription>
              Your month-by-month giving rhythm—not church-wide totals.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
            {givingTrend.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {isLinked ? "No giving history to chart yet." : "Your giving trend will appear when your profile is linked."}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={givingTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="givingTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="oklch(0.45 0.12 145)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v) => formatCurrency(Number(v))}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    return [formatDisplayAmount(n), "Giving"];
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="giving"
                  stroke="oklch(0.42 0.11 145)"
                  fill="url(#givingTrendFill)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Recent transactions</CardTitle>
            <CardDescription>
              Your personal contribution history from /finance/me.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-muted/40">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-2.5 text-left font-medium text-muted-foreground"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                        {isLinked
                          ? "No finance records on your profile yet."
                          : isDemo
                            ? "Preview transactions appear in demo mode."
                            : "Your transactions will appear here when /finance/me loads."}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60 bg-background/55">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Category breakdown</CardTitle>
            <CardDescription>
              Where generosity landed this month—tithe, offering, and the channels that
              care for people and mission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {liveCategoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {isLinked ? "No category breakdown available yet." : "Category breakdown appears when your profile is linked."}
              </p>
            ) : (
              liveCategoryBreakdown.map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatDisplayAmount(row.amount)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-primary/35"
                    style={{ width: `${Math.round((row.amount / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Pending approvals</CardTitle>
            <CardDescription>
              Preview only — approval workflows are for finance officers, not member records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <PreviewSectionNotice />
            {pendingApprovals.map((item) => (
              <div
                key={item.reference}
                className="rounded-xl border border-border/70 bg-background/65 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.reference}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {item.amount}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
