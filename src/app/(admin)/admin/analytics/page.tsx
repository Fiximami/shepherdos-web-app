import { AdminModulePage } from "@/components/admin/shared/admin-module-page";

export default function AdminAnalyticsPage() {
  return (
    <AdminModulePage
      title="Analytics"
      description="Insights for attendance, giving, engagement, follow-up outcomes, growth, and ministry activity."
      summary={[
        { label: "Attendance Trend", value: "+3.1%", note: "Monthly growth in aggregate participation" },
        { label: "Giving Trend", value: "+7.1%", note: "Month-over-month stewardship movement" },
        { label: "Engagement Index", value: "78/100", note: "Composite score from ministry activity signals" },
      ]}
      panels={[
        {
          title: "Insight domains",
          description: "Primary analytics lanes for leadership planning.",
          items: [
            "Attendance and giving trajectories compared across branches.",
            "Follow-up response rates by care team and request category.",
            "Ministry activity trendline with engagement variance alerts.",
          ],
        },
        {
          title: "Decision support placeholders",
          description: "Future-ready analytical controls and outputs.",
          items: [
            "KPI threshold placeholder for automated leadership alerts.",
            "Segment explorer placeholder by role, branch, and ministry.",
            "Forecasting placeholder for seasonal planning and staffing.",
          ],
        },
      ]}
    />
  );
}
