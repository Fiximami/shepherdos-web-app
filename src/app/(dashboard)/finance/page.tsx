import { redirect } from "next/navigation";

import { routes } from "@/lib/constants/navigation";

export default function FinancePage() {
  redirect(routes.app.giving);
}
