import { apiAuthRequest } from "@/lib/api/client";
import { formatApiValue } from "@/lib/api/formatters";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord, unwrapApiEntity, unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import type {
  ApiAttendanceSession,
  AttendanceCheckInResult,
  AttendanceRecordCreate,
  AttendanceSessionCreate,
  AttendanceSessionUpdate,
  AttendanceSummary,
} from "@/lib/api/types";

export async function fetchMyAttendance(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/attendance/me");
  return unwrapMemberScope(response);
}

function readBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
}

export function unwrapAttendanceCheckIn(response: unknown): AttendanceCheckInResult {
  const record = asRecord(response);
  const data = asRecord(record.data ?? record.checkIn ?? record.result ?? record);

  return {
    status: formatApiValue(data.status ?? data.checkInStatus ?? record.status, "checked_in"),
    message: formatApiValue(
      data.message ?? record.message,
      "Your attendance has been recorded.",
    ),
    lastCheckInAt: formatApiValue(
      data.lastCheckInAt ?? data.lastCheckIn ?? data.checkedInAt ?? data.timestamp,
      "—",
    ),
    sessionName: formatApiValue(
      data.sessionName ?? data.service ?? data.serviceName ?? data.session,
      "—",
    ),
    checkedInToday: readBoolean(
      data.checkedInToday ?? data.alreadyCheckedIn ?? data.isCheckedInToday,
    ),
  };
}

export async function checkInAttendance(): Promise<AttendanceCheckInResult> {
  const response = await apiAuthRequest<unknown>("/attendance/me/check-in", {
    method: "POST",
    body: {},
  });
  return unwrapAttendanceCheckIn(response);
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

export async function createAttendanceSession(payload: AttendanceSessionCreate): Promise<ApiAttendanceSession> {
  const response = await apiAuthRequest<unknown>("/attendance/sessions", {
    method: "POST",
    body: payload,
  });
  return unwrapApiEntity<ApiAttendanceSession>(response);
}

export async function updateAttendanceSession(
  sessionId: string,
  payload: AttendanceSessionUpdate,
): Promise<ApiAttendanceSession> {
  const response = await apiAuthRequest<unknown>(`/attendance/sessions/${encodeURIComponent(sessionId)}`, {
    method: "PATCH",
    body: payload,
  });
  return unwrapApiEntity<ApiAttendanceSession>(response);
}

export async function closeAttendanceSession(sessionId: string): Promise<ApiAttendanceSession> {
  const response = await apiAuthRequest<unknown>(
    `/attendance/sessions/${encodeURIComponent(sessionId)}/close`,
    { method: "PATCH", body: {} },
  );
  return unwrapApiEntity<ApiAttendanceSession>(response);
}

export async function recordAttendance(payload: AttendanceRecordCreate): Promise<Record<string, unknown>> {
  const response = await apiAuthRequest<unknown>("/attendance/records", {
    method: "POST",
    body: payload,
  });
  return unwrapApiEntity<Record<string, unknown>>(response);
}
