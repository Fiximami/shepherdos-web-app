import { apiAuthRequest } from "@/lib/api/client";
import { formatApiValue } from "@/lib/api/formatters";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord } from "@/lib/api/normalize";
import type { ApiPrayerRequest, PrayerRequestCreate } from "@/lib/api/types";

export type MemberPrayerRequestRow = {
  id: string;
  title: string;
  content: string;
  status: string;
  submittedAt: string;
};

export function mapMemberPrayerRequest(
  record: Record<string, unknown>,
  index: number,
): MemberPrayerRequestRow {
  return {
    id: String(record.id ?? `prayer-${index}`),
    title: formatApiValue(record.title, "Prayer request"),
    content: formatApiValue(record.content ?? record.message ?? record.body, ""),
    status: formatApiValue(record.status, "Submitted"),
    submittedAt: formatApiValue(
      record.submittedAt ?? record.createdAt ?? record.date ?? record.submittedDate,
      "—",
    ),
  };
}

export function formatPrayerRequestDate(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function fetchMyPrayerRequests(): Promise<MemberScopeResult<ApiPrayerRequest>> {
  const response = await apiAuthRequest<unknown>("/prayer-requests/me");
  return unwrapMemberScope<ApiPrayerRequest>(response);
}

export function unwrapPrayerRequestResponse(response: unknown): ApiPrayerRequest {
  const record = asRecord(response);
  const data = asRecord(record.data ?? record.request ?? record.prayerRequest ?? record);
  return data as ApiPrayerRequest;
}

export async function submitPrayerRequest(
  payload: PrayerRequestCreate,
): Promise<ApiPrayerRequest> {
  const response = await apiAuthRequest<unknown>("/prayer-requests", {
    method: "POST",
    body: payload,
  });
  return unwrapPrayerRequestResponse(response);
}
