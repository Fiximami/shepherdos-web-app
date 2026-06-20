export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function extractList(candidate: unknown): unknown[] | null {
  if (Array.isArray(candidate)) {
    return candidate;
  }

  if (candidate && typeof candidate === "object") {
    const nested = candidate as Record<string, unknown>;
    const nestedList =
      nested.data ?? nested.items ?? nested.results ?? nested.transactions ?? nested.records;
    if (Array.isArray(nestedList)) {
      return nestedList;
    }
  }

  return null;
}

export function unwrapApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response.filter((item) => item != null) as T[];
  }

  const record = asRecord(response);
  const candidates = [
    record.data,
    record.items,
    record.results,
    record.transactions,
    record.records,
    record.auditLogs,
    record.logs,
  ];

  for (const candidate of candidates) {
    const list = extractList(candidate);
    if (list) {
      return list.filter((item) => item != null) as T[];
    }
  }

  return [];
}

export function unwrapApiSummary(response: unknown): Record<string, unknown> {
  const record = asRecord(response);
  const nested = record.data ?? record.summary ?? record.result;

  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  return record;
}

export function unwrapApiEntity<T>(response: unknown): T {
  const record = asRecord(response);
  const nested =
    record.data ??
    record.result ??
    record.member ??
    record.session ??
    record.transaction ??
    record.record;

  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as T;
  }

  return record as T;
}
