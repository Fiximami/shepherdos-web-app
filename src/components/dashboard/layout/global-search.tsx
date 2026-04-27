"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type SearchRecord = {
  id: string;
  type: "Members" | "Groups" | "Events" | "Finance" | "Announcements";
  title: string;
  subtitle: string;
};

const searchableRecords: SearchRecord[] = [
  { id: "m-1", type: "Members", title: "Ruth Eze", subtitle: "Main Campus · Ushering" },
  { id: "m-2", type: "Members", title: "Samuel Okoro", subtitle: "North Branch · Youth" },
  { id: "g-1", type: "Groups", title: "Young Adults Connect", subtitle: "Weekly · Fridays" },
  { id: "g-2", type: "Groups", title: "Prayer & Care Team", subtitle: "Midweek coverage" },
  { id: "e-1", type: "Events", title: "Community Outreach Walk", subtitle: "Sat · South Branch" },
  { id: "e-2", type: "Events", title: "Leaders Training Session", subtitle: "Thu · Main Campus" },
  { id: "f-1", type: "Finance", title: "TXN-24102 · Donation", subtitle: "₦75,000 · Cleared" },
  { id: "f-2", type: "Finance", title: "APR-118 · Welfare Approval", subtitle: "Pending sign-off" },
  {
    id: "a-1",
    type: "Announcements",
    title: "Youth retreat payment reminder",
    subtitle: "Sent yesterday",
  },
  {
    id: "a-2",
    type: "Announcements",
    title: "Midweek prayer room assignment",
    subtitle: "Posted 3 days ago",
  },
];

export function GlobalSearch({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }
    return searchableRecords.filter(
      (record) =>
        record.title.toLowerCase().includes(q) || record.subtitle.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    return filteredResults.reduce<Record<string, SearchRecord[]>>((acc, row) => {
      if (!acc[row.type]) {
        acc[row.type] = [];
      }
      acc[row.type].push(row);
      return acc;
    }, {});
  }, [filteredResults]);

  const hasQuery = query.trim().length > 0;
  const showPanel = isOpen && hasQuery;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleSelect(title: string) {
    setFeedback(`"${title}" is ready for navigation.`);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-xl", className)}>
      <div className="group flex h-10 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 text-sm text-gray-400 transition-[border-color,background-color,box-shadow] duration-250 ease-out focus-within:border-primary/45 focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="size-4" aria-hidden />
        <input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setFeedback("");
            setIsOpen(true);
            setActiveIndex(nextQuery.trim().length > 0 ? 0 : -1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (!showPanel) {
              return;
            }

            if (event.key === "Escape") {
              setIsOpen(false);
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((prev) => Math.max(prev - 1, 0));
              return;
            }

            if (event.key === "Enter" && activeIndex >= 0 && filteredResults[activeIndex]) {
              event.preventDefault();
              handleSelect(filteredResults[activeIndex].title);
            }
          }}
          placeholder="Search people, groups, events, records..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
          aria-label="Global search"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          role="combobox"
        />
      </div>

      {showPanel ? (
        <div
          id="global-search-results"
          className="absolute right-0 z-40 mt-2 max-h-[24rem] w-full overflow-auto rounded-xl border border-white/10 bg-[#102338]/95 p-2 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          role="listbox"
        >
          {filteredResults.length === 0 ? (
            <div className="rounded-lg px-3 py-3 text-sm text-gray-400">
              No matching records found.
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2 last:mb-0">
                <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  {group}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const resultIndex = filteredResults.findIndex((entry) => entry.id === item.id);
                    const isActive = resultIndex === activeIndex;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(resultIndex)}
                        onClick={() => handleSelect(item.title)}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left transition-colors",
                          isActive ? "bg-white/[0.12]" : "hover:bg-white/[0.08]",
                        )}
                        role="option"
                        aria-selected={isActive}
                      >
                        <p className="text-sm text-white">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {feedback ? (
            <p className="mt-1 rounded-lg bg-white/[0.05] px-3 py-2 text-xs text-gray-300">{feedback}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
