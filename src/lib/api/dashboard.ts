import { fetchAttendanceSummary } from "@/lib/api/attendance";
import { fetchFinanceSummary } from "@/lib/api/finance";
import { fetchMembersSummary } from "@/lib/api/members";

export type LeadershipDashboardSummary = {
  members: Record<string, unknown>;
  attendance: Record<string, unknown>;
  finance: Record<string, unknown>;
};

export async function fetchLeadershipDashboardSummary(): Promise<LeadershipDashboardSummary> {
  const [members, attendance, finance] = await Promise.all([
    fetchMembersSummary(),
    fetchAttendanceSummary(),
    fetchFinanceSummary(),
  ]);

  return { members, attendance, finance };
}
