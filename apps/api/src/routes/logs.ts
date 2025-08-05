import { Hono } from "hono";
import db from "../db/db";
import { requireAuth } from "../middleware/require-auth";
import type { AuthType } from "../utils/auth";
import * as STATUS_CODE from "../utils/http-status-code";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const globalLogsRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
});

globalLogsRoutes.use("*", requireAuth);

globalLogsRoutes.get("/", async (c) => {
  const logs = await db.query.dailyLog.findMany();
  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: logs,
    },
    STATUS_CODE.OK,
  );
});

export default globalLogsRoutes;
