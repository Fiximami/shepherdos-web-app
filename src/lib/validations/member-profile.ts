import { z } from "zod";

export const memberProfileFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number.")
    .max(30, "Phone number looks too long."),
  address: z
    .string()
    .trim()
    .min(3, "Enter your address.")
    .max(200, "Address looks too long."),
  dateOfBirth: z
    .string()
    .min(1, "Select your date of birth.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date of birth."),
});

export type MemberProfileFormValues = z.infer<typeof memberProfileFormSchema>;
