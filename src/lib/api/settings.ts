import { apiAuthRequest } from "@/lib/api/client";
import { unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiSettings } from "@/lib/api/types";

export async function fetchSettings(): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings");
  return unwrapApiSummary(response);
}

export async function fetchChurchSettings(): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings/church");
  return unwrapApiSummary(response);
}

export async function fetchProfileSettings(): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings/profile");
  return unwrapApiSummary(response);
}
