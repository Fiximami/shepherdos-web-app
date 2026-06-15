import { apiAuthRequest } from "@/lib/api/client";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiFinanceTransaction, FinanceSummary } from "@/lib/api/types";

export async function fetchMyFinance(): Promise<MemberScopeResult<ApiFinanceTransaction>> {
  const response = await apiAuthRequest<unknown>("/finance/me");
  return unwrapMemberScope<ApiFinanceTransaction>(response);
}

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
  const response = await apiAuthRequest<unknown>("/finance/summary");
  return unwrapApiSummary(response);
}

export async function fetchFinanceTransactions(): Promise<ApiFinanceTransaction[]> {
  const response = await apiAuthRequest<unknown>("/finance/transactions");
  return unwrapApiList<ApiFinanceTransaction>(response);
}
