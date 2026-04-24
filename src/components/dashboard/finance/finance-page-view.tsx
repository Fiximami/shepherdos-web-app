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
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { SummaryCard } from "@/components/dashboard/shared/summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const givingTrend = [
  { month: "Jan", giving: 2_450_000 },
  { month: "Feb", giving: 2_620_000 },
  { month: "Mar", giving: 2_510_000 },
  { month: "Apr", giving: 2_780_000 },
  { month: "May", giving: 2_910_000 },
  { month: "Jun", giving: 2_840_000 },
];

type TxRow = {
  reference: string;
  category: string;
  member: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: "Cleared" | "Pending" | "Review";
};

const transactions: TxRow[] = [
  {
    reference: "TXN-24089",
    category: "Tithe",
    member: "Ruth Eze",
    amount: 120_000,
    paymentMethod: "Bank transfer",
    date: "2026-04-22",
    status: "Cleared",
  },
  {
    reference: "TXN-24091",
    category: "Offering",
    member: "Anonymous",
    amount: 45_000,
    paymentMethod: "Cash",
    date: "2026-04-21",
    status: "Cleared",
  },
  {
    reference: "TXN-24094",
    category: "Welfare",
    member: "Finance office",
    amount: 180_000,
    paymentMethod: "Bank transfer",
    date: "2026-04-20",
    status: "Pending",
  },
  {
    reference: "TXN-24098",
    category: "Pledge",
    member: "David Aina",
    amount: 250_000,
    paymentMethod: "Card",
    date: "2026-04-19",
    status: "Review",
  },
  {
    reference: "TXN-24102",
    category: "Donation",
    member: "Grace Nwosu",
    amount: 75_000,
    paymentMethod: "Bank transfer",
    date: "2026-04-18",
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
    amount: "₦180,000",
    note: "Awaiting second signature from treasurer.",
  },
  {
    title: "Youth camp vendor deposit",
    reference: "APR-122",
    amount: "₦350,000",
    note: "Receipt attached; ministry lead to confirm headcount.",
  },
  {
    title: "Building maintenance invoice",
    reference: "APR-125",
    amount: "₦92,500",
    note: "Compare against agreed vendor quote before release.",
  },
];

const maxCategory = Math.max(...categoryBreakdown.map((c) => c.amount));

function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

const columns: ColumnDef<TxRow>[] = [
  { header: "Reference", accessorKey: "reference" },
  { header: "Category", accessorKey: "category" },
  { header: "Member", accessorKey: "member" },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums text-foreground">
        {formatNaira(row.original.amount)}
      </span>
    ),
  },
  { header: "Payment Method", accessorKey: "paymentMethod" },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
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
        description="A steady view of giving, spending, and what still needs a careful yes—so stewardship stays visible, kind, and accountable."
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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Giving This Month"
          value="₦2.84M"
          detail="Faithful generosity across branches"
          icon={HandCoins}
        />
        <SummaryCard
          label="Total Expenses This Month"
          value="₦1.12M"
          detail="Aligned to approved ministry lines"
          icon={Receipt}
        />
        <SummaryCard
          label="Pending Approvals"
          value="3"
          detail="Waiting on review or second signature"
          icon={ClipboardCheck}
        />
        <SummaryCard
          label="Budget Health"
          value="On track"
          detail="Giving ahead of plan by a modest margin"
          icon={Activity}
        />
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Giving trend</CardTitle>
            <CardDescription>
              Month-by-month giving so leaders can notice rhythm, gratitude, and any
              gentle shifts worth a conversation—not a panic.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pt-2">
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
                  tickFormatter={(v) => `₦${Number(v) / 1_000_000}M`}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    return [formatNaira(n), "Giving"];
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
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Recent transactions</CardTitle>
            <CardDescription>
              A concise ledger of what moved recently—names where it helps, clarity
              where it matters.
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
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t border-border/60 bg-background/55">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2.5 align-top text-foreground">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
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
            {categoryBreakdown.map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatNaira(row.amount)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-primary/35"
                    style={{ width: `${Math.round((row.amount / maxCategory) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="border-border/70 bg-card/75 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Pending approvals</CardTitle>
            <CardDescription>
              Items that deserve a second look before funds move—keeping trust with your
              congregation and your books.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
