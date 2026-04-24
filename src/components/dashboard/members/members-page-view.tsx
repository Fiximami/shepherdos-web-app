"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/layout/page-header";
import {
  MembersExportButton,
  MembersSearchInput,
  MembersSelectFilter,
} from "@/components/dashboard/members/members-toolbar-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MemberTab = "All Members" | "First Timers" | "New Converts" | "Workers";

type MemberStatus = "Active" | "Pending Follow-up" | "Inactive";

type MemberRecord = {
  fullName: string;
  memberId: string;
  phone: string;
  branch: string;
  ministry: string;
  status: MemberStatus;
  joinedDate: string;
  type: Exclude<MemberTab, "All Members"> | "Established";
};

const filterTabs: readonly MemberTab[] = [
  "All Members",
  "First Timers",
  "New Converts",
  "Workers",
];

const membersData: MemberRecord[] = [
  {
    fullName: "Ruth Eze",
    memberId: "SHP-1041",
    phone: "+234 803 211 7789",
    branch: "Main Campus",
    ministry: "Ushering",
    status: "Active",
    joinedDate: "2025-02-11",
    type: "Workers",
  },
  {
    fullName: "Samuel Okoro",
    memberId: "SHP-1097",
    phone: "+234 806 998 4401",
    branch: "North Branch",
    ministry: "Youth",
    status: "Pending Follow-up",
    joinedDate: "2026-04-03",
    type: "First Timers",
  },
  {
    fullName: "Grace Nwosu",
    memberId: "SHP-0982",
    phone: "+234 802 441 8822",
    branch: "Main Campus",
    ministry: "Choir",
    status: "Active",
    joinedDate: "2024-08-19",
    type: "Established",
  },
  {
    fullName: "David Aina",
    memberId: "SHP-1136",
    phone: "+234 809 522 0145",
    branch: "South Branch",
    ministry: "Follow-up",
    status: "Active",
    joinedDate: "2026-03-12",
    type: "New Converts",
  },
  {
    fullName: "Deborah Afolabi",
    memberId: "SHP-1108",
    phone: "+234 813 774 9920",
    branch: "Main Campus",
    ministry: "Children",
    status: "Pending Follow-up",
    joinedDate: "2026-02-26",
    type: "Workers",
  },
  {
    fullName: "Moses Bassey",
    memberId: "SHP-0951",
    phone: "+234 816 300 5587",
    branch: "North Branch",
    ministry: "Media",
    status: "Inactive",
    joinedDate: "2024-06-01",
    type: "Established",
  },
];

const branchOptions = ["All Branches", "Main Campus", "North Branch", "South Branch"] as const;
const ministryOptions = ["All Ministries", "Ushering", "Youth", "Choir", "Follow-up", "Children", "Media"] as const;
const statusOptions = ["All Statuses", "Active", "Pending Follow-up", "Inactive"] as const;

const columns: ColumnDef<MemberRecord>[] = [
  { header: "Full Name", accessorKey: "fullName" },
  { header: "Member ID", accessorKey: "memberId" },
  { header: "Phone", accessorKey: "phone" },
  { header: "Branch", accessorKey: "branch" },
  { header: "Ministry", accessorKey: "ministry" },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
            status === "Active" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            status === "Pending Follow-up" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
            status === "Inactive" && "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
          )}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Joined Date",
    accessorKey: "joinedDate",
    cell: ({ row }) => {
      return new Date(row.original.joinedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: () => (
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg border border-border/70 bg-background/70 px-2 py-1 text-xs text-muted-foreground">
          Actions
        </summary>
        <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-border/70 bg-card p-1 shadow-lg">
          {["View Profile", "Edit Member", "Mark Follow-up", "Assign Ministry"].map((item) => (
            <button
              key={item}
              type="button"
              className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-foreground hover:bg-muted/60"
            >
              {item}
            </button>
          ))}
        </div>
      </details>
    ),
  },
];

export function MembersPageView() {
  const [activeTab, setActiveTab] = useState<MemberTab>("All Members");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState<string>(branchOptions[0]);
  const [ministry, setMinistry] = useState<string>(ministryOptions[0]);
  const [status, setStatus] = useState<string>(statusOptions[0]);

  const filteredMembers = useMemo(() => {
    return membersData.filter((member) => {
      const tabMatch = activeTab === "All Members" ? true : member.type === activeTab;
      const searchMatch =
        member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        member.memberId.toLowerCase().includes(search.toLowerCase()) ||
        member.phone.toLowerCase().includes(search.toLowerCase());
      const branchMatch = branch === "All Branches" ? true : member.branch === branch;
      const ministryMatch = ministry === "All Ministries" ? true : member.ministry === ministry;
      const statusMatch = status === "All Statuses" ? true : member.status === status;
      return tabMatch && searchMatch && branchMatch && ministryMatch && statusMatch;
    });
  }, [activeTab, branch, ministry, search, status]);

  // TanStack Table intentionally exposes imperative helpers from this hook.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Members"
        description="Manage church membership records, follow-up visibility, and people data with clarity."
        actions={
          <Button className="h-10 rounded-xl">
            <Plus className="size-4" aria-hidden />
            Add Member
          </Button>
        }
      />

      <section className="mb-4 flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              activeTab === tab
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border/70 bg-background/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className="mb-4 grid gap-2 rounded-2xl border border-border/70 bg-card/60 p-3 md:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))_auto]">
        <MembersSearchInput value={search} onChange={setSearch} />
        <MembersSelectFilter
          label="Branch"
          value={branch}
          onChange={setBranch}
          options={branchOptions}
        />
        <MembersSelectFilter
          label="Ministry"
          value={ministry}
          onChange={setMinistry}
          options={ministryOptions}
        />
        <MembersSelectFilter
          label="Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
        <MembersExportButton />
      </section>

      <section>
        <Card className="border-border/70 bg-card/80 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Members Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            {table.getRowModel().rows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 bg-background/65 p-8 text-center">
                <p className="text-sm font-medium text-foreground">No members found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters to continue caring for the right people.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <table className="w-full min-w-[960px] border-collapse text-sm">
                  <thead className="bg-muted/40">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-3 py-2.5 text-left font-medium text-muted-foreground"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t border-border/60 bg-background/55">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2.5 align-top text-foreground">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </main>
  );
}
