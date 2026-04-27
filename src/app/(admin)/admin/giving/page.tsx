import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminGivingPage() {
  return (
    <AdminModulePage
      title="Giving Management"
      description="Monitor member online giving, pledges, donation categories, receipts, and contribution history."
      summary={[
        { label: "Member Contributions", value: "GHS 128.4k", note: "Total online and recorded giving this month" },
        { label: "Pledges Tracked", value: "47", note: "Active pledge commitments with progress states" },
        { label: "Receipts Issued", value: "213", note: "Giving receipts generated in current period" },
      ]}
      panels={[
        {
          title: "Contribution monitoring",
          description: "Visibility into member-facing giving channels.",
          items: [
            "Track tithes, offerings, donations, welfare, and pledge contributions.",
            "Review category-level trends for stewardship communication planning.",
            "Validate member giving history entries and receipt status.",
          ],
        },
        {
          title: "Giving governance lane",
          description: "Operational controls distinct from full accounting module.",
          items: [
            "Receipt template placeholder for standardized member confirmations.",
            "Pledge progress placeholder for milestone tracking and reminders.",
            "Contribution exception queue for failed or duplicate entries.",
          ],
        },
      ]}
    />
  );
}
