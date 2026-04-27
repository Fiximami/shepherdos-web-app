import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminCommunityPage() {
  return (
    <AdminModulePage
      title="Community Feed Management"
      description="Moderate posts, announcements, testimonies, comments, and reported content with clarity and care."
      summary={[
        { label: "Pending Posts", value: "11", note: "Awaiting moderation decision before visibility" },
        { label: "Reported Posts", value: "3", note: "Flagged by members for review" },
        { label: "Official Announcements", value: "6", note: "Leadership-published feed highlights" },
      ]}
      panels={[
        {
          title: "Moderation queue",
          description: "Current feed review priorities.",
          items: [
            "Pending testimonies need category validation and tone review.",
            "Reported content requires action placeholder: keep, edit, or archive.",
            "Comment thread check for respectful engagement standards.",
          ],
        },
        {
          title: "Community integrity controls",
          description: "Governance placeholders for consistent oversight.",
          items: [
            "Moderation actions placeholder for warnings and visibility changes.",
            "Official announcements pinning workflow is active in preview mode.",
            "Escalation note placeholder available for pastoral review cases.",
          ],
        },
      ]}
    />
  );
}
