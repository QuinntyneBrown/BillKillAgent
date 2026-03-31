import { pgTable, uuid, varchar, decimal, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { accounts } from "./accounts.js";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }).notNull().unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  date: date("date").notNull(),
  merchantName: varchar("merchant_name", { length: 255 }),
  category: varchar("category", { length: 100 }),
  pending: boolean("pending").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
