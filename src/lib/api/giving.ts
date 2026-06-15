import { apiAuthRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";

export async function fetchMyGiving(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/giving/me");
  return unwrapMemberScope(response);
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
