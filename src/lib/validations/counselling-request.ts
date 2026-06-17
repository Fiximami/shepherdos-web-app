import { z } from "zod";

export const counsellingCategories = [
  "Marriage / Relationship",
  "Family",
  "Spiritual Guidance",
  "Personal Support",
  "Youth / Career",
  "Grief / Bereavement",
  "Other",
] as const;

export const counsellingRequestFormSchema = z.object({
  category: z.enum(counsellingCategories, {
    error: "Select a counselling category.",
  }),
  title: z
    .string()
    .trim()
    .min(3, "Add a short title for your request.")
    .max(120, "Title looks too long."),
  description: z
    .string()
    .trim()
    .min(10, "Share a bit more context for the care team.")
    .max(2000, "Description looks too long."),
});

export type CounsellingRequestFormValues = z.infer<typeof counsellingRequestFormSchema>;
