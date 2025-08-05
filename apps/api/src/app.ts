import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import env from "./env";
import notFound from "./middleware/not-found";
import onError from "./middleware/on-error";
import { sessionMiddleware } from "./middleware/session";
import globalLogsRoutes from "./routes/logs";
import userLogsRoutes from "./routes/user-logs";
import usersRoutes from "./routes/users";
import { auth } from "./utils/auth";
import * as STATUS_PHRASE from "./utils/http-status-phrase";

const app = new Hono({
  strict: false,
});

app.use(prettyJSON());
app.use(logger());

app.use(
  "/auth/*",
  cors({
    origin: env.FRONTEND_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  }),
);

app.all("/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.notFound(notFound);
app.onError(onError);

app.use("*", sessionMiddleware);

app.get("/", (c) => {
  return c.json({ success: true, message: "Hello Hono!" });
});

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: STATUS_PHRASE.OK,
  });
});

app.route("/users", usersRoutes);
app.route("/users", userLogsRoutes);
app.route("/logs", globalLogsRoutes);

export default app;
