import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const subscriptionFrequencyEnum = pgEnum("subscription_frequency", [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "paused",
  "cancelled",
  "pending_cancellation",
]);

export const recommendedActionEnum = pgEnum("recommended_action", [
  "cancel",
  "negotiate",
  "downgrade",
  "keep",
  "review",
]);

export const wasteFlagTypeEnum = pgEnum("waste_flag_type", [
  "unused",
  "duplicate",
  "price_increase",
  "better_alternative",
  "low_usage",
]);

export const wasteFlagSeverityEnum = pgEnum("waste_flag_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  merchantName: varchar("merchant_name", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  frequency: subscriptionFrequencyEnum("frequency").notNull().default("monthly"),
  category: varchar("category", { length: 100 }).notNull(),
  valueScore: integer("value_score").notNull().default(50),
  usageScore: integer("usage_score").notNull().default(50),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  recommendedAction: recommendedActionEnum("recommended_action").notNull().default("review"),
  nextBillingDate: timestamp("next_billing_date", { withTimezone: true }),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wasteFlags = pgTable("waste_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),
  type: wasteFlagTypeEnum("type").notNull(),
  severity: wasteFlagSeverityEnum("severity").notNull(),
  evidence: jsonb("evidence").notNull().default({}),
});
