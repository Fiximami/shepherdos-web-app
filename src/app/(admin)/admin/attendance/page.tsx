import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminAttendancePage() {
  return (
    <AdminModulePage
      title="Attendance"
      description="Record services, monitor trends, identify absentees, and surface members needing follow-up."
      summary={[
        { label: "Today", value: "912", note: "Current attendance total across services" },
        { label: "This Week", value: "3,441", note: "Cumulative branch attendance" },
        { label: "Follow-up List", value: "27", note: "Members needing attendance-based care outreach" },
      ]}
      panels={[
        {
          title: "Attendance operations",
          description: "Core execution points for service attendance management.",
          items: [
            "Finalize Sunday record reconciliation before Monday noon.",
            "Review first-time guest attendance and connect with members module.",
            "Validate branch submissions with missing service metadata.",
          ],
        },
        {
          title: "Trend and absence intelligence",
          description: "Insights for early pastoral intervention.",
          items: [
            "Three-week decline detected in one midweek service segment.",
            "Absentee list overlaps with open prayer requests for 9 members.",
            "Youth attendance rose after latest community outreach campaign.",
          ],
        },
      ]}
    />
  );
}
