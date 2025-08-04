import z from "zod";
import { userSchema } from "./users-schemas";

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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

export const loginSchema = userSchema
  .omit({
    id: true,
    name: true,
    emailVerified: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(6),
    rememberMe: z.boolean().optional(),
  })
  .strict();
