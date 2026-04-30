"use client";

import { Boxes, ClipboardCheck, Download, PackagePlus, PencilLine, Plus, ShieldCheck, Store, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InventoryCategory =
  | "Books & Devotionals"
  | "Sermon Materials"
  | "Church Branded Items"
  | "Event Materials"
  | "Ministry Resources"
  | "Uniforms & Robes"
  | "Training Materials";

type StockStatus = "Healthy" | "Low Stock" | "Out of Stock";
type PaymentMethod = "Pay Online" | "Pay Physical Cash";
type PaymentStatus = "Pending Cash" | "Paid Online" | "Cash Confirmed" | "Cancelled";
type FulfillmentStatus = "Pending Pickup" | "Collected" | "Delivered";

type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  description: string;
  price: number;
  stockQty: number;
  minStock: number;
  stockStatus: StockStatus;
  salesCount: number;
  visibility: "Visible" | "Hidden";
  updatedAt: string;
};

type SaleOrder = {
  id: string;
  member: string;
  itemId: string;
  itemName: string;
  quantity: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
};

type AuditRow = {
  actor: string;
  action: string;
  timestamp: string;
};

const categories: InventoryCategory[] = [
  "Books & Devotionals",
  "Sermon Materials",
  "Church Branded Items",
  "Event Materials",
  "Ministry Resources",
  "Uniforms & Robes",
  "Training Materials",
];

const initialItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Daily Prayer Devotional (2026)",
    category: "Books & Devotionals",
    description: "Weekly prayer and scripture reflections for members and families.",
    price: 85,
    stockQty: 42,
    minStock: 10,
    stockStatus: "Healthy",
    salesCount: 64,
    visibility: "Visible",
    updatedAt: "2026-04-28T08:30:00",
  },
  {
    id: "inv-2",
    name: "Sermon Notes Journal Pack",
    category: "Sermon Materials",
    description: "Structured sermon note booklets for Sunday worship.",
    price: 40,
    stockQty: 7,
    minStock: 10,
    stockStatus: "Low Stock",
    salesCount: 91,
    visibility: "Visible",
    updatedAt: "2026-04-27T18:15:00",
  },
  {
    id: "inv-3",
    name: "Church Branded Polo",
    category: "Church Branded Items",
    description: "Official branded polo for service teams and ministry events.",
    price: 120,
    stockQty: 18,
    minStock: 12,
    stockStatus: "Healthy",
    salesCount: 53,
    visibility: "Visible",
    updatedAt: "2026-04-26T11:45:00",
  },
  {
    id: "inv-4",
    name: "Choir Robe (Navy/Gold)",
    category: "Uniforms & Robes",
    description: "Approved choir robe used for official worship services.",
    price: 260,
    stockQty: 3,
    minStock: 8,
    stockStatus: "Low Stock",
    salesCount: 22,
    visibility: "Visible",
    updatedAt: "2026-04-25T14:10:00",
  },
  {
    id: "inv-5",
    name: "New Worker Orientation Manual",
    category: "Training Materials",
    description: "Foundational training content for workers and volunteers.",
    price: 70,
    stockQty: 0,
    minStock: 10,
    stockStatus: "Out of Stock",
    salesCount: 37,
    visibility: "Hidden",
    updatedAt: "2026-04-24T09:20:00",
  },
];

const initialOrders: SaleOrder[] = [
  {
    id: "ord-2201",
    member: "Ruth Eze",
    itemId: "inv-1",
    itemName: "Daily Prayer Devotional (2026)",
    quantity: 2,
    amount: 170,
    paymentMethod: "Pay Online",
    paymentStatus: "Paid Online",
    fulfillmentStatus: "Pending Pickup",
    createdAt: "2026-04-28T10:14:00",
  },
  {
    id: "ord-2202",
    member: "Samuel Okoro",
    itemId: "inv-3",
    itemName: "Church Branded Polo",
    quantity: 1,
    amount: 120,
    paymentMethod: "Pay Physical Cash",
    paymentStatus: "Pending Cash",
    fulfillmentStatus: "Pending Pickup",
    createdAt: "2026-04-28T11:42:00",
  },
  {
    id: "ord-2203",
    member: "Miriam Osei",
    itemId: "inv-2",
    itemName: "Sermon Notes Journal Pack",
    quantity: 3,
    amount: 120,
    paymentMethod: "Pay Physical Cash",
    paymentStatus: "Cash Confirmed",
    fulfillmentStatus: "Collected",
    createdAt: "2026-04-27T16:08:00",
  },
  {
    id: "ord-2204",
    member: "Daniel K.",
    itemId: "inv-4",
    itemName: "Choir Robe (Navy/Gold)",
    quantity: 1,
    amount: 260,
    paymentMethod: "Pay Online",
    paymentStatus: "Cancelled",
    fulfillmentStatus: "Pending Pickup",
    createdAt: "2026-04-27T09:35:00",
  },
];

