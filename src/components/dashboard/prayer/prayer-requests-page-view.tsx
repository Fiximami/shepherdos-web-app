"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HandHeart, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
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
  fetchMyPrayerRequests,
  formatPrayerRequestDate,
  mapMemberPrayerRequest,
  submitPrayerRequest,
  type MemberPrayerRequestRow,
} from "@/lib/api/prayer-requests";
import { getApiErrorMessage } from "@/lib/api/errors";
import { EMPTY_MEMBER_SCOPE } from "@/lib/api/member-scope";
import {
  prayerRequestFormSchema,
  type PrayerRequestFormValues,
} from "@/lib/validations/prayer-request";
import { useAuth } from "@/providers/auth-provider";

type DemoVisibility = "Private" | "Leaders Only" | "Church Community";

type DemoPrayerRequest = MemberPrayerRequestRow & {
  visibility: DemoVisibility;
};

const demoInitialRequests: DemoPrayerRequest[] = [
  {
    id: "pr-1",
    title: "Family peace and wisdom",
    content:
      "Please pray for unity and wisdom as we navigate an important family decision this month.",
    visibility: "Leaders Only",
    submittedAt: "2026-04-18",
    status: "Active",
  },
  {
    id: "pr-2",
    title: "Health recovery",
    content: "Kindly remember my mother in prayer for full strength and recovery after treatment.",
    visibility: "Church Community",
    submittedAt: "2026-04-15",
    status: "Prayed For",
  },
];

function statusClassName(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("prayed") || normalized.includes("answered") || normalized.includes("closed")) {
    return "bg-emerald-400/10 text-emerald-200";
  }
  if (normalized.includes("active") || normalized.includes("open") || normalized.includes("new")) {
    return "bg-blue-400/10 text-blue-200";
  }
  return "bg-white/[0.06] text-gray-300";
}

type PrayerRequestListProps = {
  requests: Array<MemberPrayerRequestRow & { visibility?: string }>;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
};

