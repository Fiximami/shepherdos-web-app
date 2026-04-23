import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Sign in · ShepherdOS",
  description:
    "Sign in to ShepherdOS to manage members, attendance, finances, and church communication with clarity.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
