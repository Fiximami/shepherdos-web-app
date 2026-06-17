import { apiAuthRequest } from "@/lib/api/client";
import { formatApiValue } from "@/lib/api/formatters";
import { unwrapMemberScope, type MemberScopeResult } from "@/lib/api/member-scope";
import { asRecord } from "@/lib/api/normalize";
import type { ApiEventRegistration, EventRegistrationResult } from "@/lib/api/types";

export type MemberEventRegistrationRow = {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  status: string;
};

export function mapMemberEventRegistration(
  record: Record<string, unknown>,
  index: number,
): MemberEventRegistrationRow {
  const event = asRecord(record.event);
  return {
    id: String(record.id ?? record.registrationId ?? `registration-${index}`),
    eventId: String(record.eventId ?? record.event_id ?? event.id ?? `event-${index}`),
    eventName: formatApiValue(
      record.eventName ?? record.name ?? record.title ?? event.name ?? event.title,
      "Event",
    ),
    eventDate: formatApiValue(
      record.eventDate ??
        record.date ??
        record.startsAt ??
        record.startDate ??
        event.date ??
        event.startsAt ??
        event.startDate,
      "—",
    ),
    status: formatApiValue(record.status ?? record.registrationStatus, "Registered"),
  };
}

export function formatEventRegistrationDate(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function fetchMyEventRegistrations(): Promise<
  MemberScopeResult<ApiEventRegistration>
> {
  const response = await apiAuthRequest<unknown>("/events/my-registrations");
  return unwrapMemberScope<ApiEventRegistration>(response);
}

export function unwrapEventRegistrationResponse(response: unknown): EventRegistrationResult {
  const record = asRecord(response);
  const data = asRecord(record.data ?? record.registration ?? record.result ?? record);

  return {
    status: formatApiValue(data.status ?? record.status, "registered"),
    message: formatApiValue(
      data.message ?? record.message,
      "You are registered for this event.",
    ),
    eventId: String(data.eventId ?? data.event_id ?? record.eventId ?? record.event_id ?? ""),
    registrationStatus: formatApiValue(
      data.registrationStatus ?? data.status ?? record.registrationStatus,
      "Registered",
    ),
  };
}

export async function registerForEvent(eventId: string): Promise<EventRegistrationResult> {
  const response = await apiAuthRequest<unknown>(`/events/${eventId}/register`, {
    method: "POST",
    body: {},
  });
  return unwrapEventRegistrationResponse(response);
}
