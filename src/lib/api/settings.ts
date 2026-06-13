import { apiAuthRequest } from "@/lib/api/client";
import type { ApiSettings } from "@/lib/api/types";

export async function fetchSettings() {
  return apiAuthRequest<ApiSettings>("/settings");
}

export async function fetchChurchSettings() {
  return apiAuthRequest<ApiSettings>("/settings/church");
}

export async function fetchProfileSettings() {
  return apiAuthRequest<ApiSettings>("/settings/profile");
}
