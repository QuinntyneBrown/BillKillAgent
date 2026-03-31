import { pgTable, uuid, varchar, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { actions } from "./actions.js";

export const savingsTypeEnum = pgEnum("savings_type", [
  "cancellation",
  "negotiation",
  "downgrade",
  "switch",
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const transferFrequencyEnum = pgEnum("transfer_frequency", [
  "weekly",
  "biweekly",
  "monthly",
  "on_savings",
]);

export const savingsRecords = pgTable("savings_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actionId: uuid("action_id")
    .notNull()
    .references(() => actions.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: savingsTypeEnum("type").notNull(),
  realizedAt: timestamp("realized_at", { withTimezone: true }).notNull().defaultNow(),
});

export const savingsDestinations = pgTable("savings_destinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountName: varchar("account_name", { length: 255 }).notNull(),
  accountMask: varchar("account_mask", { length: 4 }).notNull(),
  autoTransfer: boolean("auto_transfer").notNull().default(false),
  transferFrequency: transferFrequencyEnum("transfer_frequency").notNull().default("monthly"),
});

export const transfers = pgTable("transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  destinationId: uuid("destination_id")
    .notNull()
    .references(() => savingsDestinations.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: transferStatusEnum("status").notNull().default("pending"),
  initiatedAt: timestamp("initiated_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});
