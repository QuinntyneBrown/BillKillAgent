# Feature 07: Ongoing Monitoring & Alerts -- Components

## MonitoringScheduler

Central coordinator that runs monitoring rules against transactions and subscriptions on a scheduled basis.

**Responsibilities:**
- Registers and manages all IMonitoringRule implementations
- Listens for new transaction sync events (transaction-driven monitoring)
- Runs scheduled monitoring jobs via BullMQ cron (daily, monthly)
- Routes generated alerts to the Notification Service for delivery
- Tracks monitoring run history for observability
- Manages per-user monitoring preferences (enabled rules, thresholds)

**Key Methods:**
- `onTransactionsSync(userId: string, transactions: Transaction[]): Promise<Alert[]>` -- Transaction-driven evaluation
- `runDailyChecks(): Promise<void>` -- BullMQ daily cron: trials, renewals
- `runMonthlyReport(month: Date): Promise<void>` -- BullMQ monthly cron: report generation
- `registerRule(rule: IMonitoringRule): void` -- Adds a rule to the pipeline
- `getUserRuleConfig(userId: string): Promise<UserRuleConfig>` -- Per-user settings

**Dependencies:** All IMonitoringRule implementations, Notification Service (Feature 10), BullMQ, Redis

---

## PriceChangeDetector

Detects when a subscription's billing amount changes compared to the expected amount.

**Responsibilities:**
- Maintains expected billing amount per subscription (set after initial discovery, updated after negotiations)
- Compares incoming transactions against expected amounts
- Applies configurable tolerance threshold (default: $1 or 5%, whichever is greater)
- Classifies changes as: PRICE_INCREASE, PRICE_DECREASE, ONE_TIME_CHARGE, TAX_ADJUSTMENT
- Uses Claude API for ambiguous cases (e.g., is a $2 increase a tax change or a rate hike?)
- Generates detailed alerts with old amount, new amount, change magnitude, and suggested action

**Key Methods:**
- `evaluate(subscription: Subscription, transaction: Transaction): Alert | null` -- Core detection
- `classifyChange(expected: number, actual: number, context: BillingContext): ChangeType` -- Categorizes
- `updateExpectedAmount(subscriptionId: string, newAmount: number): Promise<void>` -- After confirmed change

**Implements:** `IMonitoringRule`

**Dependencies:** Claude API client (for ambiguous classification), Drizzle ORM

---

## TrialExpirationTracker

Monitors free and discounted trial periods and alerts users before they convert to paid subscriptions.

**Responsibilities:**
- Tracks trial end dates sourced from: subscription metadata, user input, or transaction pattern analysis
- Generates alerts at configurable intervals before expiration (default: 7, 3, 1 days)
- Identifies subscriptions likely in trial based on: $0 or reduced-price transactions, "trial" in merchant name
- After trial expires, monitors for first full-price charge and generates follow-up alert
- Recommends action based on usage data from Feature 02: cancel if unused, keep if active

**Key Methods:**
- `evaluate(subscription: Subscription): Alert[]` -- Checks trial status, returns alerts if approaching expiry
- `detectTrials(transactions: Transaction[]): TrialDetection[]` -- Identifies likely trial subscriptions
- `setTrialEndDate(subscriptionId: string, endDate: Date): Promise<void>` -- Manual or detected end date
- `getExpiringTrials(userId: string, withinDays: number): Promise<Subscription[]>` -- Query upcoming expirations

**Implements:** `IMonitoringRule`

**Dependencies:** Usage data from Feature 02, Drizzle ORM

---

## NewChargeDetector

Identifies new recurring charges that do not match any previously tracked subscription.

**Responsibilities:**
- Compares incoming transactions against the user's known subscription list
- Identifies recurring patterns in unmatched transactions (same merchant, regular interval, consistent amount)
- Requires at least 2 matching transactions before flagging (reduces false positives)
- Generates alerts with merchant name, amount, frequency, and first/last seen dates
- Prompts user to categorize: add to tracked subscriptions, mark as known, or investigate/cancel

**Key Methods:**
- `evaluate(userId: string, transactions: Transaction[]): Alert[]` -- Detects new recurring charges
- `findRecurringPatterns(transactions: Transaction[]): RecurringPattern[]` -- Pattern detection
- `isKnownSubscription(merchantName: string, userId: string): Promise<boolean>` -- Cross-reference check

**Implements:** `IMonitoringRule`

**Dependencies:** Subscription data from Feature 01, Drizzle ORM

---

## RenewalDateTracker

Monitors annual and semi-annual subscriptions and alerts users before renewal charges.

