"use client";

import { CalendarCheck2, Loader2, MapPinCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkInAttendance } from "@/lib/api/attendance";
import { getApiErrorMessage } from "@/lib/api/errors";
import { pickSummaryValue } from "@/lib/api/formatters";
import type { MemberAttendanceSessionRow } from "@/lib/api/mappers";
import type { AttendanceCheckInResult } from "@/lib/api/types";

type AttendanceCheckInPanelProps = {
  mode: "demo" | "live";
  summary: Record<string, unknown>;
  sessions: MemberAttendanceSessionRow[];
  onCheckInSuccess?: () => void;
};

function formatCheckInDisplay(value: string): string {
  if (!value || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveLastCheckIn(
  summary: Record<string, unknown>,
  sessions: MemberAttendanceSessionRow[],
  checkInResult: AttendanceCheckInResult | null,
): string {
  if (checkInResult?.lastCheckInAt && checkInResult.lastCheckInAt !== "—") {
    return checkInResult.lastCheckInAt;
  }

  const fromSummary = pickSummaryValue(
    summary,
    ["lastCheckInAt", "lastCheckIn", "lastAttendedAt", "latestCheckIn"],
    "",
  );
  if (fromSummary) return fromSummary;

  if (sessions.length > 0) {
    return sessions[0].date;
  }

  return "—";
}

function resolveCheckInStatus(
  summary: Record<string, unknown>,
  checkInResult: AttendanceCheckInResult | null,
  checkedInToday: boolean,
): string {
  if (checkedInToday) return "Checked in today";
  if (checkInResult?.status && checkInResult.status !== "—") {
    return checkInResult.status.replace(/_/g, " ");
  }
  return pickSummaryValue(
    summary,
    ["checkInStatus", "todayCheckInStatus", "latestStatus"],
    "Not checked in today",
  );
}

export function AttendanceCheckInPanel({
  mode,
  summary,
  sessions,
  onCheckInSuccess,
}: AttendanceCheckInPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkInResult, setCheckInResult] = useState<AttendanceCheckInResult | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null,
  );

  const summaryCheckedInToday = useMemo(() => {
    const raw =
      summary.checkedInToday ?? summary.alreadyCheckedIn ?? summary.isCheckedInToday ?? false;
    return raw === true || raw === "true";
  }, [summary]);

  const isCheckedInToday = Boolean(
    checkedInToday || summaryCheckedInToday || checkInResult?.checkedInToday,
  );

  const lastCheckIn = useMemo(
    () => resolveLastCheckIn(summary, sessions, checkInResult),
    [checkInResult, sessions, summary],
  );

  const statusLabel = useMemo(
    () => resolveCheckInStatus(summary, checkInResult, isCheckedInToday),
    [checkInResult, isCheckedInToday, summary],
  );

  const handleDemoCheckIn = () => {
    if (isCheckedInToday || isSubmitting) return;
    setIsSubmitting(true);
    setToast(null);
    window.setTimeout(() => {
      setCheckedInToday(true);
      setCheckInResult({
        status: "checked_in",
        message: "Check-in recorded in demo mode.",
        lastCheckInAt: new Date().toISOString(),
        sessionName: "Sunday Celebration",
        checkedInToday: true,
      });
      setToast({
        message: "Check-in recorded in demo mode. Sign in with a live account to sync with the server.",
        variant: "success",
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleLiveCheckIn = async () => {
    if (isCheckedInToday || isSubmitting) return;
    setIsSubmitting(true);
    setToast(null);

    try {
      const result = await checkInAttendance();
      setCheckInResult(result);
      setCheckedInToday(result.checkedInToday || true);
      setToast({ message: result.message, variant: "success" });
      onCheckInSuccess?.();
    } catch (cause) {
      setToast({ message: getApiErrorMessage(cause), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckIn = () => {
    if (mode === "demo") {
      handleDemoCheckIn();
      return;
    }
    void handleLiveCheckIn();
  };

  const isDisabled = isSubmitting || isCheckedInToday;

  return (
    <section className="mt-4">
      <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MapPinCheck className="size-4 text-primary" aria-hidden />
            Service check-in
          </CardTitle>
          <CardDescription>
            {mode === "demo"
              ? "Preview how self check-in will work when you use a live linked account."
              : "Mark your presence for the current service window."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {toast ? (
            <FormToast
              message={toast.message}
              variant={toast.variant}
              onDismiss={() => setToast(null)}
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/65 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Check-in status
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{statusLabel}</p>
              {checkInResult?.sessionName && checkInResult.sessionName !== "—" ? (
                <p className="mt-1 text-xs text-muted-foreground">{checkInResult.sessionName}</p>
              ) : null}
            </div>
            <div className="rounded-xl border border-border/70 bg-background/65 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Last check-in
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatCheckInDisplay(lastCheckIn)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {isCheckedInToday
                ? "You are already checked in for today."
                : "Check in once per service day to record your attendance."}
            </p>
            <Button
              type="button"
              className="h-10 rounded-xl"
              disabled={isDisabled}
              onClick={handleCheckIn}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Checking in…
                </>
              ) : isCheckedInToday ? (
                <>
                  <CalendarCheck2 className="size-4" aria-hidden />
                  Checked in
                </>
              ) : (
                <>
                  <MapPinCheck className="size-4" aria-hidden />
                  Check in
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
