import { apiAuthRequest } from "@/lib/api/client";
import { formatApiValue } from "@/lib/api/formatters";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord } from "@/lib/api/normalize";
import type { ApiCounsellingRequest, CounsellingRequestCreate } from "@/lib/api/types";

export type MemberCounsellingRequestRow = {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  submittedAt: string;
};

export function mapMemberCounsellingRequest(
  record: Record<string, unknown>,
  index: number,
): MemberCounsellingRequestRow {
  return {
    id: String(record.id ?? `counselling-${index}`),
    category: formatApiValue(
      record.category ?? record.type ?? record.counsellingType ?? record.requestType,
      "Counselling",
    ),
    title: formatApiValue(record.title, "Counselling request"),
    description: formatApiValue(record.description ?? record.note ?? record.message, ""),
    status: formatApiValue(record.status, "Pending"),
    submittedAt: formatApiValue(
      record.submittedAt ?? record.createdAt ?? record.date ?? record.submittedDate,
      "—",
    ),
  };
}

export function formatCounsellingRequestDate(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function fetchMyCounsellingRequests(): Promise<
  MemberScopeResult<ApiCounsellingRequest>
> {
  const response = await apiAuthRequest<unknown>("/counselling/me");
  return unwrapMemberScope<ApiCounsellingRequest>(response);
}

export function unwrapCounsellingRequestResponse(response: unknown): ApiCounsellingRequest {
  const record = asRecord(response);
  const data = asRecord(
    record.data ?? record.request ?? record.counsellingRequest ?? record.counselling ?? record,
  );
  return data as ApiCounsellingRequest;
}

export async function submitCounsellingRequest(
  payload: CounsellingRequestCreate,
): Promise<ApiCounsellingRequest> {
  const response = await apiAuthRequest<unknown>("/counselling/request", {
    method: "POST",
    body: payload,
  });
  return unwrapCounsellingRequestResponse(response);
}
