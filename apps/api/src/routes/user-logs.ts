import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import db from "../db/db";
import { dailyLog } from "../db/schema";
import { requireAuth } from "../middleware/require-auth";
import {
  createDailyLogSchema,
  updateDailyLogSchema,
  type CreateDailyLog,
  type UpdateDailyLog,
} from "../schemas/logs-schemas";
import type { AuthType } from "../utils/auth";
import * as STATUS_CODE from "../utils/http-status-code";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const userLogsRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
});

userLogsRoutes.use("*", requireAuth);

userLogsRoutes.get("/:userId/logs", async (c) => {
  const userId = c.req.param("userId");

  const logs = await db.query.dailyLog.findMany({
    where: (dailyLog, { eq }) => eq(dailyLog.userId, userId),
  });

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: logs,
    },
    STATUS_CODE.OK,
  );
});

userLogsRoutes.get("/:userId/logs/:date", async (c) => {
  const userId = c.req.param("userId");
  const date = c.req.param("date");

  const log = await db.query.dailyLog.findFirst({
    where: (dailyLog, { eq, and }) =>
      and(eq(dailyLog.userId, userId), eq(dailyLog.date, date)),
  });

  if (!log) {
    return c.json(
      {
        success: false,
        message: STATUS_PHRASE.NOT_FOUND,
      },
      STATUS_CODE.NOT_FOUND,
    );
  }

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: log,
    },
    STATUS_CODE.OK,
  );
});

userLogsRoutes.post("/:userId/logs", async (c) => {
  const userId = c.req.param("userId");
  const body: CreateDailyLog = await c.req.json();

  const validationResult = createDailyLogSchema.safeParse({
    ...body,
    userId,
  });

  if (!validationResult.success) {
    return c.json(
      {
        success: false,
        message: STATUS_PHRASE.BAD_REQUEST,
        errors: validationResult.error.issues,
      },
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const existingLog = await db.query.dailyLog.findFirst({
    where: (dailyLog, { eq, and }) =>
      and(
        eq(dailyLog.userId, userId),
        eq(dailyLog.date, validationResult.data.date),
      ),
  });

  if (existingLog) {
    return c.json(
      {
        success: false,
        message: "Log already exists for this date",
      },
      STATUS_CODE.CONFLICT,
    );
  }

  const createData = {
    id: crypto.randomUUID(),
    ...validationResult.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newLog = await db.insert(dailyLog).values(createData).returning();

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.CREATED,
      data: newLog[0],
    },
    STATUS_CODE.CREATED,
  );
});

userLogsRoutes.put("/:userId/logs/:date", async (c) => {
  const userId = c.req.param("userId");
  const date = c.req.param("date");
  const body: UpdateDailyLog = await c.req.json();

  const validationResult = updateDailyLogSchema.safeParse(body);

  if (!validationResult.success) {
    return c.json(
      {
        success: false,
        message: STATUS_PHRASE.BAD_REQUEST,
        errors: validationResult.error.issues,
      },
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const updateData = {
    ...validationResult.data,
    updatedAt: new Date(),
  };

  const updatedLog = await db
    .update(dailyLog)
    .set(updateData)
    .where(and(eq(dailyLog.userId, userId), eq(dailyLog.date, date)))
    .returning();

  if (updatedLog.length === 0) {
    return c.json(
      {
        success: false,
        message: STATUS_PHRASE.NOT_FOUND,
      },
      STATUS_CODE.NOT_FOUND,
    );
  }

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: updatedLog[0],
    },
    STATUS_CODE.OK,
  );
});

userLogsRoutes.delete("/:userId/logs/:date", async (c) => {
  const userId = c.req.param("userId");
  const date = c.req.param("date");

  const deletedLog = await db
    .delete(dailyLog)
    .where(and(eq(dailyLog.userId, userId), eq(dailyLog.date, date)))
    .returning();

  if (deletedLog.length === 0) {
    return c.json(
      {
        success: false,
        message: STATUS_PHRASE.NOT_FOUND,
      },
      STATUS_CODE.NOT_FOUND,
    );
  }

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: deletedLog[0],
    },
    STATUS_CODE.OK,
  );
});

export default userLogsRoutes;
