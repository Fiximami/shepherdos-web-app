type PreviewSectionNoticeProps = {
  message?: string;
  className?: string;
};

export const PREVIEW_ONLY_LABEL = "Preview only";

export function previewDescription(description: string) {
  return `${description} (${PREVIEW_ONLY_LABEL} — no live endpoint yet.)`;
}

export function PreviewSectionNotice({
  message = "Preview only — illustrative data until a backend endpoint is available.",
  className,
}: PreviewSectionNoticeProps) {
  return (
    <p
      className={
        className ??
        "rounded-lg border border-slate-500/20 bg-slate-500/10 px-3 py-2 text-xs text-slate-300"
      }
    >
      {message}
    </p>
  );
}
