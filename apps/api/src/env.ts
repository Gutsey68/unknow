import { config } from "dotenv";
import { resolve } from "path";
import { z } from "zod";

config({
  path: resolve(process.cwd(), ".env"),
});

const EnvSchema = z.object({
  BUN_ENV: z.string(),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FRONTEND_URL: z.url(),
  API_URL: z.url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid environment variables:");
  console.error(z.treeifyError(error));
  process.exit(1);
}

export default env!;
