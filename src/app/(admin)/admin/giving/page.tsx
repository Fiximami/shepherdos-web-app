"use client";

import { Download, FileSpreadsheet, Gift, Heart } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "Tithes", value: "GHS 186,400", note: "This month · recorded giving" },
  { label: "Offerings", value: "GHS 52,180", note: "General and special offerings" },
  { label: "Donations", value: "GHS 28,940", note: "Designated and one-time gifts" },
  { label: "Pledges", value: "GHS 41,200", note: "Installments received toward commitments" },
  { label: "Welfare Contributions", value: "GHS 14,220", note: "Care and benevolence pool" },
] as const;

const trendData = [
  { month: "Nov", total: 248000 },
  { month: "Dec", total: 312000 },
  { month: "Jan", total: 276000 },
  { month: "Feb", total: 289000 },
  { month: "Mar", total: 301000 },
  { month: "Apr", total: 322940 },
];

type GivingRow = {
  id: string;
  member: string;
  category: string;
  amount: string;
  paymentMethod: string;
  date: string;
  receiptStatus: "Issued" | "Pending" | "Not requested";
  financeSync: "Synced" | "Queued" | "Retry";
};

const records: GivingRow[] = [
  {
    id: "g-1",
    member: "Emmanuel A.",
    category: "Tithe",
    amount: "GHS 2,400.00",
    paymentMethod: "Mobile money",
    date: "2026-04-26",
    receiptStatus: "Issued",
    financeSync: "Synced",
  },
  {
    id: "g-2",
    member: "Ruth Mensah",
    category: "Offering",
    amount: "GHS 150.00",
    paymentMethod: "Card",
    date: "2026-04-26",
    receiptStatus: "Pending",
    financeSync: "Queued",
  },
  {
    id: "g-3",
    member: "Anonymous",
    category: "Donation · building",
    amount: "GHS 5,000.00",
    paymentMethod: "Bank transfer",
    date: "2026-04-25",
    receiptStatus: "Issued",
    financeSync: "Synced",
  },
  {
    id: "g-4",
    member: "Daniel K.",
    category: "Pledge installment",
    amount: "GHS 500.00",
    paymentMethod: "Mobile money",
    date: "2026-04-24",
    receiptStatus: "Issued",
    financeSync: "Synced",
  },
  {
    id: "g-5",
    member: "Grace O.",
    category: "Welfare",
    amount: "GHS 200.00",
    paymentMethod: "Cash (recorded)",
    date: "2026-04-23",
    receiptStatus: "Not requested",
    financeSync: "Retry",
  },
];

const pledges = {
  active: [
    { who: "Brother S.", goal: "GHS 12,000", paid: "GHS 4,800", due: "Dec 2026" },
    { who: "Sister A.", goal: "GHS 6,000", paid: "GHS 3,600", due: "Aug 2026" },
  ],
  fulfilled: [
    { who: "Family N.", amount: "GHS 3,000", completed: "Apr 2026" },
    { who: "Youth camp team", amount: "GHS 8,500", completed: "Mar 2026" },
  ],
  outstanding: [
    { who: "Member (initials J.T.)", pledged: "GHS 2,400", behind: "1 installment" },
    { who: "Men’s ministry", pledged: "GHS 15,000", behind: "Awaiting first payment" },
  ],
} as const;

function pillReceipt(s: GivingRow["receiptStatus"]) {
  const map: Record<GivingRow["receiptStatus"], string> = {
    Issued: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Pending: "border-amber-500/25 bg-amber-950/35 text-amber-100",
    "Not requested": "border-slate-500/25 bg-slate-900/40 text-slate-300",
  };
  return map[s];
}

function pillSync(s: GivingRow["financeSync"]) {
  const map: Record<GivingRow["financeSync"], string> = {
    Synced: "border-teal-500/25 bg-teal-950/35 text-teal-100",
    Queued: "border-sky-500/25 bg-sky-950/35 text-sky-100",
    Retry: "border-rose-500/25 bg-rose-950/35 text-rose-100",
  };
  return map[s];
}

