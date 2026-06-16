import type { Metadata } from "next";

import { ResetPasswordScreen } from "@/components/auth/reset-password-screen";
import { getProductName } from "@/lib/config/product";

export const metadata: Metadata = {
  title: "Reset password",
  description: `Create a new password to restore secure access to your ${getProductName()} workspace.`,
};

export default function ResetPasswordPage() {
  return <ResetPasswordScreen />;
}
