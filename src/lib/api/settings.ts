import { apiAuthRequest } from "@/lib/api/client";
import { unwrapApiEntity, unwrapApiSummary } from "@/lib/api/normalize";
import type { ApiSettings, ChurchSettingsUpdate, GivingSettingsUpdate } from "@/lib/api/types";

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

export async function fetchGivingSettings(): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings/giving");
  return unwrapApiSummary(response);
}

export async function updateChurchSettings(payload: ChurchSettingsUpdate): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings/church", {
    method: "PATCH",
    body: payload,
  });
  return unwrapApiEntity<ApiSettings>(response);
}

export async function updateGivingSettings(payload: GivingSettingsUpdate): Promise<ApiSettings> {
  const response = await apiAuthRequest<unknown>("/settings/giving", {
    method: "PATCH",
    body: payload,
  });
  return unwrapApiEntity<ApiSettings>(response);
}
