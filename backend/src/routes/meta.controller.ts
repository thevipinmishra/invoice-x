import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { getMeta } from "../services/meta.service.js";
import type { JwtVariables } from "hono/jwt";
import { getClientsByUserId } from "../services/clients.service.js";
import { getInvoicesByUserId } from "../services/invoices.service.js";

type Variables = JwtVariables;

const meta = new Hono<{ Variables: Variables }>();

// Use JWT middleware which handles token verification and expiry properly
meta.use(
  jwt({
    secret: process.env.SECRET_KEY!,
  })
);

meta.get("/", async (c) => {
  try {
    // Get the JWT payload that was set by the jwt middleware
    const payload = c.get("jwtPayload");

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    // Get user details from database using the user ID from token
    const userDetails = await getMeta(payload.id as string);
    const clientDetails = await getClientsByUserId(payload.id as string);
    const invoices = await getInvoicesByUserId(payload.id as string);

    // Remove password from the response for security
    const { password, ...userWithoutPassword } = userDetails;

    return c.json({
      message: "User details retrieved successfully",
      status: "success",
      data: {
        user: userWithoutPassword,
        clients: clientDetails.length,
        invoices: invoices.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);

    // Handle user not found error specifically
    if (error instanceof Error && error.message === "User not found") {
      return c.json(
        {
          error: "User not found",
          code: "USER_NOT_FOUND",
        },
        404
      );
    }

    return c.json(
      {
        error: "Failed to fetch user details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export { meta };
