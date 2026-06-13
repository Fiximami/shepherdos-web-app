"use client";

import { Download, FileText, HandCoins, HeartHandshake } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { useMemberProfileFields } from "@/hooks/use-member-profile-fields";
import { fetchGivingRecords } from "@/lib/api/giving";
import { mapMemberGivingHistoryItem } from "@/lib/api/mappers";
import { buildReceiptId, receiptRecords, type ReceiptCategory, type ReceiptPaymentMethod } from "@/lib/mock-receipts";
import { cn } from "@/lib/utils";

export type GivingCategory = ReceiptCategory;

type PaymentMethod = ReceiptPaymentMethod;

type GivingHistoryItem = {
  id: string;
  receiptId: string | null;
  financeReference: string | null;
  category: GivingCategory | string;
  amount: number;
  method: PaymentMethod | string;
  dateISO: string;
  status: "Completed" | "Pending";
};

const givingCategories: Array<{ name: GivingCategory; detail: string }> = [
  { name: "Tithe", detail: "Returning a portion in faith and gratitude" },
  { name: "Offering", detail: "A joyful gift in worship beyond your tithe" },
  { name: "Special Donation", detail: "One-time or designated support" },
  { name: "Welfare", detail: "Care for members facing hardship" },
  { name: "Pledge", detail: "Toward a commitment you have made" },
  { name: "Project Support", detail: "Building, equipment, or facility needs" },
  { name: "Missions / Outreach", detail: "Gospel work beyond our walls" },
];

const initialHistory: GivingHistoryItem[] = [
  {
    id: "g-1",
    receiptId: "RCPT-2026-004122",
    financeReference: "INC-2026-08912",
    category: "Tithe",
    amount: 2400,
    method: "Mobile Money",
    dateISO: "2026-04-22",
    status: "Completed",
  },
  {
    id: "g-2",
    receiptId: "RCPT-2026-004087",
    financeReference: "INC-2026-08876",
    category: "Offering",
    amount: 350,
    method: "Card",
    dateISO: "2026-04-18",
    status: "Completed",
  },
  {
    id: "g-3",
    receiptId: "RCPT-2026-003995",
    financeReference: "INC-2026-08793",
    category: "Welfare",
    amount: 200,
    method: "Bank Transfer",
    dateISO: "2026-04-10",
    status: "Completed",
  },
  {
    id: "g-4",
    receiptId: "RCPT-2026-003872",
    financeReference: "INC-2026-08698",
    category: "Missions / Outreach",
    amount: 500,
    method: "Mobile Money",
    dateISO: "2026-03-28",
    status: "Completed",
  },
  {
    id: "g-5",
    receiptId: "RCPT-2026-002455",
    financeReference: "INC-2026-07802",
    category: "Pledge",
    amount: 600,
    method: "Card",
    dateISO: "2026-02-14",
    status: "Completed",
  },
  {
    id: "g-6",
    receiptId: null,
    financeReference: null,
    category: "Project Support",
    amount: 150,
    method: "Mobile Money",
    dateISO: "2026-04-26",
    status: "Pending",
  },
];

type PledgeRow = {
  id: string;
  name: string;
  target: number;
  paid: number;
};

const pledgeRows: PledgeRow[] = [
  { id: "p-1", name: "Sanctuary refurbishment", target: 5000, paid: 3200 },
  { id: "p-2", name: "Missions pledge · East Africa", target: 1200, paid: 400 },
];

