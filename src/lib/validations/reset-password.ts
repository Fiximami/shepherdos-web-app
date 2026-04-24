import { z } from "zod";

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters for your new password."),
    confirmPassword: z
      .string()
      .min(1, "Enter your new password again to confirm."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Both entries should match exactly.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
