import { apiAuthRequest } from "@/lib/api/client";
import type { ApiListResponse, ApiMember, MembersSummary } from "@/lib/api/types";

export async function fetchMembersSummary() {
  return apiAuthRequest<MembersSummary>("/members/summary");
}

export async function fetchMembers(params?: { limit?: number; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const path = query ? `/members?${query}` : "/members";
  const response = await apiAuthRequest<ApiListResponse<ApiMember> | ApiMember[]>(path);

  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.items ?? response.results ?? [];
}
