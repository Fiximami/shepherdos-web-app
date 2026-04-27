import { MessageCircleHeart } from "lucide-react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { CommunityFeed } from "@/components/feed/community-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Community Feed"
            description="A respectful church timeline for updates, testimonies, prayer encouragement, and shared community moments."
          />
        </div>
      </section>

      <Card className="shepherd-fade-in border-white/10 bg-white/[0.05] shadow-[0_20px_46px_-34px_rgba(0,0,0,0.72)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageCircleHeart className="size-4 text-blue-200/90" aria-hidden />
            Church community timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommunityFeed maxPosts={20} showFilters />
        </CardContent>
      </Card>
    </main>
  );
}
