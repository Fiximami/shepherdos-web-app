"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

type FormToastProps = {
  message: string;
  variant: "success" | "error";
  onDismiss?: () => void;
  autoDismissMs?: number;
  className?: string;
};

export function FormToast({
  message,
  variant,
  onDismiss,
  autoDismissMs = 4000,
  className,
}: FormToastProps) {
  useEffect(() => {
    if (variant !== "success" || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, message, onDismiss, variant]);

  const Icon = variant === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
        variant === "success"
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
          : "border-destructive/25 bg-destructive/10 text-destructive",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs opacity-80 hover:opacity-100"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
