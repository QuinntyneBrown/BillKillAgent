import { pgTable, uuid, varchar, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const billingEventTypeEnum = pgEnum("billing_event_type", [
  "subscription_created",
  "payment_succeeded",
  "payment_failed",
  "subscription_cancelled",
  "trial_started",
  "trial_ended",
]);

export const billingEvents = pgTable("billing_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: billingEventTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  stripeEventId: varchar("stripe_event_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
