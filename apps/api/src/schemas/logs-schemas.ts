import z from "zod";

export const dailyLogSchema = z.object({
  id: z.string(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  weightKg: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Weight must be a valid number with max 2 decimal places",
    )
    .optional(),
  steps: z.number().int().nonnegative().optional(),
  calories: z.number().int().nonnegative().optional(),
  sleepHours: z
    .string()
    .regex(
      /^\d+(\.\d)?$/,
      "Sleep hours must be a valid number with max 1 decimal place",
    )
    .optional(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDailyLogSchema = dailyLogSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .strict();

export const updateDailyLogSchema = dailyLogSchema
  .omit({
    id: true,
    date: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .strict();

export type DailyLog = z.infer<typeof dailyLogSchema>;
export type CreateDailyLog = z.infer<typeof createDailyLogSchema>;
export type UpdateDailyLog = z.infer<typeof updateDailyLogSchema>;
