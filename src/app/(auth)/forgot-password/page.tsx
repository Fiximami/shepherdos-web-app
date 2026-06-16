import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/components/auth/forgot-password-screen";
import { getProductName } from "@/lib/config/product";

export const metadata: Metadata = {
  title: "Forgot password",
  description: `Request a secure link to reset your ${getProductName()} password.`,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
