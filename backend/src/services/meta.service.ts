import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const getMeta = async (userId: string) => {
  const result = await db.select().from(users).where(eq(users.id, userId));

  if (result.length === 0) {
    throw new Error("User not found");
  }

  return result[0];
};
