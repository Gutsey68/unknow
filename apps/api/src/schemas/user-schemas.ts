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

export const registerSchema = userSchema
  .omit({
    id: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    callbackURL: z.url().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();
