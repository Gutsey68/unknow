import { eq } from "drizzle-orm";
import { Hono } from "hono";
import db from "../db/db";
import { user } from "../db/schema";

const usersRoute = new Hono();

// Get all users
usersRoute.get("/", async (c) => {
  const users = await db.select().from(user);
  return c.json(users);
});

// Create a new user
usersRoute.post("/", async (c) => {
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
usersRoute.get("/:email", async (c) => {
  const email = c.req.param("email");
  const userData = await db.select().from(user).where(eq(user.email, email));

  if (userData.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(userData[0]);
});

// Update user by email
usersRoute.put("/:email", async (c) => {
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
usersRoute.delete("/:email", async (c) => {
  const email = c.req.param("email");

  const result = await db.delete(user).where(eq(user.email, email)).returning();

  if (result.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ message: "User deleted successfully" });
});

export default usersRoute;
