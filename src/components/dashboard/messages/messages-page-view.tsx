"use client";

import { MessageCircleHeart, MessagesSquare, UsersRound, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Conversation = {
  id: string;
  title: string;
  type: "Ministry" | "Group" | "Direct";
  subtitle: string;
  lastMessageAt: string;
  unread?: boolean;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    mine?: boolean;
  }>;
};

const mockConversations: Conversation[] = [
  {
    id: "c-1",
    title: "Hospitality Ministry",
    type: "Ministry",
    subtitle: "Weekend service coordination",
    lastMessageAt: "10:15 AM",
    unread: true,
    messages: [
      {
        id: "m-1",
        sender: "Grace Team Lead",
        text: "Please confirm welcome-desk coverage for Sunday first service.",
        time: "9:45 AM",
      },
      {
        id: "m-2",
        sender: "You",
        text: "Confirmed. I will be available and can support first-timers follow-up too.",
        time: "10:15 AM",
        mine: true,
      },
    ],
  },
  {
    id: "c-2",
    title: "Young Adults Connect",
    type: "Group",
    subtitle: "Prayer and fellowship updates",
    lastMessageAt: "Yesterday",
    messages: [
      {
        id: "m-3",
        sender: "Group Coordinator",
        text: "This Friday focus is gratitude and intercession for families.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "c-3",
    title: "Direct Messages",
    type: "Direct",
    subtitle: "Personal conversations placeholder",
    lastMessageAt: "No active messages",
    messages: [],
  },
];

export function MessagesPageView() {
  const [activeConversationId, setActiveConversationId] = useState<string>("c-1");

  const activeConversation = useMemo(
    () => mockConversations.find((conversation) => conversation.id === activeConversationId) ?? mockConversations[0],
    [activeConversationId],
  );

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-5 lg:p-6">
      <section className="shepherd-fade-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#10263a]/70 p-5 shadow-[0_24px_52px_-40px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.12)_0%,rgba(250,204,21,0)_72%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(59,130,246,0)_74%)]" />
        <div className="relative z-10">
          <PageHeader
            title="Messages"
            description="A respectful communication space for ministry updates, group encouragement, and church connection."
          />
        </div>
      </section>

      <section className="shepherd-fade-in grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UsersRound className="size-4 text-blue-200/90" aria-hidden />
              Conversations
            </CardTitle>
            <CardDescription>Ministry and group communication threads.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockConversations.map((conversation) => {
              const isActive = activeConversation.id === conversation.id;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-primary/35 bg-primary/12"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{conversation.title}</p>
                      <p className="text-xs text-gray-400">{conversation.subtitle}</p>
                    </div>
                    {conversation.unread ? (
                      <span className="mt-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">{conversation.lastMessageAt}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.05] shadow-[0_18px_42px_-34px_rgba(0,0,0,0.72)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessagesSquare className="size-4 text-amber-200/90" aria-hidden />
              {activeConversation.title}
            </CardTitle>
            <CardDescription>{activeConversation.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {activeConversation.messages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-4 py-10 text-center">
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  <UserRound className="size-4 text-blue-200/90" aria-hidden />
                  Direct message placeholder
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Personal member-to-member and leader direct conversations will appear here in a future update.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeConversation.messages.map((message) => (
                  <div key={message.id} className={cn("flex", message.mine ? "justify-end" : "justify-start")}>
                    <article
                      className={cn(
                        "max-w-[85%] rounded-xl border px-3.5 py-2.5",
                        message.mine
                          ? "border-primary/25 bg-primary/12"
                          : "border-white/10 bg-white/[0.04]",
                      )}
                    >
                      <p className="text-xs font-medium text-gray-300">{message.sender}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white">{message.text}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{message.time}</p>
                    </article>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-gray-400">
              <p className="inline-flex items-center gap-1.5">
                <MessageCircleHeart className="size-3.5 text-amber-200/90" aria-hidden />
                Real-time messaging is not connected in this preview. This panel is mock data only.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
