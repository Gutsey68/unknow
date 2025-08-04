import { Hono } from "hono";
import { auth, type AuthType } from "../utils/auth";

const authRouter = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

authRouter.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default authRouter;
