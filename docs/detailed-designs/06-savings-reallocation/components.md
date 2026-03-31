# Feature 06: Savings Reallocation -- Components

## SavingsCalculator

Computes exact savings amounts from completed BillKillAgent actions.

**Responsibilities:**
- Calculates savings from cancellations (full subscription cost from effective date)
- Calculates savings from negotiations (rate difference from effective date)
- Calculates savings from plan switches (cost difference minus amortized switching costs)
- Handles prorated mid-cycle savings
- Adjusts for promotional pricing expiration (reduces projected savings when promo ends)
- Detects reactivated subscriptions and stops counting their savings
- Aggregates savings by period (weekly, monthly, annual, lifetime)

**Key Methods:**
- `calculateForAction(actionId: string): Promise<SavingsRecord>` -- Compute savings for one action
- `calculateUnrealizedSavings(userId: string, since: Date): Promise<number>` -- Savings not yet transferred
- `getAggregatedSavings(userId: string, period: Period): Promise<SavingsAggregate>` -- Summary stats
- `recalculate(userId: string): Promise<void>` -- Full recalculation (e.g., after billing verification)

**SavingsAggregate:**
```typescript
{
  totalLifetime: number;         // cents
  totalMonthly: number;          // cents, current month
  totalAnnual: number;           // cents, trailing 12 months
  byCategory: Record<string, number>;  // savings per category
  byActionType: {
    cancellations: number;
    negotiations: number;
    planSwitches: number;
  };
  unrealizedBalance: number;     // cents, not yet transferred
}
```

**Implementation Notes:**
- All monetary values stored and computed as integer cents
- Savings start accruing from the confirmed effective date, not the action date
- Projected future savings flagged separately from realized savings

**Dependencies:** Action history from Features 03, 04, 05; Drizzle ORM

---

## SavingsTransferService

Executes fund transfers from the user's funding account to destination accounts via Plaid ACH.

**Responsibilities:**
- Creates Plaid ACH transfer requests with proper idempotency keys
- Handles split allocations across multiple destination accounts
- Validates transfer amount against calculated savings (safety check)
- Enforces daily transfer limits and minimum thresholds
- Monitors transfer status via Plaid webhooks and polling
- Handles failed transfers with automatic retry logic

**Key Methods:**
- `initiateTransfer(transfer: TransferRequest): Promise<Transfer>` -- Creates ACH transfer
- `handleWebhook(event: PlaidWebhookEvent): Promise<void>` -- Processes Plaid status updates
- `retryFailedTransfer(transferId: string): Promise<Transfer>` -- Retries with new idempotency key
- `cancelTransfer(transferId: string): Promise<void>` -- Cancels pending transfer

**TransferRequest:**
```typescript
{
  userId: string;
  fundingAccountId: string;         // Plaid account ID (source)
  destinationAccountId: string;     // Plaid account ID (destination)
  amountCents: number;
  description: string;              // "BillKillAgent Savings - March 2026"
  idempotencyKey: string;           // UUID for deduplication
  scheduledDate: Date;
}
```

**Dependencies:** Plaid SDK (`plaid`), Drizzle ORM

---

## DestinationAccountManager

Manages the user's configured savings destination accounts and allocation rules.

**Responsibilities:**
- CRUD operations for destination accounts (link via Plaid, configure, remove)
- Manages allocation rules (percentage split across destinations)
- Validates that allocations sum to 100%
- Supports account types: savings, checking, brokerage, credit card, loan
- Handles Plaid re-authentication when access tokens expire
- Stores account metadata (institution name, last 4 digits, account type)

**Key Methods:**
- `addDestination(userId: string, plaidAccountId: string, allocation: number): Promise<Destination>` -- Link account
- `removeDestination(userId: string, destinationId: string): Promise<void>` -- Unlink account
- `updateAllocations(userId: string, allocations: AllocationUpdate[]): Promise<void>` -- Change splits
- `getDestinations(userId: string): Promise<Destination[]>` -- List all destinations
- `validateAllocations(allocations: AllocationUpdate[]): boolean` -- Ensure 100% total

**Destination:**
```typescript
{
  id: string;
  userId: string;
  plaidAccountId: string;
  institutionName: string;
  accountName: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'BROKERAGE' | 'CREDIT_CARD' | 'LOAN';
  last4: string;
  allocationPercent: number;       // 0-100, all destinations must sum to 100
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Dependencies:** Plaid SDK, Drizzle ORM

---

## TransferScheduler

BullMQ-based scheduler that triggers savings transfers at user-configured intervals.

**Responsibilities:**
- Maintains per-user schedule configuration (weekly, biweekly, monthly)
- At each trigger, computes unrealized savings and initiates transfers
- Splits transfer amount across destinations per allocation rules
- Skips transfer if amount is below minimum threshold
- Handles schedule changes (reschedule, pause, resume)
- Logs all scheduling decisions for audit

**Key Methods:**
- `scheduleUser(userId: string, config: ScheduleConfig): Promise<void>` -- Set up recurring job
- `pauseSchedule(userId: string): Promise<void>` -- Temporarily halt transfers
- `resumeSchedule(userId: string): Promise<void>` -- Resume transfers
- `executeScheduledTransfer(userId: string): Promise<TransferBatch>` -- Called by BullMQ

**ScheduleConfig:**
```typescript
{
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  dayOfWeek: number | null;        // 0-6 for weekly/biweekly
  dayOfMonth: number | null;       // 1-28 for monthly
  minimumAmountCents: number;      // default 500 ($5.00)
  isActive: boolean;
}
```

**Dependencies:** BullMQ, SavingsCalculator, SavingsTransferService, DestinationAccountManager

---

## ISavingsDestination

Interface abstracting the destination for savings transfers.

```typescript
interface ISavingsDestination {
  readonly id: string;
  readonly accountType: string;
  readonly displayName: string;
  transfer(amountCents: number, description: string): Promise<TransferResult>;
  getBalance(): Promise<number | null>;
  isAvailable(): Promise<boolean>;
}
```

Implementations:
- **PlaidACHDestination** -- Standard ACH transfer via Plaid Transfer API
- **PlaidPaymentDestination** -- Plaid Payment Initiation for supported institutions
- **ManualDestination** -- User-managed account where BillKillAgent only tracks (no auto-transfer)

---

## Entities

### SavingsRecord

Represents savings attributed to a single completed action.

```typescript
{
  id: string;
  userId: string;
  actionId: string;                  // FK to the action that produced savings
  actionType: 'CANCELLATION' | 'NEGOTIATION' | 'PLAN_SWITCH';
  subscriptionId: string;
  monthlySavingsCents: number;       // recurring monthly savings
  effectiveDate: Date;               // when savings start accruing
  endDate: Date | null;              // null = permanent; set for promo pricing
  totalRealizedCents: number;        // cumulative savings transferred so far
  isActive: boolean;                 // false if subscription reactivated
  createdAt: Date;
  updatedAt: Date;
}
```

### Transfer

Represents a single fund transfer to a destination account.

```typescript
{
  id: string;
  userId: string;
  destinationId: string;             // FK to Destination
  amountCents: number;
  description: string;
  plaidTransferId: string | null;    // Plaid transfer ID
  idempotencyKey: string;
  status: 'SCHEDULED' | 'INITIATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  failureReason: string | null;
  retryCount: number;
  scheduledDate: Date;
  initiatedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```
