import { db } from "../db/index.js";
import { clients } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type { ClientsSchema } from "../db/schema.js";

export async function createClient(clientData: Omit<ClientsSchema, 'id' | 'createdAt'> & { userId: string }) {
  const [newClient] = await db.insert(clients).values(clientData).returning();
  return newClient;
}

export async function getClientsByUserId(userId: string) {
  return await db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getClientById(clientId: string, userId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
  
  if (!client) {
    throw new Error("Client not found");
  }
  
  return client;
}

export async function updateClient(clientId: string, userId: string, updateData: Partial<Pick<ClientsSchema, 'name' | 'email'>>) {
  const [updatedClient] = await db
    .update(clients)
    .set(updateData)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .returning();
  
  if (!updatedClient) {
    throw new Error("Client not found");
  }
  
  return updatedClient;
}

export async function deleteClient(clientId: string, userId: string) {
  const [deletedClient] = await db
    .delete(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .returning();
  
  if (!deletedClient) {
    throw new Error("Client not found");
  }
  
  return deletedClient;
}
