# Feature 01: Components — Bank Feed & Subscription Discovery

## Services

### PlaidLinkService

Manages the complete Plaid Link lifecycle from token creation through account connection.

**Responsibilities:**
- Creates Link tokens scoped to the authenticated user with appropriate products (`transactions`) and country codes
- Receives the public token from the frontend after successful Link completion
- Exchanges the public token for a persistent access token via Plaid's `/item/public_token/exchange`
- Persists the `PlaidItem` entity with encrypted access token
- Triggers the initial transaction sync job on successful connection
- Handles Link update mode for re-authentication flows

**Key Methods:**
- `createLinkToken(userId: string, options?: LinkTokenOptions): Promise<string>` — Returns a short-lived Link token for the frontend
- `exchangePublicToken(userId: string, publicToken: string, metadata: PlaidLinkMetadata): Promise<PlaidItem>` — Exchanges token, persists item, enqueues initial sync
- `createUpdateLinkToken(userId: string, plaidItemId: string): Promise<string>` — Creates a Link token in update mode for re-auth

**Dependencies:** `IPlaidAdapter`, `ITransactionRepository`, BullMQ queue

---

### PlaidWebhookHandler

Processes inbound Plaid webhooks, validates their authenticity, and dispatches appropriate actions.

**Responsibilities:**
- Verifies webhook signatures using Plaid's verification key endpoint
- Routes webhook events by type and code to appropriate handlers
- Processes `TRANSACTIONS` webhooks: `SYNC_UPDATES_AVAILABLE`, `INITIAL_UPDATE`, `HISTORICAL_UPDATE`
- Processes `ITEM` webhooks: `ERROR`, `PENDING_EXPIRATION`, `USER_PERMISSION_REVOKED`
- Enqueues sync jobs for transaction webhooks
- Updates `PlaidItem` status for error/expiration webhooks
- Sends user notifications when re-authentication is needed

**Key Methods:**
- `handleWebhook(headers: WebhookHeaders, body: unknown): Promise<void>` — Entry point for all Plaid webhooks
- `verifySignature(headers: WebhookHeaders, body: string): Promise<boolean>` — Validates webhook authenticity
- `handleTransactionSync(itemId: string): Promise<void>` — Enqueues a transaction sync job
- `handleItemError(itemId: string, errorCode: string): Promise<void>` — Updates item status and notifies user

**Dependencies:** `IPlaidAdapter`, `ITransactionRepository`, BullMQ queue, notification service

---

### TransactionSyncService

Performs incremental transaction synchronization using Plaid's cursor-based sync API.

**Responsibilities:**
- Fetches transaction updates (added, modified, removed) from the last known cursor position
- Handles pagination when updates exceed a single response page
- Persists new transactions, updates modified ones, and soft-deletes removed ones
- Updates the cursor position on the `PlaidItem` after successful sync
- Normalizes merchant names on ingested transactions
- Triggers recurring charge detection after sync completion
- Implements idempotent processing (safe to re-run with the same cursor)

**Key Methods:**
- `syncTransactions(plaidItemId: string): Promise<SyncResult>` — Performs a full incremental sync cycle
- `processAdded(transactions: PlaidTransaction[]): Promise<void>` — Upserts new transactions
- `processModified(transactions: PlaidTransaction[]): Promise<void>` — Updates existing transactions
- `processRemoved(transactionIds: string[]): Promise<void>` — Soft-deletes removed transactions

**Dependencies:** `IPlaidAdapter`, `ITransactionRepository`, `MerchantEnricher`, BullMQ queue

**Error Handling:**
- On Plaid API rate limit: exponential backoff via BullMQ retry
- On cursor invalid: reset cursor to empty string (forces full re-sync)
- On partial page failure: does not advance cursor, allowing safe retry

---

### RecurringChargeDetector

Pattern-matching engine that analyzes transaction history to identify recurring charges.

**Responsibilities:**
- Groups transactions by normalized merchant name
- Performs frequency analysis to identify periodic patterns (weekly, biweekly, monthly, quarterly, annual)
- Applies amount clustering to handle variable charges from the same merchant
- Calculates a confidence score (0.0-1.0) for each detected pattern
- Filters out non-subscription transactions (one-time purchases, refunds)
- Deduplicates against existing subscriptions to avoid double-creation

**Key Methods:**
- `detectRecurringCharges(userId: string, transactions: Transaction[]): Promise<DetectedPattern[]>` — Main detection pipeline
- `groupByMerchant(transactions: Transaction[]): Map<string, Transaction[]>` — Groups by normalized merchant
- `analyzeFrequency(transactions: Transaction[]): FrequencyResult | null` — Detects charge frequency
- `clusterAmounts(transactions: Transaction[]): AmountCluster[]` — Identifies amount patterns
- `calculateConfidence(pattern: DetectedPattern): number` — Scores pattern reliability

**Algorithm Overview:**
1. Group all transactions by normalized merchant name
2. For each group with 2+ transactions, compute inter-transaction intervals
3. Match intervals against known frequencies (7d, 14d, 30d, 90d, 365d) with tolerance
4. Cluster amounts to handle minor variations (e.g., $9.99 and $10.62 for tax-included charges)
5. Score confidence based on: number of occurrences, interval consistency, amount stability
6. Filter results with confidence >= 0.5 (lower threshold to favor recall over precision)

**Dependencies:** `ITransactionRepository`, `MerchantEnricher`

---

