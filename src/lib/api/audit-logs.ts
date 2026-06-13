import { apiAuthRequest } from "@/lib/api/client";
import type { ApiAuditLog, ApiListResponse } from "@/lib/api/types";

type FetchAuditLogsParams = {
  page?: number;
  limit?: number;
};

function unwrapList<T>(response: ApiListResponse<T> | T[]): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

export async function fetchAuditLogs(params: FetchAuditLogsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const path = query ? `/audit-logs?${query}` : "/audit-logs";
  const response = await apiAuthRequest<ApiListResponse<ApiAuditLog> | ApiAuditLog[]>(path);
  return unwrapList(response);
}

export async function fetchAuditLogById(id: string) {
  return apiAuthRequest<ApiAuditLog>(`/audit-logs/${id}`);
}

export async function fetchAuditLogsByEntity(entityType: string, entityId: string) {
  const response = await apiAuthRequest<ApiListResponse<ApiAuditLog> | ApiAuditLog[]>(
    `/audit-logs/entity/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`,
  );
  return unwrapList(response);
}
