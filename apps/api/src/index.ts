import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import db from "./db/db";
import { user } from "./db/schema";
import { auth } from "./utils/auth";

const app = new Hono();

app.use(prettyJSON());
app.use(logger());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Get all users
app.get("/users", async (c) => {
  const users = await db.select().from(user);
  return c.json(users);
});

// Create a new user
app.post("/users", async (c) => {
  const body = await c.req.json();
  const newUser: typeof user.$inferInsert = {
    id: `user_${Date.now()}`,
    name: body.name,
    email: body.email,
  };

  const result = await db.insert(user).values(newUser).returning();
  return c.json(result[0]);
});

// Get user by email
app.get("/users/:email", async (c) => {
  const email = c.req.param("email");
  const userData = await db.select().from(user).where(eq(user.email, email));

  if (userData.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(userData[0]);
});

// Update user by email
app.put("/users/:email", async (c) => {
  const email = c.req.param("email");
  const body = await c.req.json();

  const result = await db
    .update(user)
    .set(body)
    .where(eq(user.email, email))
    .returning();

  if (result.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(result[0]);
});

// Delete user by email
app.delete("/users/:email", async (c) => {
  const email = c.req.param("email");

  const result = await db.delete(user).where(eq(user.email, email)).returning();

  if (result.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ message: "User deleted successfully" });
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
