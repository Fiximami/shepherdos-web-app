import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password."),
  churchSlug: z
    .string()
    .min(2, "Enter your church code.")
    .max(80, "Church code looks too long."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
