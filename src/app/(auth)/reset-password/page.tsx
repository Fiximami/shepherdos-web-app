import type { Metadata } from "next";

import { ResetPasswordScreen } from "@/components/auth/reset-password-screen";

export const metadata: Metadata = {
  title: "Reset password · ShepherdOS",
  description:
    "Create a new password to restore secure access to your ShepherdOS church workspace.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordScreen />;
}
