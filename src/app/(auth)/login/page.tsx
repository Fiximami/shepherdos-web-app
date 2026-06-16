import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/login-screen";
import { getProductName, getProductTagline } from "@/lib/config/product";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${getProductName()} — ${getProductTagline()}`,
};

export default function LoginPage() {
  return <LoginScreen />;
}
