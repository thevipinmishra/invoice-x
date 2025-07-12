import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { invoices, type InvoicesSchema, invoiceItems } from "../db/schema.js";

export async function insertInvoiceItems(
  items: Array<{
    product: string;
    quantity: string;
    unitPrice: string;
  }>,
  invoiceId: string,
  userId: string
) {
  const itemsToInsert = items.map((item) => ({
    ...item,
    invoiceId,
    userId,
  }));

  const newInvoiceItems = await db
    .insert(invoiceItems)
    .values(itemsToInsert)
    .returning();
  return newInvoiceItems;
}

export async function createInvoice(
  invoiceData: Omit<InvoicesSchema, "id" | "createdAt"> & { userId: string }
) {
  const [newInvoice] = await db
    .insert(invoices)
    .values(invoiceData)
    .returning();
  return newInvoice;
}

export async function deleteInvoice(invoiceId: string, userId: string) {
  const [deletedInvoice] = await db
    .delete(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)))
    .returning();
  return deletedInvoice;
}

export async function getInvoicesByUserId(userId: string) {
  return await db.select().from(invoices).where(eq(invoices.userId, userId));
}

export async function getInvoiceById(invoiceId: string, userId: string) {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, userId)));

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
}

export async function getInvoiceItemsByInvoiceId(
  invoiceId: string,
  userId: string
) {
  return await db
    .select()
    .from(invoiceItems)
    .where(
      and(
        eq(invoiceItems.invoiceId, invoiceId),
        eq(invoiceItems.userId, userId)
      )
    );
}