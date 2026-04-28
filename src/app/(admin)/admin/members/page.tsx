"use client";

import { Download, Plus, Upload, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminCard } from "@/components/admin/shared/admin-card";
import { AdminPageHeader } from "@/components/admin/shared/admin-page-header";
import { Button } from "@/components/ui/button";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type Segment = "All Members" | "First-Timers" | "New Converts" | "Workers" | "Inactive" | "Follow-up Needed";

type MemberRow = {
  id: string;
  name: string;
  memberId: string;
  phone: string;
  branch: string;
  ministry: string;
  department: string;
  status: "Active" | "First-Timer" | "New Convert" | "Worker" | "Inactive" | "Follow-up Needed";
  lastSeen: string;
};

const members: MemberRow[] = [
  { id: "m-1", name: "Ruth Eze", memberId: "SHP-1044", phone: "+233 24 551 1022", branch: "Main Campus", ministry: "Hospitality", department: "Ushering Team", status: "Worker", lastSeen: "Sun, Apr 27" },
  { id: "m-2", name: "Samuel Okoro", memberId: "SHP-1172", phone: "+233 20 831 0031", branch: "North Branch", ministry: "Youth Group", department: "Youth Ministry", status: "Active", lastSeen: "Sun, Apr 27" },
  { id: "m-3", name: "Miriam Osei", memberId: "SHP-1205", phone: "+233 24 190 5532", branch: "Main Campus", ministry: "Choir", department: "Choir", status: "Follow-up Needed", lastSeen: "3 weeks ago" },
  { id: "m-4", name: "Daniel Kwarteng", memberId: "SHP-1228", phone: "+233 54 665 2211", branch: "South Branch", ministry: "None", department: "Unassigned", status: "First-Timer", lastSeen: "Sun, Apr 27" },
  { id: "m-5", name: "Deborah Afolabi", memberId: "SHP-1253", phone: "+233 50 116 9402", branch: "Main Campus", ministry: "Prayer Team", department: "Prayer Team", status: "New Convert", lastSeen: "Wed, Apr 24" },
  { id: "m-6", name: "Moses Bassey", memberId: "SHP-1021", phone: "+233 24 210 4450", branch: "East Branch", ministry: "Ushering", department: "Ushering Team", status: "Inactive", lastSeen: "4 weeks ago" },
];

const segments: Segment[] = ["All Members", "First-Timers", "New Converts", "Workers", "Inactive", "Follow-up Needed"];

const segmentToStatuses: Record<Exclude<Segment, "All Members">, MemberRow["status"][]> = {
  "First-Timers": ["First-Timer"],
  "New Converts": ["New Convert"],
  Workers: ["Worker"],
  Inactive: ["Inactive"],
  "Follow-up Needed": ["Follow-up Needed"],
};

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
  }, [activeSegment, branchFilter, departmentFilter, ministryFilter, search, statusFilter]);

  return (
    <main className="space-y-5">
      <AdminPageHeader
        title="Members Management"
        description="Organize people records with care, clarity, and pastoral visibility."
        actions={
          <>
            {canCreateMembers ? (
              <Button className="h-9 rounded-lg">
                <Plus className="size-4" aria-hidden />
                Add Member
              </Button>
            ) : null}
            {canUpdateMembers ? (
              <Button variant="outline" className="h-9 rounded-lg">
                <Upload className="size-4" aria-hidden />
                Import Members
              </Button>
            ) : null}
            {canManageMembers ? (
              <Button variant="outline" className="h-9 rounded-lg">
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
        {[
          ["Total Members", "1,248"],
          ["First-Timers", "32"],
          ["New Converts", "14"],
          ["Workers / Volunteers", "286"],
          ["Needing Follow-up", "47"],
        ].map(([label, value]) => (
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

      <AdminCard title="Members Table" description="People-centered records with action placeholders for leadership operations.">
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
              {filtered.map((row) => (
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
                      {["View Profile", "Edit Member", "Assign Ministry", "Mark Follow-up", "Change Status"].map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => setFeedback(`${action} for ${row.name} is a placeholder in this preview.`)}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-gray-300 hover:bg-white/[0.08]"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
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
    </main>
  );
}