const initialAudit: AuditRow[] = [
  { actor: "A. Mensah", action: "Added item: Daily Prayer Devotional (2026)", timestamp: "2026-04-26 09:12" },
  { actor: "R. Eze", action: "Confirmed cash payment: ord-2203", timestamp: "2026-04-27 16:12" },
  { actor: "K. Boateng", action: "Adjusted stock: Sermon Notes Journal Pack (+20)", timestamp: "2026-04-27 17:00" },
];

function money(value: number) {
  return `GHS ${value.toLocaleString("en-GH")}`;
}

function stockBadge(status: StockStatus) {
  const map: Record<StockStatus, string> = {
    Healthy: "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    "Low Stock": "border-amber-500/25 bg-amber-950/35 text-amber-50",
    "Out of Stock": "border-rose-500/25 bg-rose-950/35 text-rose-100",
  };
  return map[status];
}

function paymentBadge(status: PaymentStatus) {
  const map: Record<PaymentStatus, string> = {
    "Pending Cash": "border-amber-500/25 bg-amber-950/35 text-amber-50",
    "Paid Online": "border-sky-500/25 bg-sky-950/35 text-sky-100",
    "Cash Confirmed": "border-emerald-500/25 bg-emerald-950/35 text-emerald-100",
    Cancelled: "border-slate-500/25 bg-slate-900/50 text-slate-300",
  };
  return map[status];
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [orders, setOrders] = useState<SaleOrder[]>(initialOrders);
  const [auditTrail, setAuditTrail] = useState<AuditRow[]>(initialAudit);
  const [feedback, setFeedback] = useState("");

  const totalItems = items.length;
  const lowStockItems = items.filter((i) => i.stockQty <= i.minStock).length;
  const pendingCashPayments = orders.filter((o) => o.paymentStatus === "Pending Cash").length;
  const salesThisMonth = orders.filter((o) => o.paymentStatus !== "Cancelled").length;
  const inventoryRevenue = orders
    .filter((o) => o.paymentStatus === "Paid Online" || o.paymentStatus === "Cash Confirmed")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingCashRevenue = orders
    .filter((o) => o.paymentStatus === "Pending Cash")
    .reduce((sum, o) => sum + o.amount, 0);
  const confirmedRevenue = orders
    .filter((o) => o.paymentStatus === "Paid Online" || o.paymentStatus === "Cash Confirmed")
    .reduce((sum, o) => sum + o.amount, 0);
  const onlineRevenue = orders.filter((o) => o.paymentStatus === "Paid Online").reduce((sum, o) => sum + o.amount, 0);

  const lowStockAlerts = useMemo(() => items.filter((item) => item.stockQty < item.minStock), [items]);

  const confirmCashPayment = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target || target.paymentStatus !== "Pending Cash") return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: "Cash Confirmed",
            }
          : order,
      ),
    );

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== target.itemId) return item;
        const nextStock = Math.max(0, item.stockQty - target.quantity);
        const nextStatus: StockStatus = nextStock === 0 ? "Out of Stock" : nextStock <= item.minStock ? "Low Stock" : "Healthy";
        return {
          ...item,
          stockQty: nextStock,
          salesCount: item.salesCount + target.quantity,
          stockStatus: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    setAuditTrail((prev) => [
      {
        actor: "Finance Officer · A. Mensah",
        action: `Confirmed cash payment: ${orderId} · Finance record created under Inventory Sales / Resource Sales`,
        timestamp: new Date().toLocaleString("en-GB"),
      },
      ...prev,
    ]);

    setFeedback(
      `Cash confirmed for ${orderId}. Revenue counted, stock updated, and finance sync placeholder created under Inventory Sales / Resource Sales.`,
    );
  };

  return (
    <main className="space-y-5 text-[#e8edf5]">
      <AdminPageHeader
        title="Inventory Management"
        description="Manage church resources, stock, sales, and inventory-linked income with accountability."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="h-9 rounded-lg border border-amber-500/25 bg-[#0f1a2e] text-amber-50 shadow-none hover:bg-[#152238]" onClick={() => setFeedback("Add Item placeholder opened.")}>
              <Plus className="size-4 text-amber-200/90" aria-hidden />
              Add Item
            </Button>
            <Button variant="outline" className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]" onClick={() => setFeedback("Record Sale placeholder opened.")}>
              <Store className="size-4 text-slate-300" aria-hidden />
              Record Sale
            </Button>
            <Button variant="outline" className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]" onClick={() => setFeedback("Restock Item placeholder opened.")}>
              <PackagePlus className="size-4 text-slate-300" aria-hidden />
              Restock Item
            </Button>
            <Button variant="outline" className="h-9 rounded-lg border-white/12 bg-[#0c1524] text-[#e8edf5] hover:bg-[#121f35]" onClick={() => setFeedback("Export Inventory Report placeholder triggered.")}>
              <Download className="size-4 text-slate-300" aria-hidden />
              Export Inventory Report
            </Button>
          </div>
        }
      />

      {feedback ? <p className="rounded-lg border border-amber-500/15 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">{feedback}</p> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total Items", String(totalItems)],
          ["Low Stock Items", String(lowStockItems)],
          ["Pending Cash Payments", String(pendingCashPayments)],
          ["Sales This Month", String(salesThisMonth)],
          ["Inventory Revenue", money(inventoryRevenue)],
        ].map(([label, value]) => (
          <AdminCard key={label} title={label} className="border-amber-500/10 bg-[#0a1426]/90">
            <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard title="Inventory items" description="Track item status, stock levels, and stewardship actions." className="border-white/10 bg-[#080f1c]/95">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1120px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Item Name", "Category", "Price", "Stock Quantity", "Stock Status", "Sales Count", "Last Updated", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-medium text-white">{item.name}</td>
                  <td className="px-3 py-2.5 text-slate-400">{item.category}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{money(item.price)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{item.stockQty}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", stockBadge(item.stockStatus))}>
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">{item.salesCount}</td>
                  <td className="px-3 py-2.5 text-slate-500">
                    {new Date(item.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[360px] flex-wrap gap-1">
                      {[
                        ["View Item", `View item: ${item.name}`],
                        ["Edit Item", `Edit item: ${item.name}`],
                        ["Restock", `Restock item: ${item.name}`],
                        ["Disable Item", `Disable item: ${item.name}`],
                      ].map(([label, msg]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setFeedback(msg)}
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

      <AdminCard
        title="Add / Edit item form (placeholder)"
        description="Use this draft structure to register and maintain official inventory resources."
        className="border-white/10 bg-[#080f1c]/95"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Item name</span>
            <input className="h-9 w-full rounded-lg border border-white/10 bg-[#0c1524] px-3 text-sm text-slate-200 outline-none" placeholder="e.g. New Believers Manual" />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Category</span>
            <select className="h-9 w-full rounded-lg border border-white/10 bg-[#0c1524] px-3 text-sm text-slate-200 outline-none">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Price</span>
            <input className="h-9 w-full rounded-lg border border-white/10 bg-[#0c1524] px-3 text-sm text-slate-200 outline-none" placeholder="e.g. 120" />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Stock quantity</span>
            <input className="h-9 w-full rounded-lg border border-white/10 bg-[#0c1524] px-3 text-sm text-slate-200 outline-none" placeholder="e.g. 35" />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Visibility status</span>
            <select className="h-9 w-full rounded-lg border border-white/10 bg-[#0c1524] px-3 text-sm text-slate-200 outline-none">
              <option value="Visible">Visible</option>
              <option value="Hidden">Hidden</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-slate-500">Image placeholder</span>
            <div className="flex h-9 items-center rounded-lg border border-dashed border-white/20 bg-[#0c1524] px-3 text-xs text-slate-500">Upload image (placeholder)</div>
          </label>
          <label className="space-y-1 md:col-span-2 xl:col-span-3">
            <span className="text-xs text-slate-500">Description</span>
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#0c1524] px-3 py-2 text-sm text-slate-200 outline-none"
              placeholder="Describe purpose and use in church operations..."
            />
          </label>
        </div>
      </AdminCard>

      <AdminCard title="Orders / sales" description="Member orders with payment state, fulfillment visibility, and accountability actions." className="border-white/10 bg-[#080f1c]/95">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {[
                  "Order ID",
                  "Member",
                  "Item",
                  "Quantity",
                  "Amount",
                  "Payment Method",
                  "Payment Status",
                  "Fulfillment Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-100/85">{row.id}</td>
                  <td className="px-3 py-2.5 text-white">{row.member}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.itemName}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-300">{row.quantity}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium text-white">{money(row.amount)}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.paymentMethod}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium", paymentBadge(row.paymentStatus))}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{row.fulfillmentStatus}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex max-w-[260px] flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback(`View order: ${row.id}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                      >
                        View
                      </button>
                      {row.paymentStatus === "Pending Cash" ? (
                        <button
                          type="button"
                          onClick={() => confirmCashPayment(row.id)}
                          className="rounded-md border border-emerald-500/25 bg-emerald-950/25 px-2 py-1 text-[10px] font-medium text-emerald-100 hover:border-emerald-400/40"
                        >
                          Confirm Cash
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setFeedback(`Fulfillment update placeholder: ${row.id}`)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                      >
                        Update Fulfillment
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Online payments are currently shown as <span className="text-sky-200">Paid Online</span> placeholders until Paystack verification is connected.
        </p>
      </AdminCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Finance linkage panel"
          description="Inventory sales feed finance as income under Inventory Sales / Resource Sales."
          className="border-amber-500/10 bg-[#080f1c]/95"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs text-slate-500">Inventory sales revenue</p>
              <p className="mt-1 text-lg font-semibold text-white">{money(onlineRevenue + confirmedRevenue)}</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs text-slate-500">Pending cash revenue</p>
              <p className="mt-1 text-lg font-semibold text-amber-100/90">{money(pendingCashRevenue)}</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs text-slate-500">Confirmed revenue</p>
              <p className="mt-1 text-lg font-semibold text-emerald-100">{money(confirmedRevenue)}</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-[#0c1524] p-3">
              <p className="text-xs text-slate-500">Finance sync status</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-300">
                <ShieldCheck className="size-4 text-amber-200/80" aria-hidden />
                Placeholder sync active
              </p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Low stock alerts" description="Items below minimum stock threshold requiring attention." className="border-amber-500/10 bg-[#080f1c]/95">
          <ul className="space-y-2">
            {lowStockAlerts.length === 0 ? (
              <li className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5 text-sm text-slate-400">No low stock alerts.</li>
            ) : (
              lowStockAlerts.map((item) => (
                <li key={item.id} className="rounded-lg border border-white/[0.08] bg-[#0c1524] px-3 py-2.5">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Current stock: <span className="text-amber-100/90">{item.stockQty}</span> · Minimum: {item.minStock}
                  </p>
                </li>
              ))
            )}
          </ul>
        </AdminCard>
      </div>

      <AdminCard title="Audit trail (placeholder)" description="Who changed what and when across inventory operations." className="border-white/10 bg-[#080f1c]/95">
        <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#0c1524]">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="border-b border-white/[0.08] bg-[#0a1426] text-slate-500">
              <tr>
                {["Actor", "Action", "Timestamp"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((row, idx) => (
                <tr key={`${row.timestamp}-${idx}`} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 text-slate-300">{row.actor}</td>
                  <td className="px-3 py-2.5 text-white">{row.action}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ClipboardCheck className="size-3.5 text-amber-200/70" aria-hidden />
          Includes placeholders for item creation, cash confirmation, and stock adjustment accountability.
        </p>
      </AdminCard>
    </main>
  );
}
