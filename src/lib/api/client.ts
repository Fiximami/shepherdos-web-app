import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError, parseApiError } from "@/lib/api/errors";
import { clearAccessToken, getAccessToken } from "@/lib/api/token-storage";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

function buildUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAccessToken();
    if (!token) {
      throw new ApiError(401, "You are not signed in.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const error = await parseApiError(response);

    if (options.auth && error.status === 401) {
      clearAccessToken();
      onUnauthorized?.();
    }

    throw error;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text as T;
  }

  return (await response.json()) as T;
}

export function apiAuthRequest<T>(path: string, options: Omit<ApiRequestOptions, "auth"> = {}) {
  return apiRequest<T>(path, { ...options, auth: true });
}
