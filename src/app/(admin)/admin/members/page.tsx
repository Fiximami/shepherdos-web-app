"use client";

import { Download, Plus, Upload, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import {
  CreateMemberDialog,
  EditMemberDialog,
} from "@/components/admin/actions/member-action-dialogs";
import { ApiConnectionNotice } from "@/components/shared/api-connection-notice";
import { PreviewSectionNotice } from "@/components/shared/preview-section-notice";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/use-api-data";
import { pickSummaryValue } from "@/lib/api/formatters";
import { mapApiMember, type MemberRow } from "@/lib/api/mappers";
import { fetchMembers, fetchMembersSummary } from "@/lib/api/members";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type Segment = "All Members" | "First-Timers" | "New Converts" | "Workers" | "Inactive" | "Follow-up Needed";

const fallbackMembers: MemberRow[] = [];

const segments: Segment[] = ["All Members", "First-Timers", "New Converts", "Workers", "Inactive", "Follow-up Needed"];

const segmentToStatuses: Record<Exclude<Segment, "All Members">, MemberRow["status"][]> = {
  "First-Timers": ["First-Timer"],
  "New Converts": ["New Convert"],
  Workers: ["Worker"],
  Inactive: ["Inactive"],
  "Follow-up Needed": ["Follow-up Needed"],
};

const fallbackSummaryCards = [
  ["Total Members", "—"],
  ["First-Timers", "—"],
  ["New Converts", "—"],
  ["Workers / Volunteers", "—"],
  ["Needing Follow-up", "—"],
] as const;

export default function AdminMembersPage() {
  const canCreateMembers = hasPermission("members:create");
  const canUpdateMembers = hasPermission("members:update");
  const canManageMembers = hasAnyPermission(["members:create", "members:update"]);
  const [activeSegment, setActiveSegment] = useState<Segment>("All Members");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [ministryFilter, setMinistryFilter] = useState("All Ministries");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [feedback, setFeedback] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRow | null>(null);

  const membersQuery = useApiData(
    "admin-members",
    async () => {
      const rows = await fetchMembers();
      return Array.isArray(rows) ? rows.map(mapApiMember) : [];
    },
    fallbackMembers,
  );
  const summaryQuery = useApiData("admin-members-summary", fetchMembersSummary, {});

  const members = Array.isArray(membersQuery.data) ? membersQuery.data : fallbackMembers;
  const summaryCards = summaryQuery.isLive
    ? [
        ["Total Members", pickSummaryValue(summaryQuery.data, ["totalMembers", "total", "count"])],
        ["First-Timers", pickSummaryValue(summaryQuery.data, ["firstTimers", "firstTimerCount"])],
        ["New Converts", pickSummaryValue(summaryQuery.data, ["newConverts", "newConvertCount"])],
        ["Workers / Volunteers", pickSummaryValue(summaryQuery.data, ["workers", "workerCount", "volunteers"])],
        ["Needing Follow-up", pickSummaryValue(summaryQuery.data, ["followUpNeeded", "needingFollowUp"])],
      ]
    : fallbackSummaryCards;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((member) => {
      if (activeSegment !== "All Members") {
        const allowed = segmentToStatuses[activeSegment];
        if (!allowed.includes(member.status)) return false;
      }
      if (branchFilter !== "All Branches" && member.branch !== branchFilter) return false;
      if (ministryFilter !== "All Ministries" && member.ministry !== ministryFilter) return false;
      if (departmentFilter !== "All Departments" && member.department !== departmentFilter) return false;
      if (statusFilter !== "All Statuses" && member.status !== statusFilter) return false;
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.memberId.toLowerCase().includes(q) ||
        member.phone.toLowerCase().includes(q)
      );
    });
  }, [activeSegment, branchFilter, departmentFilter, members, ministryFilter, search, statusFilter]);

  return (
    <main className="space-y-5">
      <ApiConnectionNotice
        isLoading={membersQuery.isLoading || summaryQuery.isLoading}
        error={membersQuery.error ?? summaryQuery.error}
        isLive={membersQuery.isLive || summaryQuery.isLive}
        liveLabel="Showing live data from /members and /members/summary."
      />

      <AdminPageHeader
        title="Members Management"
        description="Organize people records with care, clarity, and pastoral visibility."
        actions={
          <>
            {canCreateMembers ? (
              <Button className="h-9 rounded-lg" onClick={() => setCreateOpen(true)}>
                <Plus className="size-4" aria-hidden />
                Add Member
              </Button>
            ) : null}
            {canUpdateMembers ? (
              <Button
                variant="outline"
                className="h-9 rounded-lg"
                onClick={() => setFeedback("Bulk import will be available when the import API is connected.")}
              >
                <Upload className="size-4" aria-hidden />
                Import Members
              </Button>
            ) : null}
            {canManageMembers ? (
              <Button
                variant="outline"
                className="h-9 rounded-lg"
                onClick={() => setFeedback("Export will be available when the export API is connected.")}
              >
                <Download className="size-4" aria-hidden />
                Export Records
              </Button>
            ) : null}
          </>
        }
      />

      {!canManageMembers ? (
        <p className="rounded-lg border border-white/10 bg-[#0c1524] px-3 py-2 text-xs text-slate-300">
          Member actions are hidden until `members:create` or `members:update` permission is granted.
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map(([label, value]) => (
          <AdminCard key={label} title={label} className="shepherd-fade-in">
            <p className="text-xl font-semibold text-white">{value}</p>
          </AdminCard>
        ))}
      </section>

      <AdminCard title="Member Segments" description="Focus quickly on the people group that needs attention most.">
        <div className="flex flex-wrap gap-2">
          {segments.map((segment) => (
            <button
              key={segment}
              type="button"
              onClick={() => setActiveSegment(segment)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                activeSegment === segment
                  ? "border-primary/35 bg-primary/12 text-white"
                  : "border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]",
              )}
            >
              {segment}
            </button>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Toolbar" description="Search and filter member records with clarity.">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, ID, or phone"
            className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-gray-400"
          />
          <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none">
            {["All Branches", "Main Campus", "North Branch", "South Branch", "East Branch"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={ministryFilter} onChange={(event) => setMinistryFilter(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none">
            {["All Ministries", "Hospitality", "Youth Group", "Choir", "Prayer Team", "Ushering", "None"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none">
            {["All Departments", "Choir", "Media Team", "Youth Ministry", "Prayer Team", "Ushering Team", "Unassigned"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#11263b] px-3 text-sm text-white outline-none">
            {["All Statuses", "Active", "First-Timer", "New Convert", "Worker", "Inactive", "Follow-up Needed"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </AdminCard>

      <AdminCard
        title="Members Table"
        description={
          membersQuery.isLive
            ? "People-centered records from /members."
            : "People-centered records — sign in to load /members."
        }
      >
        {!membersQuery.isLive ? (
          <PreviewSectionNotice message="No member rows loaded yet. Summary cards and table use /members when the API is available." />
        ) : null}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="bg-white/[0.06] text-gray-300">
              <tr>
                {["Name", "Member ID", "Phone", "Branch", "Group/Ministry", "Department", "Status", "Last Seen", "Actions"].map((header) => (
                  <th key={header} className="px-3 py-2 text-left font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-sm text-gray-400">
                    {membersQuery.isLive ? "No members match the current filters." : "Member records will appear here when /members loads."}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                <tr key={row.id} className="border-t border-white/10 bg-white/[0.03]">
                  <td className="px-3 py-2 text-white">{row.name}</td>
                  <td className="px-3 py-2 text-gray-300">{row.memberId}</td>
                  <td className="px-3 py-2 text-gray-300">{row.phone}</td>
                  <td className="px-3 py-2 text-gray-300">{row.branch}</td>
                  <td className="px-3 py-2 text-gray-300">{row.ministry}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-amber-100/90">{row.department}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-gray-200">{row.status}</span>
                  </td>
                  <td className="px-3 py-2 text-gray-300">{row.lastSeen}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(row);
                          setEditOpen(true);
                        }}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-gray-300 hover:bg-white/[0.08]"
                      >
                        Edit Member
                      </button>
                      {["Assign Ministry", "Mark Follow-up", "Change Status"].map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() =>
                            setFeedback(`${action} for ${row.name} — use Edit Member for status updates today.`)
                          }
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-gray-400 hover:bg-white/[0.08]"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {feedback ? <p className="mt-3 text-xs text-gray-400">{feedback}</p> : null}
      </AdminCard>

      <AdminCard title="Care Insight Panel" description="Warm pastoral cues to support timely and compassionate follow-up.">
        <div className="space-y-2">
          <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
            <UsersRound className="mr-2 inline size-4 text-amber-200/90" aria-hidden />
            12 members have missed three consecutive services.
          </p>
          <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300">
            <UsersRound className="mr-2 inline size-4 text-blue-200/90" aria-hidden />
            5 first-timers are awaiting follow-up.
          </p>
        </div>
      </AdminCard>

      <CreateMemberDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          void membersQuery.refetch();
          void summaryQuery.refetch();
        }}
      />
      <EditMemberDialog
        open={editOpen}
        member={selectedMember}
        onClose={() => {
          setEditOpen(false);
          setSelectedMember(null);
        }}
        onSuccess={() => {
          void membersQuery.refetch();
          void summaryQuery.refetch();
        }}
      />
    </main>
  );
}
