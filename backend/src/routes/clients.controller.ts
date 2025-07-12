import { Hono } from "hono";
import { jwt } from "hono/jwt";
import {
  createClient,
  getClientsByUserId,
  getClientById,
  updateClient,
  deleteClient,
} from "../services/clients.service.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const clientsRouter = new Hono<{ Variables: Variables }>();

// Use JWT middleware for all routes
clientsRouter.use(
  jwt({
    secret: process.env.SECRET_KEY!,
  })
);

// GET /clients - Get all clients for user
clientsRouter.get("/", async (c) => {
  try {
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

    const clients = await getClientsByUserId(payload.id as string);

    return c.json({
      message: "Clients retrieved successfully",
      status: "success",
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return c.json(
      {
        error: "Failed to fetch clients",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// GET /clients/:id - Get specific client
clientsRouter.get("/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const clientId = c.req.param("id");

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    const client = await getClientById(clientId, payload.id as string);

    return c.json({
      message: "Client retrieved successfully",
      status: "success",
      client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);

    if (error instanceof Error && error.message === "Client not found") {
      return c.json(
        {
          error: "Client not found",
          code: "CLIENT_NOT_FOUND",
        },
        404
      );
    }

    return c.json(
      {
        error: "Failed to fetch client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// POST /clients - Create new client
clientsRouter.post("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const body = await c.req.json();

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    if (!body.name || !body.email) {
      return c.json(
        {
          error: "Name and email are required",
          code: "VALIDATION_ERROR",
        },
        400
      );
    }

    const newClient = await createClient({
      name: body.name,
      email: body.email,
      gstin: body.gstin || null,
      address: body.address || null,
      userId: payload.id as string,
    });

    return c.json(
      {
        message: "Client created successfully",
        status: "success",
        client: newClient,
      },
      201
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return c.json(
      {
        error: "Failed to create client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// PUT /clients/:id - Update client
clientsRouter.put("/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const clientId = c.req.param("id");
    const body = await c.req.json();

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    const updateData: { name?: string; email?: string } = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;

    if (Object.keys(updateData).length === 0) {
      return c.json(
        {
          error: "No valid fields to update",
          code: "VALIDATION_ERROR",
        },
        400
      );
    }

    const updatedClient = await updateClient(
      clientId,
      payload.id as string,
      updateData
    );

    return c.json({
      message: "Client updated successfully",
      status: "success",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);

    if (error instanceof Error && error.message === "Client not found") {
      return c.json(
        {
          error: "Client not found",
          code: "CLIENT_NOT_FOUND",
        },
        404
      );
    }

    return c.json(
      {
        error: "Failed to update client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// DELETE /clients/:id - Delete client
clientsRouter.delete("/:id", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const clientId = c.req.param("id");

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    await deleteClient(clientId, payload.id as string);

    return c.json({
      message: "Client deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting client:", error);

    if (error instanceof Error && error.message === "Client not found") {
      return c.json(
        {
          error: "Client not found",
          code: "CLIENT_NOT_FOUND",
        },
        404
      );
    }

    return c.json(
      {
        error: "Failed to delete client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export { clientsRouter };
