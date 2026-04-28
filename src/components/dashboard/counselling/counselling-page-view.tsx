"use client";

import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CounsellingType =
  | "Marriage / Relationship"
  | "Family"
  | "Spiritual Guidance"
  | "Personal Support"
  | "Youth / Career"
  | "Grief / Bereavement"
  | "Other";

type CounsellorType = "Pastor" | "Elder" | "Counsellor" | "Any available";
type Urgency = "Normal" | "Soon" | "Urgent";
type RequestStatus = "Pending" | "Scheduled" | "Completed" | "Cancelled";

type CounsellingRequest = {
  id: string;
  type: CounsellingType;
  preferredDate: string;
  preferredTime: string;
  assignedCounsellor: string;
  status: RequestStatus;
};

const initialRequests: CounsellingRequest[] = [
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

function statusBadge(status: RequestStatus) {
  const styles: Record<RequestStatus, string> = {
    Pending: "bg-amber-400/10 text-amber-100 border-amber-400/20",
    Scheduled: "bg-sky-400/10 text-sky-100 border-sky-400/20",
    Completed: "bg-emerald-400/10 text-emerald-100 border-emerald-400/20",
    Cancelled: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  };
  return styles[status];
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function CounsellingPageView() {
  const [requests, setRequests] = useState<CounsellingRequest[]>(initialRequests);
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
  }, [preferredDate, preferredTime, note, consent]);

  const handleSubmit = () => {
    if (!canSubmit) {
      setFeedback("Please complete the required fields and consent confirmation before submitting.");
      return;
    }

    const next: CounsellingRequest = {
      id: `c-${Date.now()}`,
      type,
      preferredDate,
      preferredTime,
      assignedCounsellor: "Pending assignment",
      status: "Pending",
    };

    setRequests((current) => [next, ...current]);
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

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Counselling booking form</CardTitle>
              <CardDescription>Share your request quietly. This preview uses mock data only.</CardDescription>
            </CardHeader>
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
                  {(
                    [
                      "Marriage / Relationship",
                      "Family",
                      "Spiritual Guidance",
                      "Personal Support",
                      "Youth / Career",
                      "Grief / Bereavement",
                      "Other",
                    ] as const
                  ).map((item) => (
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
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">My counselling requests</CardTitle>
              <CardDescription>Your submitted requests and booking progress in this preview.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
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
                        {formatDate(req.preferredDate)} · {req.preferredTime}
                      </td>
                      <td className="py-2.5 pr-3 text-gray-400">{req.assignedCounsellor}</td>
                      <td className="py-2.5">
                        <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px]", statusBadge(req.status))}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                Choose <span className="text-white">Urgent</span> if you need support within 24-48 hours.
              </p>
              <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                For minors, include a guardian contact note where applicable.
              </p>
              <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                In this preview, bookings are mock only and do not notify live leaders yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
