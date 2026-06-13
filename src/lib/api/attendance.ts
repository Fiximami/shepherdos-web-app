import { apiAuthRequest } from "@/lib/api/client";
import type { ApiAttendanceSession, ApiListResponse, AttendanceSummary } from "@/lib/api/types";

function unwrapList<T>(response: ApiListResponse<T> | T[]): T[] {
  if (Array.isArray(response)) return response;
  return response.data ?? response.items ?? response.results ?? [];
}

export async function fetchAttendanceSummary() {
  return apiAuthRequest<AttendanceSummary>("/attendance/summary");
}

export async function fetchAttendanceSessions() {
  const response = await apiAuthRequest<ApiListResponse<ApiAttendanceSession> | ApiAttendanceSession[]>(
    "/attendance/sessions",
  );
  return unwrapList(response);
}

export async function fetchAttendanceRecords() {
  const response = await apiAuthRequest<ApiListResponse<Record<string, unknown>> | Record<string, unknown>[]>(
    "/attendance/records",
  );
  return unwrapList(response);
}
