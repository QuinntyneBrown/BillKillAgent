import {
  pgTable,
  uuid,
  varchar,
  decimal,
  integer,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { actions } from "./actions.js";

export const negotiationOutcomeEnum = pgEnum("negotiation_outcome", [
  "success",
  "partial",
  "failed",
  "pending",
  "in_progress",
]);

export const negotiationSessions = pgTable("negotiation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  actionId: uuid("action_id")
    .notNull()
    .references(() => actions.id, { onDelete: "cascade" }),
  providerName: varchar("provider_name", { length: 255 }).notNull(),
  originalRate: decimal("original_rate", { precision: 12, scale: 2 }).notNull(),
  newRate: decimal("new_rate", { precision: 12, scale: 2 }),
  savings: decimal("savings", { precision: 12, scale: 2 }),
  durationSeconds: integer("duration_seconds"),
  outcome: negotiationOutcomeEnum("outcome").notNull().default("pending"),
  callSid: varchar("call_sid", { length: 255 }),
  transcript: jsonb("transcript"),
  retentionOffers: jsonb("retention_offers"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
