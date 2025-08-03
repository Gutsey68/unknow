import "dotenv/config";
import db from "./db";
import { user } from "./schema";

async function main() {
  const newUsers: (typeof user.$inferInsert)[] = [
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
    {
      id: "user_3",
      name: "Alice Johnson",
      email: "alice@example.com",
    },
  ];

  await db.insert(user).values(newUsers);
  console.log("New users created!");
}

if (import.meta.main) {
  main().catch(console.error);
}

export { main };
