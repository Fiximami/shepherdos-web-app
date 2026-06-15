import { asRecord, unwrapApiList, unwrapApiSummary } from "@/lib/api/normalize";

export type MemberScopeResult<T = Record<string, unknown>> = {
  linked: boolean;
  summary: Record<string, unknown>;
  items: T[];
  profile: Record<string, unknown>;
};

export const EMPTY_MEMBER_SCOPE: MemberScopeResult = {
  linked: false,
  summary: {},
  items: [],
  profile: {},
};

export function emptyMemberScope<T = Record<string, unknown>>(): MemberScopeResult<T> {
  return EMPTY_MEMBER_SCOPE as MemberScopeResult<T>;
}

function extractNestedList(record: Record<string, unknown>): unknown[] {
  const candidates = [
    record.records,
    record.history,
    record.items,
    record.sessions,
    record.transactions,
    record.attendance,
    record.entries,
    record.giving,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item) => item != null);
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      const nestedList = nested.data ?? nested.items ?? nested.results ?? nested.records;
      if (Array.isArray(nestedList)) {
        return nestedList.filter((item) => item != null);
      }
    }
  }

  return unwrapApiList(record);
}

export function parseMemberLinked(response: unknown): boolean {
  const record = asRecord(response);

  if (typeof record.linked === "boolean") {
    return record.linked;
  }

  if (typeof record.isLinked === "boolean") {
    return record.isLinked;
  }

  if (record.member || record.profile) {
    return true;
  }

  const data = record.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const nested = data as Record<string, unknown>;
    if (typeof nested.linked === "boolean") {
      return nested.linked;
    }
    if (nested.member || nested.profile) {
      return true;
    }
  }

  return false;
}

export function unwrapMemberProfile(response: unknown): MemberScopeResult {
  const record = asRecord(response);
  const linked = parseMemberLinked(response);

  if (!linked) {
    return EMPTY_MEMBER_SCOPE;
  }

  const data = record.data;
  const profile = asRecord(
    record.member ??
      record.profile ??
      (data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>).member : null) ??
      (data && typeof data === "object" && !Array.isArray(data) ? data : null) ??
      record,
  );

  return {
    linked: true,
    summary: {},
    items: [],
    profile,
  };
}

export function unwrapMemberScope<T = Record<string, unknown>>(response: unknown): MemberScopeResult<T> {
  const record = asRecord(response);
  const linked = parseMemberLinked(response);

  if (!linked) {
    return EMPTY_MEMBER_SCOPE as MemberScopeResult<T>;
  }

  const summary = unwrapApiSummary(record.summary ?? record.stats ?? record.totals ?? record);
  const items = extractNestedList(record) as T[];

  return {
    linked: true,
    summary,
    items,
    profile: asRecord(record.member ?? record.profile),
  };
}
