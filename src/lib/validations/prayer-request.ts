import { z } from "zod";

export const prayerRequestFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Add a short title for your request.")
    .max(120, "Title looks too long."),
  content: z
    .string()
    .trim()
    .min(10, "Share a bit more detail in your prayer request.")
    .max(2000, "Prayer request looks too long."),
});

export type PrayerRequestFormValues = z.infer<typeof prayerRequestFormSchema>;
