import type { RouteBadge } from "@/lib/config/alpha-routes";
import { cn } from "@/lib/utils";

type PreviewBadgeProps = {
  label?: RouteBadge;
  className?: string;
};

export function PreviewBadge({ label = "Beta", className }: PreviewBadgeProps) {
  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
        label === "Beta"
          ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
          : "border-slate-400/25 bg-slate-500/10 text-slate-300",
        className,
      )}
    >
      {label}
    </span>
  );
}
