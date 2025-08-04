import { Hono } from "hono";
import { z } from "zod";
import db from "../db/db";
import { loginSchema, registerSchema } from "../schemas/auth-schemas";
import { auth, type AuthType } from "../utils/auth";
import * as STATUS_CODE from "../utils/http-status-code";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

const authRouter = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

authRouter.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

/*
 * Endpoint to register a new user.
 */
authRouter.post("/register", async (c) => {
  const body = await c.req.json();

  const parse = registerSchema.safeParse(body);
  if (!parse.success) {
    return c.json(
      {
        success: false,
        details: z.treeifyError(parse.error),
      },
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const { name, email, password } = parse.data;
  const image = parse.data.image ?? undefined;

  const existingUser = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.email, email),
  });
  if (existingUser) {
    return c.json(
      {
        success: false,
        message: "Email already in use",
      },
      STATUS_CODE.CONFLICT,
    );
  }

  const data = await auth.api.signUpEmail({
    body: { name, email, password, image },
  });

  return c.json(
    {
      success: true,
      message: STATUS_PHRASE.CREATED,
      ...data,
    },
    STATUS_CODE.CREATED,
  );
});

/*
 * Endpoint to login.
 */
authRouter.post("/login", async (c) => {
  const body = await c.req.json();

  const parse = loginSchema.safeParse(body);

  if (!parse.success) {
    return c.json(
      {
        success: false,
        details: z.treeifyError(parse.error),
      },
      STATUS_CODE.BAD_REQUEST,
    );
  }

  const { email, password, rememberMe } = parse.data;

  try {
    const data = await auth.api.signInEmail({
      body: { email, password, rememberMe },
    });
    return c.json(
      {
        success: true,
        message: STATUS_PHRASE.OK,
        ...data,
      },
      STATUS_CODE.OK,
    );
  } catch {
    return c.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      STATUS_CODE.UNAUTHORIZED,
    );
  }
});

/*
 * Endpoint to logout.
 * TODO : Handle error
 */
authRouter.post("/logout", async (c) => {
  try {
    const data = await auth.api.signOut({
      headers: c.req.raw.headers,
    });
    return c.json(
      {
        success: true,
        message: STATUS_PHRASE.OK,
      },
      STATUS_CODE.OK,
    );
  } catch {
    return c.json(
      {
        success: false,
        message: "Failed to logout",
      },
      STATUS_CODE.BAD_REQUEST,
    );
  }
});

export default authRouter;
