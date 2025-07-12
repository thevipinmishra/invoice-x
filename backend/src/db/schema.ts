import { pgTable, varchar, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4";

export const currencyEnum = pgEnum("currency", [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "AUD",
  "CAD",
  "JPY",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
  }).defaultNow(),
});

// Clients
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  gstin: varchar("gstin", { length: 15 }),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
  }).defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("clientId")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  invoiceNumber: varchar("invoiceNumber", { length: 255 }).notNull(),
  currency: currencyEnum().default("USD"),
  invoiceDate: timestamp("invoiceDate", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  dueDate: timestamp("dueDate", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
  }).defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const invoiceItems = pgTable("invoiceItems", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoiceId")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  product: varchar("product", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 50 }).notNull(),
  unitPrice: varchar("unitPrice", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
  }).defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Schemas
export const usersSchema = createSelectSchema(users, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
});

export const clientsSchema = createSelectSchema(clients, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  userId: (schema) => schema.optional(),
});

export const invoicesSchema = createSelectSchema(invoices, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  userId: (schema) => schema.optional(),
});
export const invoiceItemsSchema = createSelectSchema(invoiceItems, {
  id: (schema) => schema.optional(),
  createdAt: (schema) => schema.optional(),
  userId: (schema) => schema.optional(),
});

export type UsersSchema = z.input<typeof usersSchema>;
export type ClientsSchema = z.input<typeof clientsSchema>;
export type InvoicesSchema = z.input<typeof invoicesSchema>;
export type InvoiceItemsSchema = z.input<typeof invoiceItemsSchema>;
