import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import notFound from "./middleware/not-found";
import onError from "./middleware/on-error";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import * as STATUS_PHRASE from "./utils/http-status-phrase";

const app = new Hono({
  strict: false,
});

app.use(prettyJSON());
app.use(logger());
app.notFound(notFound);
app.onError(onError);

app.get("/", (c) => {
  return c.json({ success: true, message: "Hello Hono!" });
});

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: STATUS_PHRASE.OK,
  });
});

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

export default app;