function PrayerRequestList({
  requests,
  isLoading = false,
  error = null,
  emptyMessage = "No prayer requests yet.",
}: PrayerRequestListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-8 text-sm text-gray-300">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading your prayer requests…
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
    <div className="space-y-2.5">
      {requests.map((request) => (
        <article key={request.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-white">{request.title}</p>
            <span className="shrink-0 text-[11px] text-gray-400">
              {formatPrayerRequestDate(request.submittedAt)}
            </span>
          </div>
          {request.content ? (
            <p className="mt-1 text-sm text-gray-300">{request.content}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className={`rounded-full px-2 py-1 ${statusClassName(request.status)}`}>
              {request.status}
            </span>
            {"visibility" in request && request.visibility ? (
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-gray-300">
                {String(request.visibility)}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

type DemoPrayerSubmitFormProps = {
  onSubmitted: (request: DemoPrayerRequest) => void;
};

function DemoPrayerSubmitForm({ onSubmitted }: DemoPrayerSubmitFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<DemoVisibility>("Leaders Only");
  const [feedback, setFeedback] = useState("");

  const visibilityHint = useMemo(() => {
    if (visibility === "Private") return "Visible only to you in this preview.";
    if (visibility === "Leaders Only") return "Shared with trusted pastoral and care leaders.";
    return "Shared with church community for encouragement and prayer support.";
  }, [visibility]);

  const canSubmit = title.trim().length > 2 && content.trim().length > 8;

  const handleSubmit = () => {
    if (!canSubmit) {
      setFeedback("Please add a short title and a fuller request before submitting.");
      return;
    }

    onSubmitted({
      id: `pr-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      visibility,
      submittedAt: new Date().toISOString(),
      status: "Active",
    });
    setTitle("");
    setContent("");
    setVisibility("Leaders Only");
    setFeedback("Prayer request submitted in demo mode. You are not carrying this alone.");
  };

  return (
    <CardContent className="space-y-3">
      <input
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          if (feedback) setFeedback("");
        }}
        placeholder="Request title (for example: Family peace and wisdom)"
        className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/30"
      />

      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          if (feedback) setFeedback("");
        }}
        placeholder="Share your prayer request..."
        rows={5}
        className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/30"
      />

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Visibility</p>
        <div className="flex flex-wrap gap-2">
          {(["Private", "Leaders Only", "Church Community"] as const).map((option) => {
            const isActive = visibility === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setVisibility(option)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "border-primary/35 bg-primary/12 text-white"
                    : "border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400">{visibilityHint}</p>
      </div>

      <Button type="button" className="h-9 rounded-lg" onClick={handleSubmit} disabled={!canSubmit}>
        Submit prayer request
      </Button>

      {feedback ? <p className="text-xs text-gray-300">{feedback}</p> : null}
    </CardContent>
  );
}

type LivePrayerSubmitFormProps = {
  onSubmitted: () => void;
};

function LivePrayerSubmitForm({ onSubmitted }: LivePrayerSubmitFormProps) {
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrayerRequestFormValues>({
    resolver: zodResolver(prayerRequestFormSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setToast(null);
    try {
      await submitPrayerRequest({
        title: values.title,
        content: values.content,
      });
      reset({ title: "", content: "" });
      setToast({
        message: "Prayer request submitted. You are not carrying this alone.",
        variant: "success",
      });
      onSubmitted();
    } catch (cause) {
      setToast({ message: getApiErrorMessage(cause), variant: "error" });
    }
  });

  return (
    <CardContent className="space-y-3">
      {toast ? (
        <FormToast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />
      ) : null}

      <form className="space-y-3" onSubmit={onSubmit} noValidate>
        <div className="space-y-1">
          <input
            {...register("title")}
            placeholder="Request title (for example: Family peace and wisdom)"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.title)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
          />
          {errors.title?.message ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <textarea
            {...register("content")}
            placeholder="Share your prayer request..."
            rows={5}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.content)}
            className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
          />
          {errors.content?.message ? (
            <p className="text-xs text-destructive">{errors.content.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="h-9 rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting…
            </>
          ) : (
            "Submit prayer request"
          )}
        </Button>
      </form>
    </CardContent>
  );
}

export function PrayerRequestsPageView() {
  const { isDemo } = useAuth();
  const [demoRequests, setDemoRequests] = useState<DemoPrayerRequest[]>(demoInitialRequests);
  const prayerQuery = useApiData(
    "member-prayer-requests-me",
    fetchMyPrayerRequests,
    EMPTY_MEMBER_SCOPE,
  );

  const isLinked = prayerQuery.isLive && prayerQuery.data.linked;

  const liveRequests = useMemo(() => {
    if (!isLinked) return [];
    return prayerQuery.data.items.map((item, index) =>
      mapMemberPrayerRequest(item as Record<string, unknown>, index),
    );
  }, [isLinked, prayerQuery.data.items]);

  const showSubmitForm = isDemo || isLinked;
  const listRequests = isDemo ? demoRequests : liveRequests;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Prayer Requests"
            description="Share prayer needs in a safe, supportive space where care, faith, and gentle follow-up remain central."
          />
        </div>
      </section>

      {!isDemo ? (
        <ApiConnectionNotice
          isLoading={prayerQuery.isLoading}
          error={prayerQuery.error}
          isLive={prayerQuery.isLive}
          liveLabel="Your prayer requests load from /prayer-requests/me."
        />
      ) : null}

      {prayerQuery.isLive && !prayerQuery.data.linked ? (
        <MemberLinkedNotice message="Your account is not linked to a member profile." />
      ) : null}

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {showSubmitForm ? (
            <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <HandHeart className="size-4 text-amber-200/90" aria-hidden />
                  Submit prayer request
                </CardTitle>
                <CardDescription>
                  {isDemo
                    ? "Preview how prayer requests will work in the member portal."
                    : "Write freely and clearly. This is a calm space for spiritual support, not a ticket queue."}
                </CardDescription>
              </CardHeader>
              {isDemo ? (
                <DemoPrayerSubmitForm
                  onSubmitted={(request) => setDemoRequests((current) => [request, ...current])}
                />
              ) : (
                <LivePrayerSubmitForm onSubmitted={prayerQuery.refetch} />
              )}
            </Card>
          ) : null}

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">My prayer requests</CardTitle>
              <CardDescription>
                {isDemo
                  ? "Recent requests in this preview workspace."
                  : "Recent requests you have submitted."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrayerRequestList
                requests={listRequests}
                isLoading={!isDemo && prayerQuery.isLoading}
                error={!isDemo && !prayerQuery.isLoading ? prayerQuery.error : null}
                emptyMessage={
                  isLinked || isDemo
                    ? "No prayer requests yet."
                    : "Your prayer requests will appear here when your profile is linked."
                }
              />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="size-4 text-amber-200/90" aria-hidden />
              Encouragement
            </CardTitle>
            <CardDescription>Gentle pastoral support for this moment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-sm text-gray-200">
                You are seen, and your burden matters. Prayer requests here are handled with care,
                dignity, and confidentiality.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-300">
                <Lock className="size-3.5" aria-hidden />
                Safe sharing
              </p>
              <p className="text-xs text-gray-400">
                Requests are shared with authorized care leaders according to church policy.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-300">
                <ShieldCheck className="size-3.5" aria-hidden />
                Care follow-up
              </p>
              <p className="text-xs text-gray-400">
                Leaders and care teams can respond prayerfully and respectfully as needed.
              </p>
            </div>
            <p className="text-xs italic text-amber-100/80">
              &quot;Cast all your anxiety on Him because He cares for you.&quot; — 1 Peter 5:7
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
