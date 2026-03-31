import { pgTable, uuid, varchar, decimal, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const providerFlowTypeEnum = pgEnum("provider_flow_type", [
  "cancellation",
  "negotiation",
  "downgrade",
]);

export const providerFlows = pgTable("provider_flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerName: varchar("provider_name", { length: 255 }).notNull(),
  flowType: providerFlowTypeEnum("flow_type").notNull(),
  script: jsonb("script").notNull().default({}),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  lastVerified: timestamp("last_verified", { withTimezone: true }),
});
