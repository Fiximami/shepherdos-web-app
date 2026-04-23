import type { Metadata } from "next";

import { ForgotPasswordScreen } from "@/components/auth/forgot-password-screen";

export const metadata: Metadata = {
  title: "Forgot password · ShepherdOS",
  description:
    "Request a secure link to reset your ShepherdOS password and return to your church workspace.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
