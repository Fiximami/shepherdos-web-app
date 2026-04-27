import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminMembersPage() {
  return (
    <AdminModulePage
      title="Members"
      description="Manage member records, first-timers, new converts, workers, groups, and follow-up visibility."
      summary={[
        { label: "Total Members", value: "1,248", note: "Across all active branches" },
        { label: "First-Timers", value: "32", note: "Awaiting integration follow-up" },
        { label: "Workers", value: "286", note: "Serving in active ministry teams" },
      ]}
      panels={[
        {
          title: "People management lane",
          description: "Current administrative checkpoints for member records.",
          items: [
            "Validate new convert records and assign discipleship tracks.",
            "Confirm workers with incomplete profile status before roster publishing.",
            "Update group assignments for members who changed branch attendance.",
          ],
        },
        {
          title: "Follow-up visibility",
          description: "Priority care items requiring structured response.",
          items: [
            "12 first-timers have no assigned care leader yet.",
            "8 inactive members flagged for pastoral contact this week.",
            "4 profile cases require leadership verification before activation.",
          ],
        },
      ]}
    />
  );
}
