"use client";

type ApiConnectionNoticeProps = {
  isLoading?: boolean;
  error?: string | null;
  isLive?: boolean;
  liveLabel?: string;
  fallbackLabel?: string;
  previewLabel?: string;
};

export function ApiConnectionNotice({
  isLoading,
  error,
  isLive,
  liveLabel = "Showing live data from the API.",
  fallbackLabel = "Could not load live data. Preview values may appear below.",
  previewLabel = "Preview mode — sign in with a live account to load API data. Illustrative values may appear below.",
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

  return (
    <p className="rounded-lg border border-slate-500/25 bg-slate-500/10 px-3 py-2 text-xs text-slate-300">
      {previewLabel}
    </p>
  );
}