function formatCurrency(amount: number) {
  return `GHS ${amount.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatDisplayDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isSameMonth(iso: string, ref: Date) {
  const d = new Date(iso + "T12:00:00");
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

function isSameYear(iso: string, ref: Date) {
  return new Date(iso + "T12:00:00").getFullYear() === ref.getFullYear();
}

export function MemberGivingPageView() {
  const { user } = useMemberProfileFields();
  const now = useMemo(() => new Date(), []);
  const [selectedCategory, setSelectedCategory] = useState<GivingCategory>("Tithe");
  const [amountInput, setAmountInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Mobile Money");
  const [note, setNote] = useState("");
  const [localHistory, setLocalHistory] = useState<GivingHistoryItem[]>([]);
  const recordsQuery = useApiData(
    "member-giving-records",
    async () => (await fetchGivingRecords()).map(mapMemberGivingHistoryItem),
    initialHistory,
  );
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<Set<string>>(new Set());
  const [previewReceiptId, setPreviewReceiptId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const history = useMemo(() => {
    const base = recordsQuery.isLive ? recordsQuery.data : initialHistory;
    return [...localHistory, ...base];
  }, [localHistory, recordsQuery.data, recordsQuery.isLive]);

  const parsedAmount = Number(amountInput);
  const canSubmit = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const completed = useMemo(() => history.filter((h) => h.status === "Completed"), [history]);

  const totalThisMonth = useMemo(
    () => completed.filter((h) => isSameMonth(h.dateISO, now)).reduce((s, h) => s + h.amount, 0),
    [completed, now],
  );

  const totalThisYear = useMemo(
    () => completed.filter((h) => isSameYear(h.dateISO, now)).reduce((s, h) => s + h.amount, 0),
    [completed, now],
  );

  const lastGivingIso = useMemo(() => {
    if (completed.length === 0) return null;
    return completed.reduce((latest, h) => (h.dateISO > latest ? h.dateISO : latest), completed[0].dateISO);
  }, [completed]);

  const toggleReceiptSelection = (id: string) => {
    setSelectedReceiptIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmitGiving = () => {
    if (!canSubmit) {
      setFeedback("Please enter a valid amount to continue.");
      return;
    }

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const nextItem: GivingHistoryItem = {
      id: `g-${Date.now()}`,
      receiptId: buildReceiptId(Date.now()),
      financeReference: `INC-2026-${String(Date.now()).slice(-5)}`,
      category: selectedCategory,
      amount: parsedAmount,
      method: paymentMethod,
      dateISO: `${y}-${m}-${d}`,
      status: "Completed",
    };

    setLocalHistory((cur) => [nextItem, ...cur]);
    setAmountInput("");
    setNote("");
    setFeedback("Thank you. In a live workspace this would open secure payment; here your gift is recorded for preview only.");
  };

  const sortedHistory = useMemo(() => [...history].sort((a, b) => b.dateISO.localeCompare(a.dateISO)), [history]);
  const receiptIndex = useMemo(() => new Map(receiptRecords.map((r) => [r.receiptId, r])), []);
  const previewReceipt = useMemo(() => {
    if (!previewReceiptId) return null;
    const fromLibrary = receiptIndex.get(previewReceiptId);
    if (fromLibrary) return fromLibrary;
    const fromHistory = history.find((h) => h.receiptId === previewReceiptId);
    if (!fromHistory || !fromHistory.receiptId || !fromHistory.financeReference) return null;
    return {
      receiptId: fromHistory.receiptId,
      transactionId: fromHistory.id,
      financeReference: fromHistory.financeReference,
      dateISO: fromHistory.dateISO,
      amount: fromHistory.amount,
      category: fromHistory.category,
      paymentMethod: fromHistory.method,
      createdBy: `Member Portal · ${user.name}`,
    };
  }, [history, previewReceiptId, receiptIndex, user.name]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-amber-500/10 bg-[#0f1f2d]/85 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div
          className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_72%)]"
          aria-hidden
        />
        <div className="relative z-10">
          <PageHeader
            title="Giving"
            description="Give faithfully, track your contributions, and keep official records of your giving."
            className="mb-0"
          />
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
            This page is for your stewardship only. Church finance and accounting stay in the leadership workspace—you never
            need to manage ledgers here.
          </p>
        </div>
      </section>

      <ApiConnectionNotice
        isLoading={recordsQuery.isLoading}
        error={recordsQuery.error}
        isLive={recordsQuery.isLive}
        fallbackLabel="Giving records are shown from finance transactions until dedicated giving endpoints are available."
      />

      <section className="shepherd-fade-in">
        <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="text-base text-white sm:text-lg">Giving categories</CardTitle>
            <CardDescription>Choose what this gift supports—each category helps the church in a different way.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {givingCategories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-[1px]",
                    isActive
                      ? "border-amber-400/35 bg-amber-500/10 ring-1 ring-amber-400/20"
                      : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]",
                  )}
                >
                  <p className="text-sm font-medium text-white">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{cat.detail}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">Give now</CardTitle>
              <CardDescription>Enter details below. Payment will connect securely when your church enables it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="giving-type">
                  Giving type
                </label>
                <input
                  id="giving-type"
                  readOnly
                  value={selectedCategory}
                  className="mt-1.5 h-10 w-full cursor-default rounded-lg border border-amber-500/15 bg-[#0c1824]/80 px-3 text-sm text-amber-50/95 outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-600">Select a category above to change this.</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    if (feedback) setFeedback("");
                  }}
                  placeholder="e.g. 500"
                  inputMode="decimal"
                  className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-amber-400/25"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Payment method</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Mobile Money", "Card", "Bank Transfer"] as const).map((method) => {
                    const isActive = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                          isActive
                            ? "border-amber-400/40 bg-amber-500/10 text-amber-50"
                            : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]",
                        )}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500" htmlFor="note">
                  Optional note
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="A short dedication or scripture (optional)"
                  className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-amber-400/25"
                />
              </div>
              <Button
                type="button"
                className="h-10 rounded-lg border border-amber-500/25 bg-gradient-to-r from-amber-950/60 to-[#132433] text-amber-50 hover:from-amber-900/50 hover:to-[#162a3d]"
                disabled={!canSubmit}
                onClick={handleSubmitGiving}
              >
                <HandCoins className="size-4" aria-hidden />
                Continue
              </Button>
              {feedback ? <p className="text-xs text-slate-400">{feedback}</p> : null}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">Giving summary</CardTitle>
              <CardDescription>Your personal totals—visible only to you and authorised church staff.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0c1824]/60 px-4 py-3">
                <p className="text-xs text-slate-500">Total given this month</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-white">{formatCurrency(totalThisMonth)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0c1824]/60 px-4 py-3">
                <p className="text-xs text-slate-500">Total given this year</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-white">{formatCurrency(totalThisYear)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0c1824]/60 px-4 py-3">
                <p className="text-xs text-slate-500">Active pledges</p>
                <p className="mt-1 text-lg font-semibold text-white">{pledgeRows.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0c1824]/60 px-4 py-3">
                <p className="text-xs text-slate-500">Last giving date</p>
                <p className="mt-1 text-lg font-semibold text-white">{lastGivingIso ? formatDisplayDate(lastGivingIso) : "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">Giving history</CardTitle>
              <CardDescription>Every completed gift can have a receipt for your records.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="w-10 py-2 pr-2" aria-label="Select for receipt" />
                    <th className="py-2 pr-3">Receipt ID</th>
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Giving type</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Payment method</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((row) => {
                    const canReceipt = row.status === "Completed";
                    return (
                      <tr key={row.id} className="border-b border-white/[0.06] last:border-0">
                        <td className="py-2.5 pr-2">
                          {canReceipt ? (
                            <input
                              type="checkbox"
                              checked={selectedReceiptIds.has(row.id)}
                              onChange={() => toggleReceiptSelection(row.id)}
                              className="rounded border-white/20 bg-[#0c1824]"
                              aria-label={`Select ${formatDisplayDate(row.dateISO)} for batch receipt`}
                            />
                          ) : (
                            <span className="inline-block w-4" />
                          )}
                        </td>
                        <td className="py-2.5 pr-3 font-mono text-[11px] text-amber-100/80">{row.receiptId ?? "Pending"}</td>
                        <td className="py-2.5 pr-3 tabular-nums text-slate-400">{formatDisplayDate(row.dateISO)}</td>
                        <td className="py-2.5 pr-3 text-white">{row.category}</td>
                        <td className="py-2.5 pr-3 font-medium tabular-nums text-white">{formatCurrency(row.amount)}</td>
                        <td className="py-2.5 pr-3 text-slate-400">{row.method}</td>
                        <td className="py-2.5 pr-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[11px]",
                              row.status === "Completed" ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200",
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {canReceipt ? (
                            <button
                              type="button"
                              onClick={() => setFeedback(`Download receipt ${row.receiptId ?? "Pending"} (preview).`)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-amber-200/90 hover:text-amber-100"
                            >
                              <Download className="size-3.5" aria-hidden />
                              Download receipt
                            </button>
                          ) : null}
                          {canReceipt && row.receiptId ? (
                            <button
                              type="button"
                              onClick={() => setPreviewReceiptId(row.receiptId)}
                              className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white"
                            >
                              <FileText className="size-3.5" aria-hidden />
                              Preview
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border border-amber-500/10 bg-amber-950/[0.08] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">Receipts & statements</CardTitle>
              <CardDescription>Official documents for tax or personal records—served as PDF when enabled.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                className="h-9 border-amber-500/25 bg-[#0c1824]/80 text-amber-50 hover:bg-[#0c1824]"
                disabled={selectedReceiptIds.size === 0}
                onClick={() =>
                  setFeedback(
                    `Download selected receipts (${selectedReceiptIds.size}) — preview bundle. Includes receipt IDs, dates, amounts, categories, and methods.`,
                  )
                }
              >
                <FileText className="size-4" aria-hidden />
                Download selected receipts
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 border-white/15 bg-transparent text-white hover:bg-white/[0.06]"
                onClick={() => setFeedback(`Download annual giving statement for ${now.getFullYear()} (preview PDF).`)}
              >
                <Download className="size-4 text-amber-200/80" aria-hidden />
                Download annual giving statement
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">Pledge tracking</CardTitle>
              <CardDescription>Honouring commitments at a pace that fits your season.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pledgeRows.map((p) => {
                const balance = Math.max(0, p.target - p.paid);
                const pct = Math.min(100, Math.round((p.paid / p.target) * 100));
                return (
                  <div key={p.id} className="rounded-xl border border-white/10 bg-[#0c1824]/60 px-4 py-3">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Target</p>
                        <p className="mt-0.5 tabular-nums text-slate-300">{formatCurrency(p.target)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Paid</p>
                        <p className="mt-0.5 tabular-nums text-emerald-200/90">{formatCurrency(p.paid)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Balance</p>
                        <p className="mt-0.5 tabular-nums text-amber-100/90">{formatCurrency(balance)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide">Progress</p>
                        <p className="mt-0.5 tabular-nums text-white">{pct}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-700/80 to-amber-400/70 transition-[width] duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base text-white sm:text-lg">A word of thanks</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 text-xs leading-relaxed text-slate-400">
              <HeartHandshake className="mt-0.5 size-4 shrink-0 text-amber-200/70" aria-hidden />
              <p>
                Every gift supports worship, compassion, and mission. Thank you for partnering with your church family in
                faith—not performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {previewReceipt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0d1b2b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm font-semibold text-white">Receipt Preview</p>
              <button
                type="button"
                onClick={() => setPreviewReceiptId(null)}
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-lg font-semibold text-white">ShepherdOS Giving Receipt</p>
                <p className="mt-1 text-xs text-slate-400">Official record for member contribution (mock preview).</p>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <p className="text-slate-300">Receipt ID: <span className="font-mono text-amber-100/85">{previewReceipt.receiptId}</span></p>
                  <p className="text-slate-300">Finance Ref: <span className="font-mono text-amber-100/85">{previewReceipt.financeReference}</span></p>
                  <p className="text-slate-300">Date: {formatDisplayDate(previewReceipt.dateISO)}</p>
                  <p className="text-slate-300">Amount: {formatCurrency(previewReceipt.amount)}</p>
                  <p className="text-slate-300">Category: {previewReceipt.category}</p>
                  <p className="text-slate-300">Payment method: {previewReceipt.paymentMethod}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-amber-500/25 bg-[#0c1824]/80 text-amber-50 hover:bg-[#0c1824]"
                  onClick={() => setFeedback(`Download single receipt ${previewReceipt.receiptId} (preview PDF).`)}
                >
                  <Download className="size-4" aria-hidden />
                  Download single receipt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-white/15 bg-transparent text-white hover:bg-white/[0.06]"
                  onClick={() => setFeedback(`Print-ready view for ${previewReceipt.receiptId} (preview).`)}
                >
                  Printable format
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
