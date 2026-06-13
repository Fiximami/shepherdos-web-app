export type ApiErrorCode = 401 | 403 | 404 | 429 | 500 | number;

export class ApiError extends Error {
  readonly status: ApiErrorCode;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return "Your session has expired or your sign-in details were not accepted. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "The server encountered an error. Please try again shortly.";
      default:
        return error.message || "Something went wrong while contacting the server.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while contacting the server.";
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const message =
    extractMessage(payload) ??
    response.statusText ??
    "Request failed";
  return new ApiError(response.status, message, payload);
}

function extractMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const message = record.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return message.map(String).join(" ");
  }

  if (typeof record.error === "string" && record.error.trim()) {
    return record.error;
  }

  return null;
}
