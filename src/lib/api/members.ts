import { apiAuthRequest } from "@/lib/api/client";
import { unwrapMemberProfile, type MemberScopeResult } from "@/lib/api/member-scope";
import { unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiMember, MembersSummary } from "@/lib/api/types";

export async function fetchMyMemberProfile(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/members/me");
  return unwrapMemberProfile(response);
}

export async function fetchMembersSummary(): Promise<MembersSummary> {
  const response = await apiAuthRequest<unknown>("/members/summary");
  return unwrapApiSummary(response);
}

export async function fetchMembers(params?: { limit?: number; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = query ? `/members?${query}` : "/members";
  const response = await apiAuthRequest<unknown>(path);
  return unwrapApiList<ApiMember>(response);
}
