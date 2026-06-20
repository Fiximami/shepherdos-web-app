"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminModal } from "@/components/admin/shared/admin-modal";
import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { fetchGivingReceipt } from "@/lib/api/giving";
import { updateFinanceTransactionStatus } from "@/lib/api/finance";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { MemberGivingReceipt } from "@/lib/api/giving";
import type { AdminGivingRecord } from "@/lib/api/mappers";

type ToastState = { message: string; variant: "success" | "error" } | null;

type GivingRecordDialogProps = {
  open: boolean;
  record: AdminGivingRecord | null;
  canApprove: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

function isPendingReceipt(status: AdminGivingRecord["receiptStatus"]): boolean {
  return status === "Pending";
}

export function GivingRecordDialog({
  open,
  record,
  canApprove,
  onClose,
  onSuccess,
}: GivingRecordDialogProps) {
  const [receipt, setReceipt] = useState<MemberGivingReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open || !record) {
      setReceipt(null);
      return;
    }
    setToast(null);
    setIsLoading(true);
    fetchGivingReceipt(record.id)
      .then(setReceipt)
      .catch(() => setReceipt(null))
      .finally(() => setIsLoading(false));
  }, [open, record]);

  async function handleApprove(status: "approved" | "rejected") {
    if (!record) return;
    setIsSubmitting(true);
    setToast(null);
    try {
      await updateFinanceTransactionStatus(record.id, { status });
      setToast({
        message: status === "approved" ? "Giving record approved." : "Giving record rejected.",
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
      title="Giving record"
      description={record ? `${record.member} · ${record.category}` : undefined}
      onClose={onClose}
    >
      {record ? (
        <div className="space-y-4">
          {toast ? (
            <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
          ) : null}
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Amount</dt>
              <dd className="text-white">{record.amount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Payment method</dt>
              <dd className="text-white">{record.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Date</dt>
              <dd className="text-white">{record.date}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Receipt status</dt>
              <dd className="text-white">{record.receiptStatus}</dd>
            </div>
          </dl>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Receipt details</p>
            {isLoading ? (
              <p className="mt-2 text-sm text-slate-400">Loading receipt…</p>
            ) : receipt ? (
              <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Receipt ID</dt>
                  <dd className="font-mono text-xs text-teal-100">{receipt.receiptId}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Finance reference</dt>
                  <dd className="font-mono text-xs text-teal-100">{receipt.financeReference}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Member</dt>
                  <dd className="text-white">{receipt.memberName}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Status</dt>
                  <dd className="text-white">{receipt.status}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-slate-400">
                Receipt details are not available for this record yet.
              </p>
            )}
          </div>

          {canApprove && isPendingReceipt(record.receiptStatus) ? (
            <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleApprove("rejected")}
              >
                Reject
              </Button>
              <Button type="button" disabled={isSubmitting} onClick={() => handleApprove("approved")}>
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
