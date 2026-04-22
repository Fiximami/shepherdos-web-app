import { redirect } from "next/navigation";

import { routes } from "@/lib/constants/navigation";

export default function Home() {
  redirect(routes.auth.login);
}
