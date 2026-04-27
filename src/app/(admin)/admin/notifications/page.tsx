import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminNotificationsPage() {
  return (
    <AdminModulePage
      title="Notifications Management"
      description="Manage templates, scheduled reminders, unread notices, and role-based alert delivery."
      summary={[
        { label: "Active Templates", value: "15", note: "Announcement, event, prayer, and giving templates" },
        { label: "Scheduled Reminders", value: "22", note: "Pending push and in-app reminder jobs" },
        { label: "Unread Notices", value: "63", note: "Member unread count across active notices" },
      ]}
      panels={[
        {
          title: "Notification operations",
          description: "Lifecycle control for alerts and reminders.",
          items: [
            "Review and publish approved templates before schedule windows.",
            "Validate role-based target routing for leadership and members.",
            "Track unread trends and resurface urgent community notices.",
          ],
        },
        {
          title: "Scheduling and reliability",
          description: "Queue and fallback placeholders for dependable delivery.",
          items: [
            "Schedule queue placeholder with run-time and channel preview.",
            "Notification retry placeholder for failed deliveries.",
            "Archive and retention placeholder for historic audit review.",
          ],
        },
      ]}
    />
  );
}
