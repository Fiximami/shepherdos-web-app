import { apiAuthRequest } from "@/lib/api/client";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiAttendanceSession, AttendanceSummary } from "@/lib/api/types";

export async function fetchMyAttendance(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/attendance/me");
  return unwrapMemberScope(response);
}

export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const response = await apiAuthRequest<unknown>("/attendance/summary");
  return unwrapApiSummary(response);
}

export async function fetchAttendanceSessions() {
  const response = await apiAuthRequest<unknown>("/attendance/sessions");
  return unwrapApiList<ApiAttendanceSession>(response);
}

export async function fetchAttendanceRecords() {
  const response = await apiAuthRequest<unknown>("/attendance/records");
  return unwrapApiList<Record<string, unknown>>(response);
}
