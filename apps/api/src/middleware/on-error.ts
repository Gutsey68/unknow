import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import env from "../env.js";
import { INTERNAL_SERVER_ERROR, OK } from "../utils/http-status-code.js";

const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== OK
      ? (currentStatus as ContentfulStatusCode)
      : INTERNAL_SERVER_ERROR;
  return c.json(
    {
      success: false,
      message: err.message,
      stack: env.BUN_ENV === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

export default onError;
