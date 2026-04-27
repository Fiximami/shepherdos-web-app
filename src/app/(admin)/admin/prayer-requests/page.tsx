import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminPrayerRequestsPage() {
  return (
    <AdminModulePage
      title="Prayer Requests Management"
      description="View requests, assign care teams, track responses, protect privacy, and monitor pastoral follow-up."
      summary={[
        { label: "Open Requests", value: "39", note: "Active requests currently visible in care flow" },
        { label: "Unassigned", value: "9", note: "Awaiting team or leader ownership" },
        { label: "Privacy Sensitive", value: "12", note: "Restricted visibility requests requiring careful handling" },
      ]}
      panels={[
        {
          title: "Pastoral care workflow",
          description: "Prayer response operations for timely support.",
          items: [
            "Assign unowned requests to care leaders before next service cycle.",
            "Mark response status for requests already acknowledged in prayer teams.",
            "Escalate urgent requests to pastoral office with confidentiality tags.",
          ],
        },
        {
          title: "Privacy and follow-up controls",
          description: "Guardrails for safe handling of sensitive needs.",
          items: [
            "Visibility policy enforces private, leaders-only, and community scopes.",
            "Care assignment log placeholder tracks who viewed and responded.",
            "Follow-up timeline placeholder identifies overdue pastoral responses.",
          ],
        },
      ]}
    />
  );
}
