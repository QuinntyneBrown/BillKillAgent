import { pgTable, uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const plaidItemStatusEnum = pgEnum("plaid_item_status", ["active", "needs_update", "revoked"]);

export const plaidItems = pgTable("plaid_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plaidItemId: varchar("plaid_item_id", { length: 255 }).notNull().unique(),
  institutionName: varchar("institution_name", { length: 255 }).notNull(),
  status: plaidItemStatusEnum("status").notNull().default("active"),
  accessTokenEncrypted: text("access_token_encrypted").notNull(),
  cursor: text("cursor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plaidItemId: uuid("plaid_item_id")
    .notNull()
    .references(() => plaidItems.id, { onDelete: "cascade" }),
  plaidAccountId: varchar("plaid_account_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  mask: varchar("mask", { length: 4 }),
  type: varchar("type", { length: 50 }).notNull(),
  subtype: varchar("subtype", { length: 50 }),
});
