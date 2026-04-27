"use client";

import { HandHeart, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Visibility = "Private" | "Leaders Only" | "Church Community";

type PrayerRequest = {
  id: string;
  title: string;
  message: string;
  visibility: Visibility;
  submittedAt: string;
  status: "Active" | "Prayed For";
};

const initialRequests: PrayerRequest[] = [
  {
    id: "pr-1",
    title: "Family peace and wisdom",
    message: "Please pray for unity and wisdom as we navigate an important family decision this month.",
    visibility: "Leaders Only",
    submittedAt: "2 days ago",
    status: "Active",
  },
  {
    id: "pr-2",
    title: "Health recovery",
    message: "Kindly remember my mother in prayer for full strength and recovery after treatment.",
    visibility: "Church Community",
    submittedAt: "5 days ago",
    status: "Prayed For",
  },
];

export function PrayerRequestsPageView() {
  const [requests, setRequests] = useState<PrayerRequest[]>(initialRequests);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("Leaders Only");
  const [feedback, setFeedback] = useState("");

  const canSubmit = title.trim().length > 2 && message.trim().length > 8;

  const visibilityHint = useMemo(() => {
    if (visibility === "Private") {
      return "Visible only to you in this preview.";
    }
    if (visibility === "Leaders Only") {
      return "Shared with trusted pastoral and care leaders.";
    }
    return "Shared with church community for encouragement and prayer support.";
  }, [visibility]);

  const handleSubmit = () => {
    if (!canSubmit) {
      setFeedback("Please add a short title and a fuller request before submitting.");
      return;
    }

    const next: PrayerRequest = {
      id: `pr-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      visibility,
      submittedAt: "Just now",
      status: "Active",
    };

    setRequests((current) => [next, ...current]);
    setTitle("");
    setMessage("");
    setVisibility("Leaders Only");
    setFeedback("Prayer request submitted. You are not carrying this alone.");
  };

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

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <HandHeart className="size-4 text-amber-200/90" aria-hidden />
                Submit prayer request
              </CardTitle>
              <CardDescription>
                Write freely and clearly. This is a calm space for spiritual support, not a ticket queue.
              </CardDescription>
            </CardHeader>
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
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
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
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">My prayer requests</CardTitle>
              <CardDescription>Recent requests you have submitted in this preview workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {requests.map((request) => (
                <article key={request.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{request.title}</p>
                    <span className="text-[11px] text-gray-400">{request.submittedAt}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-300">{request.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-gray-300">
                      {request.visibility}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 ${
                        request.status === "Active"
                          ? "bg-blue-400/10 text-blue-200"
                          : "bg-emerald-400/10 text-emerald-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </article>
              ))}
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
                You are seen, and your burden matters. Prayer requests here are handled with care, dignity, and
                confidentiality.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-300">
                <Lock className="size-3.5" aria-hidden />
                Safe sharing
              </p>
              <p className="text-xs text-gray-400">
                Use visibility controls to decide who can view each request.
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
