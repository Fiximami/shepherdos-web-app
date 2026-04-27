"use client";

import { CheckCircle2, HandCoins, HeartHandshake, PiggyBank, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type GivingCategory = "Tithe" | "Offering" | "Donation" | "Pledge" | "Welfare";
type PaymentMethod = "Card" | "Bank Transfer" | "Mobile Money";

type GivingHistoryItem = {
  id: string;
  category: GivingCategory;
  amount: number;
  method: PaymentMethod;
  date: string;
  status: "Completed" | "Pending";
};

const givingCategories: Array<{ name: GivingCategory; detail: string }> = [
  { name: "Tithe", detail: "Regular stewardship giving" },
  { name: "Offering", detail: "Worship and thanksgiving gift" },
  { name: "Donation", detail: "General ministry support" },
  { name: "Pledge", detail: "Planned commitment fulfillment" },
  { name: "Welfare", detail: "Care support for members in need" },
];

const initialHistory: GivingHistoryItem[] = [
  {
    id: "g-1",
    category: "Tithe",
    amount: 1200,
    method: "Bank Transfer",
    date: "Apr 24, 2026",
    status: "Completed",
  },
  {
    id: "g-2",
    category: "Offering",
    amount: 300,
    method: "Mobile Money",
    date: "Apr 21, 2026",
    status: "Completed",
  },
  {
    id: "g-3",
    category: "Pledge",
    amount: 500,
    method: "Card",
    date: "Apr 18, 2026",
    status: "Pending",
  },
];

function formatCurrency(amount: number) {
  return `GHS ${amount.toLocaleString("en-GH")}`;
}

export function MemberGivingPageView() {
  const [selectedCategory, setSelectedCategory] = useState<GivingCategory>("Offering");
  const [amountInput, setAmountInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Mobile Money");
  const [history, setHistory] = useState<GivingHistoryItem[]>(initialHistory);
  const [feedback, setFeedback] = useState("");

  const parsedAmount = Number(amountInput);
  const canSubmit = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const totalGiven = useMemo(
    () => history.filter((item) => item.status === "Completed").reduce((sum, item) => sum + item.amount, 0),
    [history],
  );

  const thisMonthCount = history.length;

  const handleSubmitGiving = () => {
    if (!canSubmit) {
      setFeedback("Please enter a valid giving amount before continuing.");
      return;
    }

    const nextItem: GivingHistoryItem = {
      id: `g-${Date.now()}`,
      category: selectedCategory,
      amount: parsedAmount,
      method: paymentMethod,
      date: "Just now",
      status: "Completed",
    };

    setHistory((current) => [nextItem, ...current]);
    setAmountInput("");
    setFeedback("Thank you for giving. Your contribution has been recorded in this preview.");
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Giving"
            description="Give faithfully with clarity and peace—supporting worship, care, and church mission through a simple member giving flow."
          />
        </div>
      </section>

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Giving categories</CardTitle>
              <CardDescription>Select where this contribution should be applied.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {givingCategories.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-[1px]",
                      isActive
                        ? "border-amber-200/35 bg-amber-300/10"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                    )}
                  >
                    <p className="text-sm font-medium text-white">{category.name}</p>
                    <p className="text-xs text-gray-400">{category.detail}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Make a contribution</CardTitle>
              <CardDescription>
                Enter your amount and preferred payment method. This is a member payment flow only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Amount</p>
                <input
                  value={amountInput}
                  onChange={(event) => {
                    setAmountInput(event.target.value);
                    if (feedback) setFeedback("");
                  }}
                  placeholder="Enter amount (e.g. 200)"
                  inputMode="decimal"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Payment method</p>
                <div className="flex flex-wrap gap-2">
                  {(["Card", "Bank Transfer", "Mobile Money"] as const).map((method) => {
                    const isActive = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                          isActive
                            ? "border-primary/35 bg-primary/12 text-white"
                            : "border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]",
                        )}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="button" className="h-9 rounded-lg" disabled={!canSubmit} onClick={handleSubmitGiving}>
                <HandCoins className="size-4" aria-hidden />
                Give now
              </Button>

              {feedback ? <p className="text-xs text-gray-300">{feedback}</p> : null}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Giving history</CardTitle>
              <CardDescription>Your recent contributions in this preview workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {history.map((item) => (
                <article key={item.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{item.category}</p>
                      <p className="text-xs text-gray-400">
                        {item.method} · {item.date}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</p>
                  </div>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full px-2 py-1 text-[11px]",
                      item.status === "Completed" ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-200",
                    )}
                  >
                    {item.status}
                  </span>
                </article>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Giving summary</CardTitle>
              <CardDescription>Personal stewardship snapshot for this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Total completed giving</p>
                <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(totalGiven)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Contributions this month</p>
                <p className="mt-1 text-lg font-semibold text-white">{thisMonthCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-gray-400">Selected category</p>
                <p className="mt-1 text-sm font-medium text-amber-100">{selectedCategory}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Pledge tracking</CardTitle>
              <CardDescription>Placeholder for pledge milestones and reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-6">
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  <PiggyBank className="size-4 text-amber-200/90" aria-hidden />
                  Pledge tracking coming soon
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Commitment progress, reminders, and milestone encouragement will appear here in a future update.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Stewardship note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-300">
              <p className="inline-flex items-center gap-1.5">
                <HeartHandshake className="size-3.5 text-blue-200/90" aria-hidden />
                Giving here is designed for members, with care and simplicity.
              </p>
              <p className="inline-flex items-center gap-1.5">
                <ReceiptText className="size-3.5 text-blue-200/90" aria-hidden />
                Finance officer and admin controls remain in the leadership workspace.
              </p>
              <p className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-amber-200/90" aria-hidden />
                Thank you for supporting worship, care, and mission.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
