import type { NotFoundHandler } from "hono";
import { NOT_FOUND } from "../utils/http-status-code";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../utils/http-status-phrase";

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND,
  );
};

export default notFound;
