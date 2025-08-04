import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import authRoutes from "./routes/auth";
import usersRoute from "./routes/users";

const app = new Hono({
  strict: false,
});

app.use(prettyJSON());
app.use(logger());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => {
  return c.json({ message: "OK", ok: true });
});

app.route("/auth", authRoutes);
app.route("/users", usersRoute);

export default app;
