"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminModal } from "@/components/admin/shared/admin-modal";
import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAuditLogsByEntity } from "@/lib/api/audit-logs";
import { getApiErrorMessage } from "@/lib/api/errors";
import { createFinanceTransaction, updateFinanceTransactionStatus } from "@/lib/api/finance";
import { mapApiAuditLog } from "@/lib/api/mappers";

type ToastState = { message: string; variant: "success" | "error" } | null;

type CreateTransactionDialogProps = {
  open: boolean;
  type: "income" | "expense";
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateTransactionDialog({
  open,
  type,
  onClose,
  onSuccess,
}: CreateTransactionDialogProps) {
  const [category, setCategory] = useState(type === "income" ? "Tithe" : "Operations");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open) return;
    setCategory(type === "income" ? "Tithe" : "Operations");
    setAmount("");
    setSource("");
    setReference("");
    setDate(new Date().toISOString().slice(0, 10));
    setToast(null);
  }, [open, type]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setToast({ message: "Enter a valid amount.", variant: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast(null);
    try {
      await createFinanceTransaction({
        type,
        category: category.trim(),
        amount: parsedAmount,
        date,
        source: source.trim() || undefined,
        reference: reference.trim() || undefined,
      });
      setToast({
        message: type === "income" ? "Income recorded successfully." : "Expense recorded successfully.",
        variant: "success",
      });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title={type === "income" ? "Record income" : "Record expense"}
      description={`Post a new ${type} transaction to the finance ledger.`}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="tx-category">Category</Label>
          <Input id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount (GHS)</Label>
            <Input
              id="tx-amount"
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-date">Date</Label>
            <Input id="tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tx-source">{type === "income" ? "Source / contributor" : "Paid to / vendor"}</Label>
          <Input id="tx-source" value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tx-reference">Reference (optional)</Label>
          <Input id="tx-reference" value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save transaction"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

export type FinanceTransactionRow = {
  id: string;
  receiptId: string;
  date: string;
  category: string;
  amount: string;
  source: string;
  reference: string;
  status: string;
};

type TransactionDetailDialogProps = {
  open: boolean;
  transaction: FinanceTransactionRow | null;
  canApprove: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function isPendingStatus(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized.includes("pending") || normalized.includes("review");
}

export function TransactionDetailDialog({
  open,
  transaction,
  canApprove,
  onClose,
  onSuccess,
}: TransactionDetailDialogProps) {
  const [auditRows, setAuditRows] = useState<
    { action: string; actor: string; timestamp: string; details: string }[]
  >([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open || !transaction) {
      setAuditRows([]);
      return;
    }
    setToast(null);
    setIsLoadingAudit(true);
    fetchAuditLogsByEntity("transaction", transaction.id)
      .then((logs) => setAuditRows(logs.map(mapApiAuditLog)))
      .catch(() => setAuditRows([]))
      .finally(() => setIsLoadingAudit(false));
  }, [open, transaction]);

  async function handleStatusUpdate(status: "approved" | "rejected") {
    if (!transaction) return;
    setIsSubmitting(true);
    setToast(null);
    try {
      await updateFinanceTransactionStatus(transaction.id, { status });
      setToast({
        message: status === "approved" ? "Transaction approved." : "Transaction rejected.",
        variant: "success",
      });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Transaction details"
      description={transaction ? `Reference ${transaction.reference}` : undefined}
      onClose={onClose}
      className="max-w-xl"
    >
      {transaction ? (
        <div className="space-y-4">
          {toast ? (
            <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
          ) : null}
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="text-white">{transaction.category}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-white">{transaction.amount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Source</dt>
              <dd className="text-white">{transaction.source}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="text-white">{transaction.status}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Date</dt>
              <dd className="text-white">{transaction.date}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Receipt ID</dt>
              <dd className="font-mono text-xs text-amber-100/85">{transaction.receiptId}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Audit trail</p>
            {isLoadingAudit ? (
              <p className="mt-2 text-sm text-slate-400">Loading audit history…</p>
            ) : auditRows.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">No audit entries for this transaction yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {auditRows.map((row) => (
                  <li key={`${row.timestamp}-${row.action}`} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
                    <p className="font-medium text-white">{row.action}</p>
                    <p className="text-slate-400">
                      {row.actor} · {row.timestamp}
                    </p>
                    <p className="mt-1 text-slate-500">{row.details}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {canApprove && isPendingStatus(transaction.status) ? (
            <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleStatusUpdate("rejected")}
              >
                Reject
              </Button>
              <Button type="button" disabled={isSubmitting} onClick={() => handleStatusUpdate("approved")}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Updating…
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </AdminModal>
  );
}
