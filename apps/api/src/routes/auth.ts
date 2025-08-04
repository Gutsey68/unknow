import { Hono } from "hono";
import { z } from "zod";
import db from "../db/db";
import { registerSchema } from "../schemas/user-schemas";
import { auth, type AuthType } from "../utils/auth";

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
        error: "Invalid input",
        details: z.treeifyError(parse.error),
      },
      400,
    );
  }

  const { name, email, password } = parse.data;
  const image = parse.data.image ?? undefined;
  const callbackURL = parse.data.callbackURL ?? undefined;

  const existingUser = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.email, email),
  });
  if (existingUser) {
    return c.json(
      {
        success: false,
        error: "Email already in use",
      },
      409,
    );
  }

  const data = await auth.api.signUpEmail({
    body: { name, email, password, image, callbackURL },
  });

  return c.json(data);
});

export default authRouter;
