import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminEventsPage() {
  return (
    <AdminModulePage
      title="Events Management"
      description="Create, approve, manage, and track church events, registrations, attendance, and event communication."
      summary={[
        { label: "Upcoming Events", value: "18", note: "Across all branches and ministries" },
        { label: "Open Registrations", value: "7", note: "Events currently accepting member sign-ups" },
        { label: "Pending Approvals", value: "4", note: "Event proposals awaiting leadership review" },
      ]}
      panels={[
        {
          title: "Event operations workflow",
          description: "From proposal to execution with clear governance.",
          items: [
            "Review new event drafts before publishing to member portal.",
            "Verify registration limits and volunteer team assignments.",
            "Attach communication plans for each high-impact gathering.",
          ],
        },
        {
          title: "Post-event management",
          description: "Follow-through checkpoints after each gathering.",
          items: [
            "Attendance reconciliation pending for two outreach events.",
            "Feedback log placeholder open for ministry debrief capture.",
            "Event communication archive keeps approved event notices searchable.",
          ],
        },
      ]}
    />
  );
}
