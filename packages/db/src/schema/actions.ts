import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { subscriptions } from "./subscriptions.js";

export const actionTypeEnum = pgEnum("action_type", [
  "cancel",
  "negotiate",
  "downgrade",
  "pause",
  "switch_plan",
]);

export const actionStatusEnum = pgEnum("action_status", [
  "pending",
  "approved",
  "in_progress",
  "completed",
  "failed",
  "dismissed",
]);

export const cancellationMethodEnum = pgEnum("cancellation_method", [
  "api",
  "phone",
  "email",
  "chat",
  "portal",
]);

export const cancellationStatusEnum = pgEnum("cancellation_status", [
  "pending",
  "in_progress",
  "completed",
  "failed",
  "requires_manual",
]);

export const actions = pgTable("actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),
  type: actionTypeEnum("type").notNull(),
  status: actionStatusEnum("status").notNull().default("pending"),
  estimatedSavings: decimal("estimated_savings", { precision: 12, scale: 2 }).notNull().default("0"),
  actualSavings: decimal("actual_savings", { precision: 12, scale: 2 }),
  autonomyApproved: boolean("autonomy_approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const cancellationAttempts = pgTable("cancellation_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  actionId: uuid("action_id")
    .notNull()
    .references(() => actions.id, { onDelete: "cascade" }),
  method: cancellationMethodEnum("method").notNull(),
  status: cancellationStatusEnum("status").notNull().default("pending"),
  providerFlowId: varchar("provider_flow_id", { length: 255 }),
  error: text("error"),
  attemptNumber: integer("attempt_number").notNull().default(1),
});
