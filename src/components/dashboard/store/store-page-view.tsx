"use client";

import { BookOpenText, Boxes, Download, PackageCheck, ShoppingBag, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StoreCategory =
  | "Books & Devotionals"
  | "Sermon Materials"
  | "Church Branded Items"
  | "Event Materials"
  | "Ministry Resources"
  | "Uniforms & Robes"
  | "Training Materials";

type PaymentOption = "Pay Online" | "Pay Physical Cash";
type PaymentStatus = "Paid" | "Pending Confirmation";
type FulfillmentStatus = "Ready for Pickup" | "Processing" | "Awaiting Pickup";

type StoreItem = {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  description: string;
  featured?: boolean;
};

type PurchaseRow = {
  id: string;
  item: string;
  quantity: number;
  amount: number;
  paymentMethod: PaymentOption;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  dateISO: string;
};

const storeCategories: StoreCategory[] = [
  "Books & Devotionals",
  "Sermon Materials",
  "Church Branded Items",
  "Event Materials",
  "Ministry Resources",
  "Uniforms & Robes",
  "Training Materials",
];

const storeItems: StoreItem[] = [
  {
    id: "st-1",
    name: "Daily Prayer Devotional (2026 Edition)",
    category: "Books & Devotionals",
    price: 85,
    availability: "In Stock",
    description: "Guided weekly readings for personal and family devotion time.",
    featured: true,
  },
  {
    id: "st-2",
    name: "Sermon Notes Journal Pack",
    category: "Sermon Materials",
    price: 40,
    availability: "In Stock",
    description: "Structured notebook set for Sunday messages and application points.",
    featured: true,
  },
  {
    id: "st-3",
    name: "Church Branded Polo",
    category: "Church Branded Items",
    price: 120,
    availability: "Low Stock",
    description: "Official church polo for workers and ministry representatives.",
    featured: true,
  },
  {
    id: "st-4",
    name: "Annual Convention Participant Kit",
    category: "Event Materials",
    price: 150,
    availability: "In Stock",
    description: "Name badge, guide booklet, writing materials, and event schedule.",
  },
  {
    id: "st-5",
    name: "Cell Group Leader Handbook",
    category: "Ministry Resources",
    price: 95,
    availability: "In Stock",
    description: "Practical guidance for shepherding, follow-up, and small-group growth.",
  },
  {
    id: "st-6",
    name: "Choir Robe (Navy/Gold)",
    category: "Uniforms & Robes",
    price: 260,
    availability: "Low Stock",
    description: "Official robe design approved for worship and special services.",
  },
  {
    id: "st-7",
    name: "New Worker Orientation Manual",
    category: "Training Materials",
    price: 70,
    availability: "In Stock",
    description: "Core training content for workers joining service teams.",
  },
  {
    id: "st-8",
    name: "Prayer Team Resource Bundle",
    category: "Ministry Resources",
    price: 110,
    availability: "Out of Stock",
    description: "Prayer templates and care notes used by intercession teams.",
  },
];

const initialPurchases: PurchaseRow[] = [
  {
    id: "po-1",
    item: "Daily Prayer Devotional (2026 Edition)",
    quantity: 1,
    amount: 85,
    paymentMethod: "Pay Online",
    paymentStatus: "Paid",
    fulfillmentStatus: "Ready for Pickup",
    dateISO: "2026-04-24",
  },
  {
    id: "po-2",
    item: "Church Branded Polo",
    quantity: 2,
    amount: 240,
    paymentMethod: "Pay Physical Cash",
    paymentStatus: "Pending Confirmation",
    fulfillmentStatus: "Awaiting Pickup",
    dateISO: "2026-04-26",
  },
];

function formatMoney(value: number) {
  return `GHS ${value.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function StorePageView() {
  const [activeCategory, setActiveCategory] = useState<StoreCategory | "All">("All");
  const [feedback, setFeedback] = useState("");
  const [purchases, setPurchases] = useState<PurchaseRow[]>(initialPurchases);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("Pay Online");
  const [note, setNote] = useState("");

  const featuredItems = useMemo(() => storeItems.filter((item) => item.featured), []);
  const visibleItems = useMemo(
    () => storeItems.filter((item) => activeCategory === "All" || item.category === activeCategory),
    [activeCategory],
  );

  const openOrderModal = (item: StoreItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setPaymentOption("Pay Online");
    setNote("");
  };

  const closeOrderModal = () => {
    setSelectedItem(null);
    setQuantity(1);
    setNote("");
  };

  const submitOrder = () => {
    if (!selectedItem) return;
    const computedAmount = selectedItem.price * quantity;
    const next: PurchaseRow = {
      id: `po-${Date.now()}`,
      item: selectedItem.name,
      quantity,
      amount: computedAmount,
      paymentMethod: paymentOption,
      paymentStatus: paymentOption === "Pay Online" ? "Paid" : "Pending Confirmation",
      fulfillmentStatus: paymentOption === "Pay Online" ? "Processing" : "Awaiting Pickup",
      dateISO: new Date().toISOString().slice(0, 10),
    };
    setPurchases((prev) => [next, ...prev]);
    setFeedback(
      paymentOption === "Pay Online"
        ? "Pay Online selected: placeholder flow started for future Paystack integration."
        : "Pay Physical Cash selected: order created and pending admin payment confirmation.",
    );
    closeOrderModal();
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in rounded-2xl border border-amber-500/10 bg-[#0f1f2d]/85 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <PageHeader
          title="Church Store"
          description="Access church resources, materials, and official items made available by your church."
          className="mb-0"
        />
      </section>

      {feedback ? (
        <p className="rounded-lg border border-white/10 bg-[#0c1824]/80 px-3 py-2 text-xs text-slate-300">{feedback}</p>
      ) : null}

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Featured items</CardTitle>
          <CardDescription>Highlighted resources and official materials available now.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-[#0c1824]/70 p-3">
              <div className="flex h-28 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-500">
                item image placeholder
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-xs text-slate-400">{item.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-amber-100/90">{formatMoney(item.price)}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">{item.availability}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFeedback(`View details placeholder: ${item.name}`)}
                  className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => openOrderModal(item)}
                  className="rounded-md border border-amber-500/20 px-2 py-1 text-xs text-amber-100 hover:bg-amber-950/25"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Product categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs",
              activeCategory === "All" ? "border-amber-400/35 bg-amber-500/10 text-amber-100" : "border-white/10 text-slate-300",
            )}
          >
            All
          </button>
          {storeCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs",
                activeCategory === category ? "border-amber-400/35 bg-amber-500/10 text-amber-100" : "border-white/10 text-slate-300",
              )}
            >
              {category}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">Store items</CardTitle>
          <CardDescription>Browse church-approved resources and official materials.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-[#0c1824]/70 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <Tag className="size-4 text-amber-200/80" aria-hidden />
              </div>
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              <div className="mt-3 grid gap-1 text-xs">
                <p className="text-slate-300">Category: <span className="text-slate-400">{item.category}</span></p>
                <p className="text-slate-300">Availability: <span className="text-slate-400">{item.availability}</span></p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-amber-100/90">{formatMoney(item.price)}</span>
                <button
                  type="button"
                  disabled={item.availability === "Out of Stock"}
                  onClick={() => openOrderModal(item)}
                  className="rounded-md border border-amber-500/20 px-2 py-1 text-xs text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.availability === "Out of Stock" ? "Reserve" : "Buy / Reserve"}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-white">My purchases</CardTitle>
          <CardDescription>Track payment state and pickup or delivery progress for your orders.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                {["Item", "Quantity", "Amount", "Payment Method", "Payment Status", "Pickup/Delivery", "Receipt"].map((h) => (
                  <th key={h} className="px-2 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.06]">
                  <td className="px-2 py-2.5 text-white">{row.item}</td>
                  <td className="px-2 py-2.5 text-slate-300">{row.quantity}</td>
                  <td className="px-2 py-2.5 font-medium text-white">{formatMoney(row.amount)}</td>
                  <td className="px-2 py-2.5 text-slate-300">{row.paymentMethod}</td>
                  <td className="px-2 py-2.5">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px]", row.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200")}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-slate-300">{row.fulfillmentStatus}</td>
                  <td className="px-2 py-2.5">
                    <button
                      type="button"
                      onClick={() => setFeedback(`Receipt action placeholder for order ${row.id}.`)}
                      className="inline-flex items-center gap-1 text-xs text-amber-100/90 hover:text-amber-50"
                    >
                      <Download className="size-3.5" aria-hidden />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0d1b2b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-sm font-semibold text-white">Purchase / Order</p>
              <button
                type="button"
                onClick={closeOrderModal}
                className="rounded-md border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/[0.06]"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-sm font-semibold text-white">{selectedItem.name}</p>
                <p className="mt-1 text-xs text-slate-400">{selectedItem.category}</p>
                <p className="mt-2 text-sm text-amber-100/90">{formatMoney(selectedItem.price)} each</p>
              </div>
              <label className="block">
                <span className="text-xs text-slate-500">Quantity</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none"
                />
              </label>
              <div>
                <p className="text-xs text-slate-500">Payment option</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["Pay Online", "Pay Physical Cash"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPaymentOption(option)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs",
                        paymentOption === option ? "border-amber-500/35 bg-amber-500/10 text-amber-100" : "border-white/10 text-slate-300",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="text-xs text-slate-500">Optional note</span>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any pickup instructions or sizing notes"
                  className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none"
                />
              </label>
              <p className="text-xs text-slate-400">
                {paymentOption === "Pay Online"
                  ? "Pay Online uses a placeholder flow now and will connect to Paystack later."
                  : "Pay Physical Cash creates a pending order that admin confirms after payment."}
              </p>
              <Button
                type="button"
                className="h-10 w-full rounded-lg border border-amber-500/25 bg-gradient-to-r from-amber-950/60 to-[#132433] text-amber-50"
                onClick={submitOrder}
              >
                <ShoppingBag className="size-4" aria-hidden />
                Confirm order
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <BookOpenText className="mb-1 size-4 text-amber-200/75" aria-hidden />
          Church resources are curated for discipleship, ministry, and official church activities.
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <Boxes className="mb-1 size-4 text-amber-200/75" aria-hidden />
          Inventory display is mock-only for now. Live stock sync will be connected later.
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <PackageCheck className="mb-1 size-4 text-amber-200/75" aria-hidden />
          Order confirmations, pickup, and receipt actions are placeholders in this preview.
        </div>
      </section>
    </main>
  );
}
