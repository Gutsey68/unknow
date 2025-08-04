import { Hono } from "hono";
import db from "../db/db";
import type { AuthType } from "../utils/auth";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const usersRoutes = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

usersRoutes.get("/", async (c) => {
  const users = await db.query.user.findMany();
  return c.json({
    success: true,
    message: STATUS_PHRASE.OK,
    Data: users,
  });
});

export default usersRoutes;
