import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const autonomyLevelEnum = pgEnum("autonomy_level", ["full_auto", "supervised", "manual"]);

export const premiumTierEnum = pgEnum("premium_tier", ["free", "plus", "pro"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  autonomyLevel: autonomyLevelEnum("autonomy_level").notNull().default("supervised"),
  savingsThreshold: varchar("savings_threshold", { length: 20 }).notNull().default("50"),
  premiumTier: premiumTierEnum("premium_tier").notNull().default("free"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
