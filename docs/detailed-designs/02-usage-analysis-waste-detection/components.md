# Feature 02: Components -- Usage Analysis & Waste Detection

## Services

### UsageAnalyzer

Collects and interprets usage signals from transaction data to build a usage profile for each subscription.

**Responsibilities:**
- Analyzes transaction patterns to infer subscription usage intensity
- Tracks charge frequency, amount trends, and recency signals
- Detects correlated transactions that suggest active usage (e.g., in-app purchases)
- Produces a `UsageProfile` summarizing all inferred signals per subscription

**Key Methods:**
- `analyzeUsage(userId: string, subscription: Subscription, transactions: Transaction[]): Promise<UsageProfile>` -- Builds a complete usage profile
- `calculateChargeCadence(transactions: Transaction[]): CadenceMetrics` -- Measures regularity and frequency
- `detectAmountTrend(transactions: Transaction[]): TrendDirection` -- Identifies increasing, stable, or declining spend
- `findCorrelatedTransactions(subscription: Subscription, allTransactions: Transaction[]): Transaction[]` -- Finds related merchant activity

**Dependencies:** `ITransactionRepository`, `ISubscriptionRepository`

---

### ValueScorer

Computes a composite value score (0-100) for each subscription using pluggable scoring strategies.

**Responsibilities:**
- Orchestrates multiple scoring strategies and combines their results with configurable weights
- Normalizes individual dimension scores to the 0-100 range
- Produces an explainable `ValueScore` with per-dimension breakdowns
- Supports A/B testing of alternative strategy weights

**Key Methods:**
- `scoreSubscription(subscription: Subscription, usageProfile: UsageProfile): Promise<ValueScore>` -- Computes the composite score
- `registerStrategy(strategy: IScoringStrategy): void` -- Adds a scoring dimension
- `adjustWeights(weights: StrategyWeights): void` -- Updates dimension weights

**Scoring Strategies (IScoringStrategy implementations):**
- `CostEfficiencyStrategy` -- Compares cost to category median benchmarks, evaluates price trend
- `UsageSignalStrategy` -- Scores based on usage profile (cadence, recency, correlated activity)
- `CategoryEssentialityStrategy` -- Applies base scores by category (utilities=80, entertainment=30)
- `UserEngagementStrategy` -- Evaluates charge stability and multi-account presence

**Dependencies:** `IScoringStrategy[]`, category benchmark data

---

### WasteDetector

Identifies subscriptions that represent financial waste based on value scores and specific waste patterns.

**Responsibilities:**
- Evaluates each subscription against waste criteria
- Creates `WasteFlag` entities with severity levels and estimated savings
- Detects specific waste patterns: unused subscriptions, price creep, free alternatives available
- Calculates estimated annual savings for each waste flag

**Key Methods:**
- `detectWaste(userId: string, subscriptions: SubscriptionWithScore[]): Promise<WasteFlag[]>` -- Runs all waste detection rules
- `checkUnused(subscription: SubscriptionWithScore): WasteFlag | null` -- Flags subscriptions with no usage signals
- `checkPriceCreep(subscription: SubscriptionWithScore, history: Transaction[]): WasteFlag | null` -- Flags significant price increases
- `checkLowValue(subscription: SubscriptionWithScore): WasteFlag | null` -- Flags low value-score subscriptions
- `estimateAnnualSavings(subscription: Subscription, action: RecommendedAction): number` -- Projects yearly savings

**Dependencies:** `ITransactionRepository`, `ValueScorer`

---

### OverlapDetector

Identifies groups of subscriptions that serve overlapping or duplicative purposes.

**Responsibilities:**
- Groups subscriptions by category and functional purpose
- Detects same-category overlap (e.g., Netflix + Hulu + Disney+)
- Detects cross-category functional overlap (e.g., Dropbox + Google Drive)
- Ranks overlapping subscriptions within a group by value score
- Creates waste flags for lower-ranked subscriptions in overlap groups

**Key Methods:**
- `detectOverlaps(subscriptions: SubscriptionWithScore[]): Promise<OverlapGroup[]>` -- Finds all overlap groups
- `groupByCategory(subscriptions: SubscriptionWithScore[]): Map<string, SubscriptionWithScore[]>` -- Groups by category
- `detectFunctionalOverlap(subscriptions: SubscriptionWithScore[]): OverlapGroup[]` -- Uses a predefined functional mapping
- `rankWithinGroup(group: OverlapGroup): SubscriptionWithScore[]` -- Orders by value score descending
- `createOverlapWasteFlags(groups: OverlapGroup[]): WasteFlag[]` -- Generates flags for redundant subscriptions

