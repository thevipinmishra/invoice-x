import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { handleUserLogin, insertUser } from "../services/auth.service.js";
import { usersSchema } from "../db/schema.js";
import { z } from "zod/v4";

const auth = new Hono();

auth.post(
  "/sign-up",
  zValidator("json", usersSchema, (result, c) => {
    if (!result.success) {
      return c.json(z.flattenError(result.error)?.fieldErrors, 400);
    }
  }),
  async (c) => {
    try {
      const userData = c.req.valid("json");
      const newUser = await insertUser(userData);
      return c.json(
        {
          message: "User added successfully",
          user: newUser,
        },
        201
      );
    } catch (error) {
      console.error(error);
      return c.json(
        {
          error: "Failed to insert user",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  }
);

auth.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.email(),
      password: z.string(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json(z.flattenError(result.error)?.fieldErrors, 400);
      }
    }
  ),
  async (c) => {
    try {
      const { email, password } = c.req.valid("json");
      console.log("Login attempt for email:", email);
      const jwt = await handleUserLogin(email, password);
      return c.json(
        {
          message: "Login successful",
          token: jwt,
        },
        200
      );
    } catch (error) {
      console.log("Login error:", error);
      return c.json(
        {
          error: "Login failed",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        401
      );
    }
  }
);

export { auth };
