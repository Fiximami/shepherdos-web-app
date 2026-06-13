import { apiAuthRequest } from "@/lib/api/client";
import { unwrapApiList } from "@/lib/api/normalize";
import type { ApiAuditLog } from "@/lib/api/types";

type FetchAuditLogsParams = {
  page?: number;
  limit?: number;
};

export async function fetchAuditLogs(params: FetchAuditLogsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const path = query ? `/audit-logs?${query}` : "/audit-logs";
  const response = await apiAuthRequest<unknown>(path);
  return unwrapApiList<ApiAuditLog>(response);
}

export async function fetchAuditLogById(id: string) {
  return apiAuthRequest<ApiAuditLog>(`/audit-logs/${id}`);
}

export async function fetchAuditLogsByEntity(entityType: string, entityId: string) {
  const response = await apiAuthRequest<unknown>(
    `/audit-logs/entity/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`,
  );
  return unwrapApiList<ApiAuditLog>(response);
}
