"use client";

import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUser } from "@/lib/mock-user";
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
  type: "Update" | "Testimony" | "Prayer Request" | "Announcement";
  message: string;
  time: string;
  likes: number;
  comments: FeedComment[];
};

const initialPosts: FeedPost[] = [
  {
    id: "post-1",
    author: "Grace Community Team",
    type: "Update",
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
    type: "Announcement",
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
  {
    id: "post-3",
    author: "Youth Ministry",
    type: "Testimony",
    message:
      "Thank you to parents and mentors who joined the youth prayer night. Next gathering is this Friday.",
    time: "2 days ago",
    likes: 9,
    comments: [
      {
        id: "c-6",
        author: "Miriam Osei",
        message: "My son came home encouraged. Grateful for the team.",
        time: "2 days ago",
      },
      {
        id: "c-7",
        author: "Daniel K.",
        message: "Can we share transport details by Thursday?",
        time: "1 day ago",
      },
    ],
  },
  {
    id: "post-4",
    author: "Care Team",
    type: "Prayer Request",
    message:
      "Three home visits were completed this week. Please continue praying for comfort and recovery.",
    time: "3 days ago",
    likes: 14,
    comments: [
      {
        id: "c-8",
        author: "Deborah Afolabi",
        message: "Thank you everyone who made time to serve quietly.",
        time: "2 days ago",
      },
      {
        id: "c-9",
        author: "Ruth Eze",
        message: "Happy to support with meal scheduling this week.",
        time: "2 days ago",
      },
      {
        id: "c-10",
        author: "Samuel Okoro",
        message: "Please share any extra support needs with the group lead.",
        time: "1 day ago",
      },
    ],
  },
];

type CommunityFeedProps = {
  maxPosts?: number;
  showViewAllLink?: boolean;
  viewAllHref?: string;
  showFilters?: boolean;
};

const leadershipRoles = new Set(["admin", "pastor", "leader", "owner"]);

const memberPostTypes = ["Update", "Testimony", "Prayer Request"] as const;
const leadershipPostTypes = [
  "Update",
  "Testimony",
  "Prayer Request",
  "Announcement",
] as const;

export function CommunityFeed({
  maxPosts = 5,
  showViewAllLink = false,
  viewAllHref = "/engagement",
  showFilters = false,
}: CommunityFeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [likedPostIds, setLikedPostIds] = useState<Record<string, boolean>>({});
  const [openCommentsPostIds, setOpenCommentsPostIds] = useState<Record<string, boolean>>({});
  const [draftByPostId, setDraftByPostId] = useState<Record<string, string>>({});
  const [newPostText, setNewPostText] = useState("");
  const [newPostType, setNewPostType] = useState<
    "Update" | "Testimony" | "Prayer Request" | "Announcement"
  >("Update");
  const [composerMessage, setComposerMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Update" | "Testimony" | "Prayer Request" | "Announcement"
  >("All");

  const availablePostTypes = leadershipRoles.has(mockUser.role)
    ? leadershipPostTypes
    : memberPostTypes;

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") {
      return posts;
    }
    return posts.filter((post) => post.type === activeFilter);
  }, [activeFilter, posts]);

  const visiblePosts = useMemo(() => filteredPosts.slice(0, maxPosts), [filteredPosts, maxPosts]);
  const userInitials = useMemo(() => {
    return mockUser.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, []);
  const isPostDisabled = newPostText.trim().length === 0;

  const handleCreatePost = () => {
    if (isPostDisabled) {
      setComposerMessage("Please share a short thought before posting.");
      return;
    }

    const createdPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: mockUser.name,
      type: newPostType,
      message: newPostText.trim(),
      time: "Just now",
      likes: 0,
      comments: [],
    };

    setPosts((current) => [createdPost, ...current]);
    setNewPostText("");
    setComposerMessage("Posted. Thank you for sharing with care.");
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.6)] transition-[border-color,box-shadow,transform] duration-250 ease-out focus-within:-translate-y-[1px] focus-within:border-white/20 focus-within:shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)] motion-reduce:transition-none motion-reduce:focus-within:translate-y-0">
        <div className="flex items-start gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary"
            aria-hidden
          >
            {userInitials}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <textarea
              value={newPostText}
              onChange={(event) => {
                setNewPostText(event.target.value);
                if (composerMessage) {
                  setComposerMessage("");
                }
              }}
              placeholder="Share something with your church..."
              rows={3}
              className="w-full resize-y rounded-lg border border-border/70 bg-background/75 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-3 text-sm">
                <span className="text-xs text-muted-foreground">Post type</span>
                <select
                  value={newPostType}
                  onChange={(event) =>
                    setNewPostType(
                      event.target.value as
                        | "Update"
                        | "Testimony"
                        | "Prayer Request"
                        | "Announcement",
                    )
                  }
                  className="bg-transparent text-sm text-foreground outline-none"
                >
                  {availablePostTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                type="button"
                size="sm"
                className="h-9 rounded-lg px-4"
                onClick={handleCreatePost}
                disabled={isPostDisabled}
              >
                Post
              </Button>
            </div>

            {composerMessage ? (
              <p className="text-xs text-muted-foreground">{composerMessage}</p>
            ) : null}
          </div>
        </div>
      </div>

      {showFilters ? (
        <div className="rounded-xl border border-border/70 bg-card/70 p-2.5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.6)]">
          <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Feed filters
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { label: "All", value: "All" },
                { label: "Updates", value: "Update" },
                { label: "Testimonies", value: "Testimony" },
                { label: "Prayer", value: "Prayer Request" },
                { label: "Announcements", value: "Announcement" },
              ] as const
            ).map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs transition-[background-color,border-color,color,transform] duration-200 ease-out hover:-translate-y-[1px] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    isActive
                      ? "border-primary/40 bg-primary/12 text-foreground"
                      : "border-border/70 bg-background/60 text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {visiblePosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-background/45 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No posts in this view yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another filter or share the first encouragement with your church family.
          </p>
        </div>
      ) : null}

      {visiblePosts.map((post) => {
        const liked = Boolean(likedPostIds[post.id]);
        const isCommentsOpen = Boolean(openCommentsPostIds[post.id]);
        const likeCount = liked ? post.likes + 1 : post.likes;
        const commentCount = post.comments.length;

        return (
          <article
            key={post.id}
            className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 transition-[transform,border-color,box-shadow] duration-250 ease-out hover:-translate-y-[1px] hover:border-white/20 hover:shadow-[0_12px_28px_-20px_rgba(0,0,0,0.68)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{post.author}</p>
                <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {post.type}
                </span>
              </div>
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
                  "h-8 rounded-lg border-border/70 bg-background/80 text-xs transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/[0.11] hover:shadow-[0_10px_18px_-16px_rgba(0,0,0,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  liked &&
                    "border-primary/40 bg-primary/12 text-foreground shadow-[0_10px_20px_-16px_rgba(59,130,246,0.65)]",
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
                className="h-8 rounded-lg border-border/70 bg-background/80 text-xs transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out hover:-translate-y-[1px] hover:bg-white/[0.11] hover:shadow-[0_10px_18px_-16px_rgba(0,0,0,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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

      {showViewAllLink ? (
        <div className="pt-1 text-right">
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View All Feed
          </Link>
        </div>
      ) : null}
    </div>
  );
}
