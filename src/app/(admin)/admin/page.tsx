import type { Metadata } from "next";

import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export const metadata: Metadata = {
  title: "Leadership Console · ShepherdOS",
  description:
    "Controlled leadership workspace for members, attendance, finance, communication, and reports.",
};

export default function AdminPage() {
  return (
    <AdminModulePage
      title="Overview"
      description="Leadership command center for church-wide visibility across people care, stewardship, attendance rhythm, and action priorities."
      summary={[
        { label: "Care Alerts", value: "18", note: "Follow-up and prayer responses needing attention" },
        { label: "Attendance Rhythm", value: "Stable", note: "Consistent participation across major services" },
        { label: "Finance Highlights", value: "GHS 128.4k", note: "Giving this month with pending reviews in queue" },
      ]}
      panels={[
        {
          title: "Action priorities",
          description: "Immediate leadership focus points for this week.",
          items: [
            "Review first-timers awaiting care assignment before Tuesday evening.",
            "Approve two pending welfare disbursements after receipt verification.",
            "Confirm communication schedule for youth retreat and midweek prayer reminders.",
          ],
        },
        {
          title: "Care and engagement watch",
          description: "Community indicators to keep visible in pastoral planning.",
          items: [
            "27 members have missed 3 consecutive weeks and should receive gentle outreach.",
            "9 prayer requests are open with no pastoral response logged yet.",
            "Community feed shows increased testimony participation after outreach weekend.",
          ],
        },
        {
          title: "Operational cadence",
          description: "Current coordination checkpoints across ministry teams.",
          items: [
            "Attendance record window closes 30 minutes after each service.",
            "Finance reconciliation placeholder is due for monthly close review.",
            "Reports package draft is ready for leadership review meeting.",
          ],
        },
      ]}
    />
  );
}
