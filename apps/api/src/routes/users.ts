import { Hono } from "hono";
import db from "../db/db";
import { requireAuth } from "../middleware/require-auth";
import type { AuthType } from "../utils/auth";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const usersRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
});

usersRoutes.use("*", requireAuth);

usersRoutes.get("/", async (c) => {
  const users = await db.query.user.findMany();
  return c.json({
    success: true,
    message: STATUS_PHRASE.OK,
    data: users,
  });
});

export default usersRoutes;