**Responsibilities:**
- Predicts renewal dates from historical transaction patterns (last charge date + billing interval)
- Handles annual, semi-annual, and quarterly renewal cycles
- Sends alerts at 30, 14, and 7 days before predicted renewal
- Includes expected renewal amount (last year's charge, adjusted for known increases)
- Suggests actions: renew as-is, cancel before renewal, negotiate before renewal, switch provider
- Tracks actual renewal to verify prediction accuracy

**Key Methods:**
- `evaluate(subscription: Subscription): Alert[]` -- Checks for upcoming renewals
- `predictRenewalDate(subscription: Subscription): Date | null` -- Calculates next renewal
- `getUpcomingRenewals(userId: string, withinDays: number): Promise<Subscription[]>` -- Query
- `recordActualRenewal(subscriptionId: string, amount: number, date: Date): Promise<void>` -- Verification

**Implements:** `IMonitoringRule`

**Dependencies:** Drizzle ORM

---

## MonthlyReportGenerator

Produces a comprehensive monthly summary of the user's subscription health and BillKillAgent activity.

**Responsibilities:**
- Aggregates monthly recurring spend and compares to prior month
- Summarizes savings achieved this month by action type
- Lists all new charges detected during the month
- Lists all price changes detected during the month
- Previews upcoming renewals and trial expirations for next month
- Generates top recommendations for next month based on current data
- Produces structured report data for rendering by the frontend and email templates

**Key Methods:**
- `generateReport(userId: string, month: Date): Promise<MonthlyReport>` -- Full report generation
- `calculateSpendDelta(userId: string, month: Date): Promise<SpendDelta>` -- Month-over-month change
- `getTopRecommendations(userId: string): Promise<Recommendation[]>` -- Next actions

**MonthlyReport:**
```typescript
{
  userId: string;
  month: Date;
  totalRecurringSpend: number;           // cents
  spendChangeFromLastMonth: number;      // cents (positive = increase)
  savingsAchievedThisMonth: number;      // cents
  savingsByType: {
    cancellations: number;
    negotiations: number;
    planSwitches: number;
  };
  newChargesDetected: NewChargeEntry[];
  priceChangesDetected: PriceChangeEntry[];
  upcomingRenewals: RenewalEntry[];
  expiringTrials: TrialEntry[];
  topRecommendations: Recommendation[];
  lifetimeSavings: number;               // cents
  generatedAt: Date;
}
```

**Dependencies:** All monitoring components, SavingsCalculator (Feature 06), Drizzle ORM

---

## IMonitoringRule

Interface for pluggable monitoring rules. All detectors implement this interface.

```typescript
interface IMonitoringRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly category: AlertCategory;
  readonly defaultEnabled: boolean;

  evaluateTransaction(
    subscription: Subscription,
    transaction: Transaction,
    config: RuleConfig
  ): Alert | null;

  evaluateScheduled(
    subscription: Subscription,
    config: RuleConfig
  ): Alert[];

  getDefaultConfig(): RuleConfig;
}
```

**RuleConfig:**
```typescript
{
  enabled: boolean;
  thresholds: Record<string, number>;   // rule-specific thresholds
  notificationChannels: NotificationChannel[];
  advanceNoticeDays: number[];          // for time-based rules
}
```

**Implementations:**
- `PriceChangeDetector` -- category: PRICE_CHANGE
- `NewChargeDetector` -- category: NEW_CHARGE
- `TrialExpirationTracker` -- category: TRIAL_EXPIRATION
- `RenewalDateTracker` -- category: RENEWAL

---

## Alert (Entity)

Represents a monitoring alert persisted to PostgreSQL.

```typescript
{
  id: string;
  userId: string;
  subscriptionId: string | null;
  ruleId: string;
  category: AlertCategory;             // PRICE_CHANGE | NEW_CHARGE | TRIAL_EXPIRATION | RENEWAL | REPORT
  severity: AlertSeverity;             // INFO | WARNING | CRITICAL
  title: string;
  message: string;
  metadata: Record<string, any>;       // rule-specific data (amounts, dates, etc.)
  suggestedAction: string | null;      // e.g., "Cancel before trial ends on April 5"
  actionUrl: string | null;            // deep link to relevant screen
  status: AlertStatus;                 // CREATED | DELIVERED | READ | ACTION_TAKEN | DISMISSED | EXPIRED
  deliveredVia: NotificationChannel[]; // channels alert was sent through
  deliveredAt: Date | null;
  readAt: Date | null;
  actionTakenAt: Date | null;
  dismissedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**AlertCategory enum:** `PRICE_CHANGE`, `NEW_CHARGE`, `TRIAL_EXPIRATION`, `RENEWAL`, `REPORT`

**AlertSeverity enum:** `INFO` (monthly reports, small changes), `WARNING` (trial expiring, renewal upcoming), `CRITICAL` (large price increase, unexpected charge)
