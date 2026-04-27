"use client";

import { Award, Cake, Gift, HandHeart, MessageCircleHeart, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const personalCelebration = {
  title: "Your 4-year membership journey",
  note: "Thank you for serving faithfully and staying rooted in worship, care, and community life.",
  badge: "Faithful Presence",
};

const upcomingBirthdays = [
  { name: "Miriam Osei", date: "Apr 30", ministry: "Choir Team" },
  { name: "Daniel Kwarteng", date: "May 2", ministry: "Youth Ministry" },
  { name: "Ruth Eze", date: "May 4", ministry: "Hospitality" },
] as const;

const anniversaries = [
  { name: "The Aina Family", milestone: "2 years in Grace Community Church", date: "This weekend" },
  { name: "Samuel Okoro", milestone: "1 year in ushering service", date: "Next Wednesday" },
] as const;

const ministryMilestones = [
  {
    title: "Outreach Team",
    note: "Completed 25 home visits this month with prayer and care follow-up.",
  },
  {
    title: "Prayer Chain",
    note: "Reached 100 active intercession responses across member requests.",
  },
  {
    title: "Youth Mentorship",
    note: "12 new youth mentors onboarded and paired this quarter.",
  },
] as const;

const celebrationMessages = [
  {
    author: "Pastoral Care Team",
    message:
      "We celebrate your steady commitment. Quiet faithfulness shapes stronger communities more than loud moments.",
  },
  {
    author: "Community Life Office",
    message:
      "Thank you for showing up with warmth and service. Your presence has encouraged many people this season.",
  },
] as const;

export function CelebrationsPageView() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="pointer-events-none absolute bottom-2 left-1/2 h-16 w-28 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative z-10">
          <PageHeader
            title="My Celebrations"
            description="A joyful space to honor personal growth and community milestones with gratitude, warmth, and encouragement."
          />
        </div>
      </section>

      <section className="shepherd-fade-in grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Sparkles className="size-4 text-amber-200/90" aria-hidden />
                Personal celebration
              </CardTitle>
              <CardDescription>Your own milestone in this season of church life.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-amber-200/20 bg-amber-200/5 px-4 py-4">
                <p className="text-sm font-semibold text-white">{personalCelebration.title}</p>
                <p className="mt-1 text-sm text-gray-300">{personalCelebration.note}</p>
                <p className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] text-amber-100">
                  {personalCelebration.badge}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Cake className="size-4 text-blue-200/90" aria-hidden />
                Upcoming birthdays
              </CardTitle>
              <CardDescription>Members to celebrate in the coming days.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2.5 sm:grid-cols-2">
              {upcomingBirthdays.map((birthday) => (
                <article key={birthday.name} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm font-medium text-white">{birthday.name}</p>
                  <p className="text-xs text-gray-400">{birthday.date}</p>
                  <p className="mt-1 text-xs text-gray-300">{birthday.ministry}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Gift className="size-4 text-amber-200/90" aria-hidden />
                Anniversaries
              </CardTitle>
              <CardDescription>Meaningful journey marks within the community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {anniversaries.map((item) => (
                <article key={item.name} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-300">{item.milestone}</p>
                  <p className="mt-1 text-xs text-gray-400">{item.date}</p>
                </article>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Award className="size-4 text-blue-200/90" aria-hidden />
                Ministry milestones
              </CardTitle>
              <CardDescription>Recent progress worth honoring as a church family.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {ministryMilestones.map((item) => (
                <article key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-gray-300">{item.note}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageCircleHeart className="size-4 text-amber-200/90" aria-hidden />
                Celebration messages
              </CardTitle>
              <CardDescription>Encouraging notes from pastoral and community teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {celebrationMessages.map((item) => (
                <article key={item.author} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{item.author}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-300">{item.message}</p>
                </article>
              ))}
              <p className="inline-flex items-center gap-1.5 text-xs text-amber-100/80">
                <HandHeart className="size-3.5" aria-hidden />
                Gratitude strengthens the heart of community.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