**Dependencies:** Functional overlap mapping configuration, `ValueScorer`

---

### RecommendationEngine

Synthesizes value scores, waste flags, and overlap analysis into actionable recommendations.

**Responsibilities:**
- Maps analysis results to concrete recommended actions (keep, downgrade, cancel, negotiate)
- Uses Claude API to generate human-readable reasoning for each recommendation
- Prioritizes recommendations by estimated savings impact
- Manages the recommendation lifecycle from creation to resolution

**Key Methods:**
- `generateRecommendations(userId: string, analysisResults: AnalysisResult[]): Promise<Recommendation[]>` -- Produces prioritized recommendations
- `determineAction(score: ValueScore, wasteFlags: WasteFlag[], overlaps: OverlapGroup[]): RecommendedAction` -- Rule-based action selection
- `generateReasoning(subscription: Subscription, action: RecommendedAction, context: AnalysisContext): Promise<string>` -- LLM-powered explanation
- `prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[]` -- Sorts by savings impact

**Dependencies:** `ValueScorer`, `WasteDetector`, `OverlapDetector`, Claude API client

---

## Interfaces

### IUsageDataProvider

Abstracts usage data retrieval, allowing future providers beyond transaction analysis.

```typescript
interface IUsageDataProvider {
  getUsageProfile(
    userId: string,
    subscription: Subscription
  ): Promise<UsageProfile>;
  
  getSupportedSignals(): UsageSignalType[];
}
```

### IScoringStrategy

Defines a single scoring dimension within the composite value scorer.

```typescript
interface IScoringStrategy {
  readonly name: string;
  readonly defaultWeight: number;
  
  score(
    subscription: Subscription,
    usageProfile: UsageProfile,
    context: ScoringContext
  ): Promise<DimensionScore>;
}
```

---

## Domain Types

### ValueScore

Composite score result with per-dimension breakdown.

| Field | Type | Description |
|---|---|---|
| subscriptionId | uuid | Target subscription |
| compositeScore | number | Weighted score 0-100 |
| dimensions | DimensionScore[] | Per-strategy breakdown |
| scoredAt | Date | When the score was computed |
| reasoning | string | LLM-generated explanation |

### DimensionScore

Individual scoring dimension result.

| Field | Type | Description |
|---|---|---|
| strategyName | string | Name of the scoring strategy |
| rawScore | number | Unweighted score 0-100 |
| weight | number | Applied weight (0.0-1.0) |
| weightedScore | number | rawScore * weight |
| factors | string[] | Human-readable contributing factors |

### WasteFlag

Identifies a specific waste pattern for a subscription.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| subscriptionId | uuid | Flagged subscription |
| userId | uuid | Owning user |
| flagType | enum | `Unused`, `LowValue`, `PriceCreep`, `Overlap`, `Duplicate` |
| severity | enum | `Low`, `Medium`, `High`, `Critical` |
| valueScore | number | Score at time of flagging |
| reasoning | string | Explanation of why flagged |
| recommendedAction | enum | `Keep`, `Downgrade`, `Negotiate`, `Cancel` |
| estimatedAnnualSavings | number | Projected yearly savings if action taken |
| overlapGroupId | uuid | Group ID if part of an overlap set |
| createdAt | Date | When the flag was created |
| resolvedAt | Date | When the flag was addressed |

### UsageProfile

Inferred usage data for a subscription.

| Field | Type | Description |
|---|---|---|
| subscriptionId | uuid | Target subscription |
| chargeCadence | CadenceMetrics | Regularity and frequency |
| amountTrend | TrendDirection | `Increasing`, `Stable`, `Declining` |
| lastChargeRecency | number | Days since last charge |
| correlatedTransactionCount | number | Related merchant activity count |
| inferredUsageLevel | enum | `None`, `Low`, `Moderate`, `High` |

### OverlapGroup

A set of subscriptions with overlapping functionality.

| Field | Type | Description |
|---|---|---|
| id | uuid | Group identifier |
| overlapType | enum | `SameCategory`, `FunctionalOverlap`, `Duplicate` |
| category | string | Shared category or functional area |
| subscriptions | SubscriptionWithScore[] | Members ranked by value |
| totalMonthlySpend | number | Combined monthly cost |
| recommendedKeep | uuid[] | Subscription IDs worth keeping |
| potentialSavings | number | Savings from eliminating redundancy |
