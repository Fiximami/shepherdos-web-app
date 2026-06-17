import { apiAuthRequest } from "@/lib/api/client";
import { asRecord, unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";
import { unwrapMemberProfile, type MemberScopeResult } from "@/lib/api/member-scope";
import type {
  ApiMember,
  MemberPreferences,
  MemberPreferencesUpdate,
  MemberProfileUpdate,
  MembersSummary,
} from "@/lib/api/types";

const DEFAULT_PREFERENCES: MemberPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  prayerUpdates: true,
  eventReminders: true,
};

function readBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function extractMemberPreferences(source: Record<string, unknown>): MemberPreferences {
  const prefs = asRecord(source.preferences ?? source);

  return {
    emailNotifications: readBoolean(
      prefs.emailNotifications ?? prefs.email_notifications,
      DEFAULT_PREFERENCES.emailNotifications,
    ),
    smsNotifications: readBoolean(
      prefs.smsNotifications ?? prefs.sms_notifications,
      DEFAULT_PREFERENCES.smsNotifications,
    ),
    prayerUpdates: readBoolean(
      prefs.prayerUpdates ?? prefs.prayer_updates,
      DEFAULT_PREFERENCES.prayerUpdates,
    ),
    eventReminders: readBoolean(
      prefs.eventReminders ?? prefs.event_reminders,
      DEFAULT_PREFERENCES.eventReminders,
    ),
  };
}

export function formatDateForInput(value: string): string {
  if (!value || value === "—") return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return "";
}

export async function fetchMyMemberProfile(): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/members/me");
  return unwrapMemberProfile(response);
}

export async function updateMyProfile(payload: MemberProfileUpdate): Promise<MemberScopeResult> {
  const response = await apiAuthRequest<unknown>("/members/me", {
    method: "PATCH",
    body: payload,
  });
  return unwrapMemberProfile(response);
}

export async function updateMyPreferences(
  payload: MemberPreferencesUpdate,
): Promise<MemberPreferences> {
  const response = await apiAuthRequest<unknown>("/members/me/preferences", {
    method: "PATCH",
    body: payload,
  });
  return extractMemberPreferences(asRecord(response));
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
