import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminCommunicationPage() {
  return (
    <AdminModulePage
      title="Communication"
      description="Manage official announcements, broadcasts, reminders, scheduled messages, and communication logs."
      summary={[
        { label: "Active Announcements", value: "9", note: "Visible church-wide and branch-specific notices" },
        { label: "Scheduled Messages", value: "14", note: "Queued for upcoming ministry and service reminders" },
        { label: "Unread Notices", value: "63", note: "Member notices pending acknowledgment" },
      ]}
      panels={[
        {
          title: "Official communication lane",
          description: "Current output channels and readiness checks.",
          items: [
            "Sunday service reminder templates ready for scheduled dispatch.",
            "Midweek prayer updates queued for branch-specific recipients.",
            "Leadership bulletin draft requires final pastoral review.",
          ],
        },
        {
          title: "Communication logs",
          description: "Delivery and engagement visibility for accountability.",
          items: [
            "Broadcast logs capture send time, target roles, and open rates.",
            "Two scheduled reminders failed dry-run due to missing placeholders.",
            "Announcement archive placeholder retains approved official records.",
          ],
        },
      ]}
    />
  );
}
