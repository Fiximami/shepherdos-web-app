import { AUTH_COOKIE_NAME, AUTH_TOKEN_STORAGE_KEY, DEMO_MODE_STORAGE_KEY } from "@/lib/api/config";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!canUseBrowserStorage()) return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; SameSite=Lax`;
}

export function clearAccessToken() {
  if (!canUseBrowserStorage()) return;
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Lax`;
}

export function isDemoModeEnabled(): boolean {
  if (!canUseBrowserStorage()) return false;
  return window.sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === "1";
}

export function enableDemoMode() {
  if (!canUseBrowserStorage()) return;
  clearAccessToken();
  window.sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, "1");
}

export function disableDemoMode() {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
}

export function hasAuthenticatedSession(): boolean {
  return Boolean(getAccessToken()) || isDemoModeEnabled();
}
