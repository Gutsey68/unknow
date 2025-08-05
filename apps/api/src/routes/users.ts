import { eq } from "drizzle-orm";
import { Hono } from "hono";
import db from "../db/db";
import { user } from "../db/schema";
import { requireAuth } from "../middleware/require-auth";
import { updateUserSchema, type UpdateUser } from "../schemas/users-schemas";
import type { AuthType } from "../utils/auth";
import * as STATUS_CODE from "../utils/http-status-code";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const usersRoutes = new Hono<{ Variables: AuthType }>({
  strict: false,
});

usersRoutes.use("*", requireAuth);

usersRoutes.get("/", async (c) => {
  const users = await db.query.user.findMany();
  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.OK,
      data: users,
    },
    STATUS_CODE.OK,
  );
});

usersRoutes.get("/:id", async (c) => {
  const userId = c.req.param("id");
  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  if (!user) {
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
      data: user,
    },
    STATUS_CODE.OK,
  );
});

usersRoutes.put("/:id", async (c) => {
  const userId = c.req.param("id");
  const body: UpdateUser = await c.req.json();

  const validationResult = updateUserSchema.safeParse(body);

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

  const updatedUser = await db
    .update(user)
    .set(updateData)
    .where(eq(user.id, userId))
    .returning();

  if (updatedUser.length === 0) {
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
      data: updatedUser[0],
    },
    STATUS_CODE.OK,
  );
});

export default usersRoutes;