### MerchantEnricher

Resolves merchant metadata including logos, categories, and canonical names.

**Responsibilities:**
- Normalizes raw merchant names (strip suffixes, normalize case, handle common variations)
- Resolves merchant logos from a built-in mapping and external logo services
- Maps merchants to categories (streaming, utilities, insurance, fitness, etc.)
- Caches enrichment results in Redis to minimize redundant lookups

**Key Methods:**
- `normalizeMerchantName(rawName: string): string` — Produces a canonical merchant identifier
- `enrichMerchant(normalizedName: string): Promise<MerchantInfo>` — Returns full merchant metadata
- `resolveLogoUrl(normalizedName: string): Promise<string | null>` — Fetches merchant logo
- `mapCategory(normalizedName: string, plaidCategories: string[]): string` — Determines subscription category

**Dependencies:** Redis (cache), logo resolution service

---

### SubscriptionFactory

Creates and updates Subscription entities from detected recurring charge patterns.

**Responsibilities:**
- Transforms `DetectedPattern` results into `Subscription` entities
- Deduplicates against existing subscriptions for the same user and merchant
- Sets initial subscription status based on confidence score
- Links subscriptions to the originating account and transactions

**Key Methods:**
- `createFromPatterns(userId: string, patterns: DetectedPattern[]): Promise<Subscription[]>` — Batch creates subscriptions from detected patterns
- `updateExisting(subscription: Subscription, pattern: DetectedPattern): Promise<Subscription>` — Updates amount, frequency, and last-charged date
- `deduplicatePatterns(patterns: DetectedPattern[], existing: Subscription[]): DetectedPattern[]` — Filters already-tracked subscriptions

**Dependencies:** `ISubscriptionRepository`, `MerchantEnricher`

---

## Interfaces

### IPlaidAdapter

Abstracts all Plaid API interactions, enabling testing with mock implementations.

```typescript
interface IPlaidAdapter {
  createLinkToken(userId: string, options?: LinkTokenOptions): Promise<string>;
  exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string }>;
  syncTransactions(accessToken: string, cursor: string): Promise<TransactionSyncResponse>;
  getItem(accessToken: string): Promise<PlaidItemInfo>;
  removeItem(accessToken: string): Promise<void>;
  verifyWebhookSignature(body: string, headers: WebhookHeaders): Promise<boolean>;
}
```

### ITransactionRepository

Data access interface for transactions and Plaid items.

```typescript
interface ITransactionRepository {
  upsertTransactions(transactions: Transaction[]): Promise<void>;
  updateTransactions(transactions: Transaction[]): Promise<void>;
  softDeleteTransactions(plaidTransactionIds: string[]): Promise<void>;
  getTransactionsByUser(userId: string, options?: QueryOptions): Promise<Transaction[]>;
  getTransactionsByMerchant(userId: string, normalizedMerchant: string): Promise<Transaction[]>;
  getPlaidItem(plaidItemId: string): Promise<PlaidItem | null>;
  updatePlaidItemCursor(plaidItemId: string, cursor: string): Promise<void>;
  updatePlaidItemStatus(plaidItemId: string, status: PlaidItemStatus): Promise<void>;
}
```

### ISubscriptionRepository

Data access interface for subscription entities.

```typescript
interface ISubscriptionRepository {
  create(subscription: NewSubscription): Promise<Subscription>;
  createMany(subscriptions: NewSubscription[]): Promise<Subscription[]>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription>;
  findByUser(userId: string): Promise<Subscription[]>;
  findByUserAndMerchant(userId: string, normalizedMerchant: string): Promise<Subscription | null>;
  findActive(userId: string): Promise<Subscription[]>;
}
```

---

## Domain Entities

### PlaidItem

Represents a connected financial institution link.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| userId | uuid | Owning user |
| plaidItemId | string | Plaid's item identifier |
| accessToken | string | Encrypted Plaid access token |
| institutionName | string | Display name of the bank |
| institutionLogo | string | URL to institution logo |
| status | enum | `Pending`, `Active`, `NeedsReauth`, `Error`, `Disconnected` |
| cursor | string | Last sync cursor position |
| errorCode | string | Plaid error code if in error state |
| consentedAt | Date | When user granted access |

### Transaction

Represents a single financial transaction.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| accountId | uuid | Linked account |
| userId | uuid | Owning user |
| plaidTransactionId | string | Plaid's transaction identifier |
| amount | number | Transaction amount (positive = debit) |
| currencyCode | string | ISO currency code |
| date | Date | Transaction date |
| merchantName | string | Raw merchant name from Plaid |
| normalizedMerchant | string | Canonical merchant identifier |
| category | string[] | Plaid category hierarchy |
| pending | boolean | Whether the transaction is still pending |

### Subscription

Represents a detected recurring charge pattern.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| userId | uuid | Owning user |
| merchantName | string | Display merchant name |
| normalizedMerchant | string | Canonical merchant identifier |
| logoUrl | string | Merchant logo URL |
| category | string | Subscription category |
| estimatedAmount | number | Average charge amount |
| frequency | enum | `Weekly`, `Biweekly`, `Monthly`, `Quarterly`, `Annual` |
| confidenceScore | number | Detection confidence (0.0-1.0) |
| status | enum | `Detected`, `Confirmed`, `Cancelled`, `Paused` |
| firstSeenAt | Date | Earliest matching transaction |
| lastChargedAt | Date | Most recent matching transaction |
