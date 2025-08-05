import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { AuthType } from "../utils/auth";
import * as STATUS_CODE from "../utils/http-status-code";
import * as STATUS_PHRASE from "../utils/http-status-phrase";

export const requireAuth: MiddlewareHandler<{
  Variables: AuthType;
}> = async (c, next) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || !session) {
    throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
      message: STATUS_PHRASE.UNAUTHORIZED,
    });
  }

  return next();
};
