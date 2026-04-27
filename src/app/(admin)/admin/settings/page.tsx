import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminSettingsPage() {
  return (
    <AdminModulePage
      title="System Settings"
      description="Manage church profile, branding, permissions, branches, departments, service times, and workspace controls."
      summary={[
        { label: "Branches", value: "4", note: "Configured branch workspaces in preview" },
        { label: "Roles", value: "8", note: "Leadership and member role profiles" },
        { label: "Departments", value: "12", note: "Operational ministry departments tracked" },
      ]}
      panels={[
        {
          title: "Workspace governance",
          description: "Foundational controls for a healthy and clear operating environment.",
          items: [
            "Church profile and branding settings for consistent identity.",
            "Roles and permissions mapping for accountable access control.",
            "Department and branch structure management placeholders.",
          ],
        },
        {
          title: "Operational configuration",
          description: "Coordination settings for recurring church rhythms.",
          items: [
            "Service times placeholder for scheduling and reminders.",
            "Notification and communication defaults by role and branch.",
            "System preference placeholders for language and locale behavior.",
          ],
        },
      ]}
    />
  );
}
