import { apiAuthRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { formatApiValue } from "@/lib/api/formatters";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord, unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiGivingReceipt, ApiGivingStatement } from "@/lib/api/types";

export type MemberGivingStatementRow = {
  id: string;
  period: string;
  totalAmount: number;
  generatedDate: string;
};

export type MemberGivingReceipt = {
  receiptId: string;
  givingId: string;
  financeReference: string;
  dateISO: string;
  amount: number;
  category: string;
  paymentMethod: string;
  memberName: string;
  churchName: string;
  status: string;
};

function parseAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function normalizeDateIso(value: unknown): string {
  const raw = formatApiValue(value, "");
  if (!raw || raw === "—") return new Date().toISOString().slice(0, 10);
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

export function mapMemberGivingStatement(
  record: Record<string, unknown>,
  index: number,
): MemberGivingStatementRow {
  return {
    id: String(record.id ?? `statement-${index}`),
    period: formatApiValue(
      record.period ?? record.statementPeriod ?? record.label ?? record.title,
      "Statement",
    ),
    totalAmount: parseAmount(record.totalAmount ?? record.amount ?? record.total),
    generatedDate: formatApiValue(
      record.generatedAt ?? record.generatedDate ?? record.createdAt ?? record.date,
      "—",
    ),
  };
}

export function formatGivingStatementDate(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function mapGivingReceipt(record: Record<string, unknown>, givingId: string): MemberGivingReceipt {
  const receiptId = record.receiptId ?? record.receipt_id;
  const financeReference = record.reference ?? record.financeReference ?? record.finance_reference;

  return {
    receiptId: receiptId ? String(receiptId) : "—",
    givingId: String(record.givingId ?? record.id ?? givingId),
    financeReference: financeReference ? String(financeReference) : "—",
    dateISO: normalizeDateIso(record.date ?? record.createdAt),
    amount: parseAmount(record.amount),
    category: formatApiValue(record.category ?? record.type, "Giving"),
    paymentMethod: formatApiValue(record.paymentMethod ?? record.method, "—"),
    memberName: formatApiValue(record.memberName ?? record.member, "—"),
    churchName: formatApiValue(record.churchName ?? record.church, "—"),
    status: formatApiValue(record.status, "Issued"),
  };
}

export async function fetchMyGiving(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/giving/me");
  return unwrapMemberScope(response);
}

export async function fetchMyGivingStatements(): Promise<MemberScopeResult<ApiGivingStatement>> {
  const response = await apiAuthRequest<unknown>("/giving/me/statements");
  return unwrapMemberScope<ApiGivingStatement>(response);
}

export async function fetchGivingReceipt(givingId: string): Promise<MemberGivingReceipt> {
  const response = await apiAuthRequest<unknown>(`/giving/${givingId}/receipt`);
  const record = asRecord(response);
  const data = asRecord(record.data ?? record.receipt ?? record.result ?? record);
  return mapGivingReceipt(data, givingId);
}

export async function fetchGivingSummary() {
  try {
    const response = await apiAuthRequest<unknown>("/giving/summary");
    return unwrapApiSummary(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return fetchFinanceSummary();
    }
    throw error;
  }
}

export async function fetchGivingRecords() {
  try {
    const response = await apiAuthRequest<unknown>("/giving/records");
    return unwrapApiList<Record<string, unknown>>(response);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return fetchFinanceTransactions();
    }
    throw error;
  }
}
