const DEFAULT_API_BASE_URL = "https://shepherdos-api.onrender.com";

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return configured || DEFAULT_API_BASE_URL;
}

export function getDefaultChurchSlug(): string {
  return process.env.NEXT_PUBLIC_CHURCH_SLUG?.trim() ?? "";
}

export const AUTH_TOKEN_STORAGE_KEY = "shepherdos_access_token";
export const DEMO_MODE_STORAGE_KEY = "shepherdos_demo_mode";
export const AUTH_COOKIE_NAME = "shepherdos_authed";
