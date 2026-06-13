import { apiAuthRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";

export async function fetchGivingSummary() {
  try {
    return await apiAuthRequest<Record<string, unknown>>("/giving/summary");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return fetchFinanceSummary();
    }
    throw error;
  }
}

export async function fetchGivingRecords() {
  try {
    const response = await apiAuthRequest<Record<string, unknown>[] | { data?: Record<string, unknown>[] }>(
      "/giving/records",
    );
    if (Array.isArray(response)) return response;
    return response.data ?? [];
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return fetchFinanceTransactions();
    }
    throw error;
  }
}
