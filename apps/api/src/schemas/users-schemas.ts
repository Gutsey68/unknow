import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.url().nullable().optional(),
  heightCm: z.number().int().positive().nullable().optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateUserSchema = userSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial()
  .strict();

export type User = z.infer<typeof userSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
