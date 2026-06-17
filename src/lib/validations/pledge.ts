import { z } from "zod";

export const pledgeCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Add a short title for your pledge.")
    .max(120, "Title looks too long."),
  amount: z.coerce.number().positive("Enter a pledge amount greater than zero."),
  targetDate: z.string().min(1, "Choose a target date."),
});

export const pledgeProgressSchema = z.object({
  paidAmount: z.coerce.number().min(0, "Paid amount cannot be negative."),
});

export type PledgeCreateFormValues = z.infer<typeof pledgeCreateSchema>;
export type PledgeProgressFormValues = z.infer<typeof pledgeProgressSchema>;
