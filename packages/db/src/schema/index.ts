import { relations } from "drizzle-orm";

// Re-export all schemas
export * from "./users.js";
export * from "./accounts.js";
export * from "./transactions.js";
export * from "./subscriptions.js";
export * from "./actions.js";
export * from "./negotiations.js";
export * from "./savings.js";
export * from "./notifications.js";
export * from "./providers.js";
export * from "./billing.js";

// Import tables for relations
import { users } from "./users.js";
import { plaidItems, accounts } from "./accounts.js";
import { transactions } from "./transactions.js";
import { subscriptions, wasteFlags } from "./subscriptions.js";
import { actions, cancellationAttempts } from "./actions.js";
import { negotiationSessions } from "./negotiations.js";
import { savingsRecords, savingsDestinations, transfers } from "./savings.js";
import { notifications, userNotificationPrefs } from "./notifications.js";
import { billingEvents } from "./billing.js";

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  plaidItems: many(plaidItems),
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  actions: many(actions),
  savingsRecords: many(savingsRecords),
  savingsDestinations: many(savingsDestinations),
  transfers: many(transfers),
  notifications: many(notifications),
  notificationPrefs: many(userNotificationPrefs),
  billingEvents: many(billingEvents),
}));

export const plaidItemsRelations = relations(plaidItems, ({ one, many }) => ({
  user: one(users, { fields: [plaidItems.userId], references: [users.id] }),
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  plaidItem: one(plaidItems, { fields: [accounts.plaidItemId], references: [plaidItems.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, { fields: [transactions.accountId], references: [accounts.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  wasteFlags: many(wasteFlags),
  actions: many(actions),
}));

export const wasteFlagsRelations = relations(wasteFlags, ({ one }) => ({
  subscription: one(subscriptions, { fields: [wasteFlags.subscriptionId], references: [subscriptions.id] }),
}));

export const actionsRelations = relations(actions, ({ one, many }) => ({
  user: one(users, { fields: [actions.userId], references: [users.id] }),
  subscription: one(subscriptions, { fields: [actions.subscriptionId], references: [subscriptions.id] }),
  cancellationAttempts: many(cancellationAttempts),
  negotiationSessions: many(negotiationSessions),
  savingsRecords: many(savingsRecords),
}));

export const cancellationAttemptsRelations = relations(cancellationAttempts, ({ one }) => ({
  action: one(actions, { fields: [cancellationAttempts.actionId], references: [actions.id] }),
}));

export const negotiationSessionsRelations = relations(negotiationSessions, ({ one }) => ({
  action: one(actions, { fields: [negotiationSessions.actionId], references: [actions.id] }),
}));

export const savingsRecordsRelations = relations(savingsRecords, ({ one }) => ({
  user: one(users, { fields: [savingsRecords.userId], references: [users.id] }),
  action: one(actions, { fields: [savingsRecords.actionId], references: [actions.id] }),
}));

export const savingsDestinationsRelations = relations(savingsDestinations, ({ one, many }) => ({
  user: one(users, { fields: [savingsDestinations.userId], references: [users.id] }),
  transfers: many(transfers),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  user: one(users, { fields: [transfers.userId], references: [users.id] }),
  destination: one(savingsDestinations, { fields: [transfers.destinationId], references: [savingsDestinations.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const userNotificationPrefsRelations = relations(userNotificationPrefs, ({ one }) => ({
  user: one(users, { fields: [userNotificationPrefs.userId], references: [users.id] }),
}));

export const billingEventsRelations = relations(billingEvents, ({ one }) => ({
  user: one(users, { fields: [billingEvents.userId], references: [users.id] }),
}));