export default function AdminGivingPage() {
  const [feedback, setFeedback] = useState("");

  return (
    <main className="space-y-5">
      <AdminPageHeader
        title="Giving Management"
        description="Monitor member contributions with clarity, gratitude, and stewardship. This view tracks giving categories and member activity—it is not full accounting; recognised totals feed Finance on schedule."
        actions={
          <>
            <Button
              className="h-9 rounded-lg border border-teal-400/25 bg-gradient-to-br from-teal-950/70 to-[#0f1a1c] text-teal-50 shadow-none hover:from-teal-900/75 hover:to-[#122220]"
              onClick={() => setFeedback("View Giving Records opens the searchable ledger when connected.")}
            >
              <FileSpreadsheet className="size-4 text-teal-200/90" aria-hidden />
              View Giving Records
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-lg border-amber-400/20 bg-white/[0.05] text-white hover:bg-white/[0.09]"
              onClick={() => setFeedback("Export Giving Summary will offer CSV/PDF when connected.")}
            >
              <Download className="size-4 text-amber-200/85" aria-hidden />
              Export Giving Summary
            </Button>
          </>
        }
      />

      {feedback ? (
        <p className="rounded-lg border border-teal-500/15 bg-teal-950/20 px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <section className="shepherd-fade-in grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <AdminCard
            key={card.label}
            title={card.label}
            className="border-teal-500/10 bg-gradient-to-b from-teal-950/12 to-transparent"
          >
            <p className="text-xl font-semibold tracking-tight text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.note}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard
        title="Giving trends"
        description="Month-by-month totals (mock)—for gratitude-shaped updates, not surveillance of individuals."
        className="border-white/10"
      >
        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="givingBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(45 212 191 / 0.55)" stopOpacity={1} />
                  <stop offset="100%" stopColor="rgb(45 212 191 / 0.12)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#94a3b8"
                fontSize={11}
                width={52}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => {
                  const n = typeof value === "number" ? value : Number(value ?? 0);
                  return [`GHS ${n.toLocaleString()}`, "Total giving"];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15, 40, 38, 0.95)",
                  color: "#fff",
                }}
              />
              <Bar dataKey="total" fill="url(#givingBar)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AdminCard>

      <AdminCard title="Giving records" description="Recent contributions with receipt and finance handoff status (illustrative)." className="border-white/10">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1020px] border-collapse text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                {["Member", "Category", "Amount", "Payment Method", "Date", "Receipt Status", "Finance Sync Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06] bg-white/[0.02]">
                  <td className="px-3 py-2.5 font-medium text-white">{row.member}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.category}</td>
                  <td className="px-3 py-2.5 tabular-nums text-white">{row.amount}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.paymentMethod}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">
                    {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", pillReceipt(row.receiptStatus))}>
                      {row.receiptStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", pillSync(row.financeSync))}>
                      {row.financeSync}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Pledge tracking"
          description="Commitments honoured over time—with patience for those catching up."
          className="border-amber-400/10 bg-gradient-to-b from-amber-950/10 to-transparent"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-200/80">Active pledges</p>
              <ul className="mt-2 space-y-2">
                {pledges.active.map((p) => (
                  <li key={p.who} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    <span className="font-medium text-white">{p.who}</span> · {p.paid} of {p.goal}
                    <span className="block text-xs text-slate-500">Target by {p.due}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-200/80">Fulfilled pledges</p>
              <ul className="mt-2 space-y-2">
                {pledges.fulfilled.map((p) => (
                  <li key={p.who} className="rounded-lg border border-emerald-500/15 bg-emerald-950/20 px-3 py-2 text-sm text-slate-300">
                    <span className="font-medium text-white">{p.who}</span> · {p.amount}
                    <span className="block text-xs text-slate-500">Completed {p.completed}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-rose-200/70">Outstanding</p>
              <ul className="mt-2 space-y-2">
                {pledges.outstanding.map((p) => (
                  <li key={p.who} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                    <span className="font-medium text-white">{p.who}</span> · {p.pledged}
                    <span className="block text-xs text-slate-500">{p.behind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Receipt management"
          description="Templates, numbering, and member-facing confirmations will live here—distinct from Finance journals."
          className="border-white/10"
        >
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-teal-400/25 bg-teal-950/15 px-4 py-5">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Gift className="size-5 text-teal-300/90" aria-hidden />
              Receipts & acknowledgements
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Placeholder for bulk issue, re-send, and audit-friendly receipt series. Giving receipts affirm gratitude; Finance
              records the accounting treatment separately.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400">
              <Heart className="size-4 shrink-0 text-amber-200/70" aria-hidden />
              Design principle: clear, kind language—never shaming language on receipts or reminders.
            </div>
          </div>
        </AdminCard>
      </div>
    </main>
  );
}
