"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminModal } from "@/components/admin/shared/admin-modal";
import { FormToast } from "@/components/shared/form-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAttendanceSession,
  recordAttendance,
  updateAttendanceSession,
} from "@/lib/api/attendance";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { SessionRow } from "@/lib/api/mappers";

type ToastState = { message: string; variant: "success" | "error" } | null;

type CreateSessionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateSessionDialog({ open, onClose, onSuccess }: CreateSessionDialogProps) {
  const [serviceName, setServiceName] = useState("Sunday Celebration Service");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [branch, setBranch] = useState("Main Campus");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open) return;
    setToast(null);
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setToast(null);
    try {
      await createAttendanceSession({
        serviceName: serviceName.trim(),
        date,
        branch: branch.trim() || undefined,
        department: department.trim() || undefined,
      });
      setToast({ message: "Service session created.", variant: "success" });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Create service session"
      description="Open an official attendance session for leaders to record counts."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="session-name">Service / event name</Label>
          <Input id="session-name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="session-date">Date</Label>
            <Input id="session-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-branch">Branch</Label>
            <Input id="session-branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-department">Department (optional)</Label>
          <Input id="session-department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creating…
              </>
            ) : (
              "Create session"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

type RecordAttendanceDialogProps = {
  open: boolean;
  sessions: SessionRow[];
  onClose: () => void;
  onSuccess: () => void;
};

export function RecordAttendanceDialog({
  open,
  sessions,
  onClose,
  onSuccess,
}: RecordAttendanceDialogProps) {
  const [sessionId, setSessionId] = useState("");
  const [totalPresent, setTotalPresent] = useState("");
  const [firstTimers, setFirstTimers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open) return;
    setSessionId(sessions[0]?.id ?? "");
    setTotalPresent("");
    setFirstTimers("");
    setToast(null);
  }, [open, sessions]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!sessionId) {
      setToast({ message: "Select a service session first.", variant: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast(null);
    try {
      await recordAttendance({
        sessionId,
        totalPresent: totalPresent ? Number(totalPresent) : undefined,
        firstTimers: firstTimers ? Number(firstTimers) : undefined,
      });
      setToast({ message: "Attendance recorded for the session.", variant: "success" });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Record attendance"
      description="Post official attendance counts for a service session."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="record-session">Service session</Label>
          <select
            id="record-session"
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none"
            required
          >
            <option value="" disabled>
              Select session
            </option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.service} · {session.date}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="record-present">Total present</Label>
            <Input
              id="record-present"
              type="number"
              min={0}
              value={totalPresent}
              onChange={(e) => setTotalPresent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="record-first-timers">First-timers</Label>
            <Input
              id="record-first-timers"
              type="number"
              min={0}
              value={firstTimers}
              onChange={(e) => setFirstTimers(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || sessions.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Record attendance"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

type EditSessionDialogProps = {
  open: boolean;
  session: SessionRow | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditSessionDialog({ open, session, onClose, onSuccess }: EditSessionDialogProps) {
  const [serviceName, setServiceName] = useState("");
  const [totalPresent, setTotalPresent] = useState("");
  const [firstTimers, setFirstTimers] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!open || !session) return;
    setServiceName(session.service);
    setTotalPresent(String(session.totalPresent));
    setFirstTimers(String(session.firstTimers));
    setToast(null);
  }, [open, session]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    setToast(null);
    try {
      await updateAttendanceSession(session.id, {
        serviceName: serviceName.trim(),
      });
      await recordAttendance({
        sessionId: session.id,
        totalPresent: Number(totalPresent) || 0,
        firstTimers: Number(firstTimers) || 0,
      });
      setToast({ message: "Session updated and attendance saved.", variant: "success" });
      onSuccess();
      window.setTimeout(onClose, 600);
    } catch (error) {
      setToast({ message: getApiErrorMessage(error), variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminModal
      open={open}
      title="Edit session"
      description={session ? `${session.service} · ${session.date}` : undefined}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {toast ? (
          <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="edit-session-name">Service name</Label>
          <Input id="edit-session-name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-session-present">Total present</Label>
            <Input
              id="edit-session-present"
              type="number"
              min={0}
              value={totalPresent}
              onChange={(e) => setTotalPresent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-session-first-timers">First-timers</Label>
            <Input
              id="edit-session-first-timers"
              type="number"
              min={0}
              value={firstTimers}
              onChange={(e) => setFirstTimers(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !session}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save session"
            )}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}
