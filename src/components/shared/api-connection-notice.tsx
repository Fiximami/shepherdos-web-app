"use client";

type ApiConnectionNoticeProps = {
  isLoading?: boolean;
  error?: string | null;
  isLive?: boolean;
  liveLabel?: string;
  fallbackLabel?: string;
};

export function ApiConnectionNotice({
  isLoading,
  error,
  isLive,
  liveLabel = "Showing live data from the API.",
  fallbackLabel = "Showing preview data while the API is unavailable.",
}: ApiConnectionNoticeProps) {
  if (isLoading) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300">
        Loading live data…
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
        {fallbackLabel} {error}
      </p>
    );
  }

  if (isLive) {
    return (
      <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
        {liveLabel}
      </p>
    );
  }

  return null;
}
