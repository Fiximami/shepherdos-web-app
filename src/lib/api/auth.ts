import { apiAuthRequest, apiRequest } from "@/lib/api/client";
import type { ApiUser, LoginRequest, LoginResponse } from "@/lib/api/types";
import { unwrapApiUserResponse } from "@/lib/auth/unwrap-api-user";
import { clearAccessToken, setAccessToken } from "@/lib/api/token-storage";

function extractAccessToken(response: LoginResponse): string | null {
  return response.accessToken ?? response.access_token ?? response.token ?? null;
}

export async function login(request: LoginRequest) {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: request,
  });

  const token = extractAccessToken(response);
  if (!token) {
    throw new Error("Sign-in succeeded but no access token was returned.");
  }

  setAccessToken(token);
  return response;
}

export async function fetchCurrentUser() {
  const response = await apiAuthRequest<unknown>("/auth/me");
  return unwrapApiUserResponse(response);
}

export function logout() {
  clearAccessToken();
}
