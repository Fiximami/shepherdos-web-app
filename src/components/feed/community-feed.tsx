"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FeedComment = {
  id: string;
  author: string;
  message: string;
  time: string;
};

type FeedPost = {
  id: string;
  author: string;
  message: string;
  time: string;
  likes: number;
  comments: FeedComment[];
};

const initialPosts: FeedPost[] = [
  {
    id: "post-1",
    author: "Grace Community Team",
    message:
      "Thank you to everyone who served at outreach this weekend. 18 families were visited.",
    time: "Today",
    likes: 18,
    comments: [
      {
        id: "c-1",
        author: "Ruth Eze",
        message: "Grateful to be part of this. The visits were truly meaningful.",
        time: "1h ago",
      },
      {
        id: "c-2",
        author: "Samuel Okoro",
        message: "Can we share the next outreach schedule early this week?",
        time: "45m ago",
      },
    ],
  },
  {
    id: "post-2",
    author: "Hospitality Ministry",
    message:
      "New volunteers orientation starts after service next Sunday. Please invite anyone ready to serve.",
    time: "Yesterday",
    likes: 11,
    comments: [
      {
        id: "c-3",
        author: "Deborah Afolabi",
        message: "I have two people interested from my connect group.",
        time: "Yesterday",
      },
      {
        id: "c-4",
        author: "David Aina",
        message: "Could we also include a brief follow-up training slot?",
        time: "Yesterday",
      },
      {
        id: "c-5",
        author: "Moses Bassey",
        message: "Happy to support with welcome desk setup.",
        time: "20h ago",
      },
    ],
  },
];

export function CommunityFeed() {
  const [likedPostIds, setLikedPostIds] = useState<Record<string, boolean>>({});
  const [openCommentsPostIds, setOpenCommentsPostIds] = useState<Record<string, boolean>>({});
  const [draftByPostId, setDraftByPostId] = useState<Record<string, string>>({});

  const posts = useMemo(() => initialPosts, []);

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const liked = Boolean(likedPostIds[post.id]);
        const isCommentsOpen = Boolean(openCommentsPostIds[post.id]);
        const likeCount = liked ? post.likes + 1 : post.likes;
        const commentCount = post.comments.length;

        return (
          <article
            key={post.id}
            className="rounded-xl border border-border/60 bg-background/60 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{post.author}</p>
              <span className="text-xs text-muted-foreground">{post.time}</span>
            </div>

            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {post.message}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 rounded-lg border-border/70 bg-background/80 text-xs",
                  liked && "border-primary/35 bg-primary/10 text-foreground",
                )}
                onClick={() =>
                  setLikedPostIds((current) => ({
                    ...current,
                    [post.id]: !current[post.id],
                  }))
                }
              >
                <Heart
                  className={cn("size-3.5", liked && "fill-current text-primary")}
                  aria-hidden
                />
                {likeCount}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-border/70 bg-background/80 text-xs"
                onClick={() =>
                  setOpenCommentsPostIds((current) => ({
                    ...current,
                    [post.id]: !current[post.id],
                  }))
                }
              >
                <MessageCircle className="size-3.5" aria-hidden />
                {commentCount}
              </Button>
            </div>

            {isCommentsOpen ? (
              <div className="mt-3 rounded-lg border border-border/60 bg-background/70 p-3">
                <div className="space-y-2.5">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-border/50 bg-background/80 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-foreground">{comment.author}</p>
                        <span className="text-[11px] text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <Input
                    value={draftByPostId[post.id] ?? ""}
                    onChange={(event) =>
                      setDraftByPostId((current) => ({
                        ...current,
                        [post.id]: event.target.value,
                      }))
                    }
                    placeholder="Write a thoughtful comment..."
                    className="h-9 rounded-lg bg-background/90 text-sm"
                  />
                  <Button type="button" size="sm" className="h-9 rounded-lg px-3 text-xs">
                    Post
                  </Button>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
