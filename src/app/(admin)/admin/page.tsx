import type { Metadata } from "next";

import { AdminWorkspaceView } from "@/components/dashboard/admin/admin-workspace-view";

export const metadata: Metadata = {
  title: "Leadership Console · ShepherdOS",
  description:
    "Controlled leadership workspace for members, attendance, finance, communication, and reports.",
};

export default function AdminPage() {
  return <AdminWorkspaceView />;
}
