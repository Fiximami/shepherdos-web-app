export function formatApiValue(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function formatCurrency(value: unknown, currency = "GHS"): string {
  if (value === null || value === undefined || value === "") return "—";
  const amount = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(amount)) return String(value);
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function pickSummaryValue(summary: Record<string, unknown>, keys: string[], fallback = "—") {
  for (const key of keys) {
    const value = summary[key];
    if (value !== undefined && value !== null && value !== "") {
      return formatApiValue(value);
    }
  }
  return fallback;
}

export function pickSummaryCurrency(summary: Record<string, unknown>, keys: string[], fallback = "—") {
  for (const key of keys) {
    const value = summary[key];
    if (value !== undefined && value !== null && value !== "") {
      return formatCurrency(value);
    }
  }
  return fallback;
}
