"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { FormToast } from "@/components/shared/form-toast";
import { MemberLinkedNotice } from "@/components/shared/member-linked-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import {
  fetchMyCounsellingRequests,
  formatCounsellingRequestDate,
  mapMemberCounsellingRequest,
  submitCounsellingRequest,
  type MemberCounsellingRequestRow,
} from "@/lib/api/counselling";
import { getApiErrorMessage } from "@/lib/api/errors";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import {
  counsellingCategories,
  counsellingRequestFormSchema,
  type CounsellingRequestFormValues,
} from "@/lib/validations/counselling-request";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

type CounsellingType = (typeof counsellingCategories)[number];
type CounsellorType = "Pastor" | "Elder" | "Counsellor" | "Any available";
type Urgency = "Normal" | "Soon" | "Urgent";
type DemoRequestStatus = "Pending" | "Scheduled" | "Completed" | "Cancelled";

type DemoCounsellingRequest = {
  id: string;
  type: CounsellingType;
  preferredDate: string;
  preferredTime: string;
  assignedCounsellor: string;
  status: DemoRequestStatus;
};

const demoInitialRequests: DemoCounsellingRequest[] = [
  {
    id: "c-1",
    type: "Family",
    preferredDate: "2026-05-02",
    preferredTime: "16:00",
    assignedCounsellor: "Pending assignment",
    status: "Pending",
  },
  {
    id: "c-2",
    type: "Spiritual Guidance",
    preferredDate: "2026-04-30",
    preferredTime: "18:30",
    assignedCounsellor: "Ps. Joseph Boateng",
    status: "Scheduled",
  },
  {
    id: "c-3",
    type: "Youth / Career",
    preferredDate: "2026-04-18",
    preferredTime: "15:00",
    assignedCounsellor: "Deborah Afolabi",
    status: "Completed",
  },
];

function statusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("pending") || normalized.includes("submitted") || normalized.includes("new")) {
    return "bg-amber-400/10 text-amber-100 border-amber-400/20";
  }
  if (normalized.includes("scheduled") || normalized.includes("assigned")) {
    return "bg-sky-400/10 text-sky-100 border-sky-400/20";
  }
  if (normalized.includes("completed") || normalized.includes("closed")) {
    return "bg-emerald-400/10 text-emerald-100 border-emerald-400/20";
  }
  if (normalized.includes("cancel")) {
    return "bg-slate-400/10 text-slate-300 border-slate-400/20";
  }
  return "bg-white/[0.06] text-gray-300 border-white/10";
}

function formatDemoDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type LiveCounsellingListProps = {
  requests: MemberCounsellingRequestRow[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
};

function LiveCounsellingList({
  requests,
  isLoading,
  error,
  emptyMessage,
}: LiveCounsellingListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-8 text-sm text-gray-300">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading your counselling requests…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-8 text-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
            <th className="py-2 pr-3">Category</th>
            <th className="py-2 pr-3">Submitted</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-white/[0.06] last:border-0">
              <td className="py-2.5 pr-3">
                <p className="text-white">{request.category}</p>
                {request.title ? <p className="mt-0.5 text-xs text-gray-400">{request.title}</p> : null}
              </td>
              <td className="py-2.5 pr-3 text-gray-400">
                {formatCounsellingRequestDate(request.submittedAt)}
              </td>
              <td className="py-2.5">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[11px]",
                    statusBadge(request.status),
                  )}
                >
                  {request.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DemoCounsellingList({ requests }: { requests: DemoCounsellingRequest[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
            <th className="py-2 pr-3">Request type</th>
            <th className="py-2 pr-3">Preferred date/time</th>
            <th className="py-2 pr-3">Assigned counsellor</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b border-white/[0.06] last:border-0">
              <td className="py-2.5 pr-3 text-white">{req.type}</td>
              <td className="py-2.5 pr-3 text-gray-400">
                {formatDemoDate(req.preferredDate)} · {req.preferredTime}
              </td>
              <td className="py-2.5 pr-3 text-gray-400">{req.assignedCounsellor}</td>
              <td className="py-2.5">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-0.5 text-[11px]",
                    statusBadge(req.status),
                  )}
                >
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DemoCounsellingSubmitFormProps = {
  onSubmitted: (request: DemoCounsellingRequest) => void;
};

function DemoCounsellingSubmitForm({ onSubmitted }: DemoCounsellingSubmitFormProps) {
  const [type, setType] = useState<CounsellingType>("Spiritual Guidance");
  const [counsellorType, setCounsellorType] = useState<CounsellorType>("Any available");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("Normal");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [feedback, setFeedback] = useState("");

  const canSubmit = useMemo(() => {
    return preferredDate.length > 0 && preferredTime.length > 0 && note.trim().length > 8 && consent;
  }, [consent, note, preferredDate, preferredTime]);

  const handleSubmit = () => {
    if (!canSubmit) {
      setFeedback("Please complete the required fields and consent confirmation before submitting.");
      return;
    }

    onSubmitted({
      id: `c-${Date.now()}`,
      type,
      preferredDate,
      preferredTime,
      assignedCounsellor: counsellorType === "Any available" ? "Pending assignment" : counsellorType,
      status: "Pending",
    });
    setPreferredDate("");
    setPreferredTime("");
    setUrgency("Normal");
    setNote("");
    setConsent(false);
    setFeedback(
      "Your request has been recorded in this preview. In production, authorized church care leaders will review it confidentially.",
    );
  };

  return (
    <CardContent className="space-y-4">
      <div>
        <label htmlFor="counselling-type" className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Counselling type
        </label>
        <select
          id="counselling-type"
          value={type}
          onChange={(e) => setType(e.target.value as CounsellingType)}
          className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {counsellingCategories.map((item) => (
            <option key={item} value={item} className="bg-[#0d1f32] text-white">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="counsellor-type" className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Preferred counsellor type
        </label>
        <select
          id="counsellor-type"
          value={counsellorType}
          onChange={(e) => setCounsellorType(e.target.value as CounsellorType)}
          className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {(["Pastor", "Elder", "Counsellor", "Any available"] as const).map((item) => (
            <option key={item} value={item} className="bg-[#0d1f32] text-white">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="preferred-date" className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Preferred date
          </label>
          <input
            id="preferred-date"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="preferred-time" className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Preferred time
          </label>
          <input
            id="preferred-time"
            type="time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="urgency-level" className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Urgency level
        </label>
        <select
          id="urgency-level"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as Urgency)}
          className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {(["Normal", "Soon", "Urgent"] as const).map((item) => (
            <option key={item} value={item} className="bg-[#0d1f32] text-white">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reason-note" className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Short reason / note
        </label>
        <textarea
          id="reason-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            if (feedback) setFeedback("");
          }}
          rows={4}
          placeholder="Share a short context so the care team can prepare."
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      <label className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-gray-300">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 rounded border-white/20 bg-white/[0.04]"
        />
        <span>
          I understand this request will be handled confidentially by authorized church care leaders.
        </span>
      </label>

      <Button type="button" className="h-9 rounded-lg" disabled={!canSubmit} onClick={handleSubmit}>
        Submit request
      </Button>

      {feedback ? <p className="text-xs text-gray-300">{feedback}</p> : null}
    </CardContent>
  );
}

type LiveCounsellingSubmitFormProps = {
  onSubmitted: () => void;
};

function LiveCounsellingSubmitForm({ onSubmitted }: LiveCounsellingSubmitFormProps) {
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CounsellingRequestFormValues>({
    resolver: zodResolver(counsellingRequestFormSchema),
    defaultValues: {
      category: "Spiritual Guidance",
      title: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setToast(null);
    try {
      await submitCounsellingRequest({
        category: values.category,
        title: values.title,
        description: values.description,
      });
      reset({ category: values.category, title: "", description: "" });
      setToast({
        message:
          "Your counselling request has been submitted. Authorized care leaders will review it confidentially.",
        variant: "success",
      });
      onSubmitted();
    } catch (cause) {
      setToast({ message: getApiErrorMessage(cause), variant: "error" });
    }
  });

  return (
    <CardContent className="space-y-4">
      {toast ? (
        <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="live-category" className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Category
          </label>
          <select
            id="live-category"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.category)}
            className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
            {...register("category")}
          >
            {counsellingCategories.map((item) => (
              <option key={item} value={item} className="bg-[#0d1f32] text-white">
                {item}
              </option>
            ))}
          </select>
          {errors.category?.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="live-title" className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Title
          </label>
          <input
            id="live-title"
            disabled={isSubmitting}
            placeholder="Brief title for your request"
            aria-invalid={Boolean(errors.title)}
            className="mt-1.5 h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
            {...register("title")}
          />
          {errors.title?.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="live-description"
            className="text-xs font-medium uppercase tracking-wide text-gray-400"
          >
            Description
          </label>
          <textarea
            id="live-description"
            rows={4}
            disabled={isSubmitting}
            placeholder="Share context so the care team can prepare."
            aria-invalid={Boolean(errors.description)}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
            {...register("description")}
          />
          {errors.description?.message ? (
            <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-gray-300">
          <input type="checkbox" defaultChecked readOnly className="mt-0.5 rounded border-white/20 bg-white/[0.04]" />
          <span>
            I understand this request will be handled confidentially by authorized church care leaders.
          </span>
        </label>

        <Button type="submit" className="h-9 rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            "Submit request"
          )}
        </Button>
      </form>
    </CardContent>
  );
}

export function CounsellingPageView() {
  const { isDemo } = useAuth();
  const [demoRequests, setDemoRequests] = useState<DemoCounsellingRequest[]>(demoInitialRequests);
  const counsellingQuery = useApiData(
    "member-counselling-me",
    fetchMyCounsellingRequests,
    EMPTY_MEMBER_SCOPE,
  );

  const isLinked = counsellingQuery.isLive && counsellingQuery.data.linked;
  const showSubmitForm = isDemo || isLinked;

  const liveRequests = useMemo(() => {
    if (!isLinked) return [];
    return counsellingQuery.data.items.map((item, index) =>
      mapMemberCounsellingRequest(item as Record<string, unknown>, index),
    );
  }, [counsellingQuery.data.items, isLinked]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Counselling"
            description="Request confidential guidance and support from trusted church leaders."
          />
        </div>
      </section>

      {!isDemo ? (
        <ApiConnectionNotice
          isLoading={counsellingQuery.isLoading}
          error={counsellingQuery.error}
          isLive={counsellingQuery.isLive}
          liveLabel="Your counselling requests load from /counselling/me."
        />
      ) : null}

      {counsellingQuery.isLive && !counsellingQuery.data.linked ? (
        <MemberLinkedNotice message="Your account is not linked to a member profile." />
      ) : null}

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {showSubmitForm ? (
            <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Counselling booking form</CardTitle>
                <CardDescription>
                  {isDemo
                    ? "Share your request quietly. This preview uses mock data only."
                    : "Share your request quietly. Authorized care leaders will review it confidentially."}
                </CardDescription>
              </CardHeader>
              {isDemo ? (
                <DemoCounsellingSubmitForm
                  onSubmitted={(request) => setDemoRequests((current) => [request, ...current])}
                />
              ) : (
                <LiveCounsellingSubmitForm onSubmitted={counsellingQuery.refetch} />
              )}
            </Card>
          ) : null}

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">My counselling requests</CardTitle>
              <CardDescription>
                {isDemo
                  ? "Your submitted requests and booking progress in this preview."
                  : "Your submitted requests and booking progress."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDemo ? (
                <DemoCounsellingList requests={demoRequests} />
              ) : (
                <LiveCounsellingList
                  requests={liveRequests}
                  isLoading={counsellingQuery.isLoading}
                  error={!counsellingQuery.isLoading ? counsellingQuery.error : null}
                  emptyMessage={
                    isLinked
                      ? "No counselling requests yet."
                      : "Your counselling requests will appear here when your profile is linked."
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Confidentiality note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs leading-relaxed text-gray-300">
              <p className="inline-flex items-start gap-1.5">
                <Lock className="mt-0.5 size-3.5 text-amber-200/90" aria-hidden />
                Counselling requests are private and visible only to authorized care leaders.
              </p>
              <p className="inline-flex items-start gap-1.5">
                <ShieldCheck className="mt-0.5 size-3.5 text-blue-200/90" aria-hidden />
                Sensitive details should be shared only as needed to support your care journey.
              </p>
              <p className="inline-flex items-start gap-1.5">
                <Sparkles className="mt-0.5 size-3.5 text-amber-200/90" aria-hidden />
                You are not alone. Requests are handled with prayer, respect, and pastoral discretion.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Booking guidance</CardTitle>
              <CardDescription>Helpful prompts before submitting your request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-400">
              <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                Choose a category that best describes your need so the right care leader can respond.
              </p>
              <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                For minors, include a guardian contact note where applicable.
              </p>
              <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                {isDemo
                  ? "In this preview, bookings are mock only and do not notify live leaders yet."
                  : "Submitted requests are reviewed confidentially by authorized church care leaders."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
