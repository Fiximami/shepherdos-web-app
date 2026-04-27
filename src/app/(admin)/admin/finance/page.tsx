import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminFinancePage() {
  return (
    <AdminModulePage
      title="Finance"
      description="Serious accounting, auditing, and stewardship oversight for church income, expenses, reconciliations, approvals, and statutory reporting."
      summary={[
        { label: "Income This Month", value: "GHS 128.4k", note: "Tithes, offerings, donations, pledges, and welfare inflows" },
        { label: "Expenses This Month", value: "GHS 81.6k", note: "Operational and ministry expenditures under review" },
        { label: "Open Approvals", value: "6", note: "Awaiting workflow completion and signatures" },
      ]}
      panels={[
        {
          title: "Accounting and stewardship ledger",
          description: "Core financial categories and controls in active monitoring.",
          items: [
            "Tithes register is reconciled for all recorded branch submissions.",
            "Offerings and donations channel mapping updated for this week.",
            "Pledges schedule placeholder is active for commitment tracking.",
            "Welfare and petty cash ledgers are isolated for accountability.",
          ],
        },
        {
          title: "Control and compliance workflow",
          description: "Audit-ready checks for transparency and trust.",
          items: [
            "Bank reconciliation placeholder queued for monthly close procedure.",
            "Approval workflow placeholder tracks reviewer and final sign-off.",
            "Audit trail placeholder captures action history and edit stamps.",
            "Receipt verification queue identifies documents pending validation.",
          ],
        },
        {
          title: "Financial reporting suite",
          description: "Reporting placeholders for leadership and governance review.",
          items: [
            "Financial reports placeholder for monthly and quarterly packs.",
            "Income and expenditure statement placeholder for stewardship review.",
            "Balance sheet placeholder for assets, liabilities, and equity positioning.",
            "Cash flow placeholder for operating, investing, and financing movement.",
          ],
        },
      ]}
    />
  );
}
