import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminReportsPage() {
  return (
    <AdminModulePage
      title="Reports"
      description="Generate leadership reports across attendance, finance, membership, giving, events, and pastoral care."
      summary={[
        { label: "Report Templates", value: "12", note: "Available leadership-ready reporting packs" },
        { label: "Scheduled Exports", value: "5", note: "Automated weekly and monthly dispatch placeholders" },
        { label: "Pending Reviews", value: "4", note: "Draft reports awaiting leadership sign-off" },
      ]}
      panels={[
        {
          title: "Reporting catalogue",
          description: "Core outputs required for governance and ministry planning.",
          items: [
            "Attendance report for service and branch participation rhythm.",
            "Finance and giving report for stewardship and audit review.",
            "Membership report for growth, first-timers, and follow-up coverage.",
            "Events and prayer requests report for care and engagement outcomes.",
          ],
        },
        {
          title: "Workflow placeholders",
          description: "Controls for reliable report generation and distribution.",
          items: [
            "Report builder placeholder with date and scope filters.",
            "Export queue placeholder for PDF and spreadsheet output.",
            "Approval chain placeholder before board-level circulation.",
          ],
        },
      ]}
    />
  );
}
