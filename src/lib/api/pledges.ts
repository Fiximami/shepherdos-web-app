import { apiAuthRequest } from "@/lib/api/client";
import { formatApiValue } from "@/lib/api/formatters";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord } from "@/lib/api/normalize";
import type { ApiPledge, PledgeCreate, PledgeUpdate } from "@/lib/api/types";

export type MemberPledgeRow = {
  id: string;
  title: string;
  targetAmount: number;
  paidAmount: number;
  targetDate: string;
  status: string;
};

function parseAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function mapMemberPledge(record: Record<string, unknown>, index: number): MemberPledgeRow {
  const targetAmount = parseAmount(
    record.amount ?? record.targetAmount ?? record.target ?? record.pledgeAmount,
  );
  const paidAmount = parseAmount(record.paidAmount ?? record.paid ?? record.progress ?? record.amountPaid);

  return {
    id: String(record.id ?? `pledge-${index}`),
    title: formatApiValue(record.title ?? record.name, "Pledge"),
    targetAmount,
    paidAmount,
    targetDate: formatApiValue(
      record.targetDate ?? record.dueDate ?? record.endDate ?? record.deadline,
      "—",
    ),
    status: formatApiValue(record.status, "Active"),
  };
}

export function formatPledgeDate(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function fetchMyPledges(): Promise<MemberScopeResult<ApiPledge>> {
  const response = await apiAuthRequest<unknown>("/pledges/me");
  return unwrapMemberScope<ApiPledge>(response);
}

export function unwrapPledgeResponse(response: unknown): ApiPledge {
  const record = asRecord(response);
  const data = asRecord(record.data ?? record.pledge ?? record.result ?? record);
  return data as ApiPledge;
}

export async function createPledge(payload: PledgeCreate): Promise<ApiPledge> {
  const response = await apiAuthRequest<unknown>("/pledges", {
    method: "POST",
    body: payload,
  });
  return unwrapPledgeResponse(response);
}

export async function updatePledge(pledgeId: string, payload: PledgeUpdate): Promise<ApiPledge> {
  const response = await apiAuthRequest<unknown>(`/pledges/${pledgeId}`, {
    method: "PATCH",
    body: payload,
  });
  return unwrapPledgeResponse(response);
}
