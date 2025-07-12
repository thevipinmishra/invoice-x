import { db } from "../db/index.js";
import { users, type UsersSchema } from "../db/schema.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";

const SALT_ROUNDS = 10;

const findUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result.length > 0 ? result[0] : null;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const insertUser = async (user: UsersSchema) => {
  const existingUser = await findUserByEmail(user.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const result = await db
    .insert(users)
    .values({
      ...user,
      password: await hashPassword(user.password),
    })
    .returning();
  return result;
};

export const handleUserLogin = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const jwt = await sign(payload, process.env.SECRET_KEY!);

  return jwt;
};
