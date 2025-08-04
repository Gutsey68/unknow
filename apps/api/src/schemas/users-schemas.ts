import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.url().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
