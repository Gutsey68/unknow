import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import authRoutes from "./routes/auth";

const app = new Hono({
  strict: false,
});

app.use(prettyJSON());
app.use(logger());
app.notFound((c) => c.json({ success: false, message: "Not Found" }, 404));

app.get("/", (c) => {
  return c.json({ success: true, message: "Hello Hono!" });
});

app.get("/health", (c) => {
  return c.json({ success: true, message: "OK" });
});

app.route("/auth", authRoutes);

export default app;
