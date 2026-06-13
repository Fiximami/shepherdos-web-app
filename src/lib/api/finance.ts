import { apiAuthRequest } from "@/lib/api/client";
import type { ApiFinanceTransaction, ApiListResponse, FinanceSummary } from "@/lib/api/types";

function unwrapList<T>(response: ApiListResponse<T> | T[]): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

export async function fetchFinanceSummary() {
  return apiAuthRequest<FinanceSummary>("/finance/summary");
}

export async function fetchFinanceTransactions() {
  const response = await apiAuthRequest<ApiListResponse<ApiFinanceTransaction> | ApiFinanceTransaction[]>(
    "/finance/transactions",
  );
  return unwrapList(response);
}
