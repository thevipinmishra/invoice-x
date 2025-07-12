import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AddressInfo } from "node:net";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { auth } from "./routes/auth.controller.js";
import { meta } from "./routes/meta.controller.js";
import { clientsRouter } from "./routes/clients.controller.js";
import { invoicesRouter } from "./routes/invoices.controller.js";

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.use(cors());

app.onError((err, c) => {
  console.error("Error occurred:", err.message, err.stack);

  // Handle JWT-related errors
  if (
    err.message.includes("jwt expired") ||
    err.message.includes("token expired")
  ) {
    return c.json(
      {
        error: "Token has expired",
        code: "TOKEN_EXPIRED",
      },
      401
    );
  }

  if (
    err.message.includes("jwt malformed") ||
    err.message.includes("invalid token")
  ) {
    return c.json(
      {
        error: "Invalid token",
        code: "TOKEN_INVALID",
      },
      401
    );
  }

  if (
    err.message.includes("jwt signature") ||
    err.message.includes("invalid signature")
  ) {
    return c.json(
      {
        error: "Invalid token signature",
        code: "TOKEN_INVALID",
      },
      401
    );
  }

  // Handle HTTP exceptions
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.message,
        code: "HTTP_ERROR",
      },
      err.status
    );
  }

  // Handle other errors
  return c.json(
    {
      error: "Internal server error",
      details: err.message,
    },
    500
  );
});

app.route("/auth", auth);
app.route("/meta", meta);
app.route('/clients', clientsRouter)
app.route("/invoices", invoicesRouter);

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info: AddressInfo) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
