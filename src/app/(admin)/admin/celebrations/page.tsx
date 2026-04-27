import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminCelebrationsPage() {
  return (
    <AdminModulePage
      title="Celebrations Management"
      description="Manage birthdays, anniversaries, milestones, greetings automation, and celebration visibility."
      summary={[
        { label: "Upcoming Birthdays", value: "26", note: "Within the next 14 days" },
        { label: "Anniversaries", value: "9", note: "Member and ministry service anniversaries" },
        { label: "Scheduled Greetings", value: "31", note: "Auto-message placeholders queued" },
      ]}
      panels={[
        {
          title: "Celebration planning lane",
          description: "Editorial and visibility controls for celebration content.",
          items: [
            "Confirm member birthday visibility settings before publishing.",
            "Review anniversary milestone wording for pastoral tone consistency.",
            "Queue celebration highlights for community feed and notifications.",
          ],
        },
        {
          title: "Automation placeholders",
          description: "Future workflow hooks for greetings and visibility timing.",
          items: [
            "Automated greetings placeholder for birthdays and anniversaries.",
            "Celebration audience scope placeholder by branch and ministry.",
            "Approval checkpoint placeholder for official milestone spotlights.",
          ],
        },
      ]}
    />
  );
}
