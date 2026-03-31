# Feature 05: Plan Optimization & Switching -- Components

## PlanOptimizer

Top-level service that orchestrates plan optimization analysis for a given subscription.

**Responsibilities:**
- Loads current subscription details including plan, cost, usage metrics, and contract terms
- Coordinates discovery of same-provider and cross-provider alternatives
- Invokes cost-benefit analysis for each candidate plan
- Ranks alternatives by net savings and generates user-facing recommendations
- Stores recommendations in PostgreSQL with status tracking

**Key Methods:**
- `analyzeSubscription(subscriptionId: string): Promise<PlanComparison[]>` -- Full analysis for one subscription
- `analyzeAll(userId: string): Promise<Map<string, PlanComparison[]>>` -- Batch analysis for all user subscriptions
- `rankAlternatives(comparisons: PlanComparison[]): PlanComparison[]` -- Sorts by net benefit score

**Dependencies:** AlternativeDiscoveryService, CostBenefitAnalyzer, ProviderPlanCatalog, Usage data from Feature 02

---

## AlternativeDiscoveryService

Discovers available plan alternatives for a given subscription, both from the same provider and from competitors.

**Responsibilities:**
- Queries ProviderPlanCatalog for same-provider plan options
- Queries ProviderPlanCatalog for competitor plans in the same service category
- Filters plans by geographic availability (ZIP code based)
- Filters plans by minimum feature requirements (e.g., minimum internet speed)
- Normalizes plan data into comparable format

**Key Methods:**
- `findSameProviderPlans(providerId: string, category: string): Promise<Plan[]>` -- Plans from current provider
- `findCompetitorPlans(category: string, zipCode: string): Promise<Plan[]>` -- Plans from competitors
- `filterByRequirements(plans: Plan[], requirements: PlanRequirements): Plan[]` -- Eliminates unsuitable plans

**Dependencies:** ProviderPlanCatalog, IPlanDataSource implementations

---

## CostBenefitAnalyzer

Produces detailed financial comparison between the current plan and each alternative.

**Responsibilities:**
- Calculates monthly and annual cost difference
- Factors in switching costs (ETF, installation, equipment, deposits)
- Handles promotional pricing (computes blended cost over 12 and 24 months)
- Identifies feature gaps between current and proposed plan
- Computes net present value of the switch over multiple time horizons
- Generates a composite score (0-100) weighting savings, risk, and convenience

**Key Methods:**
- `analyze(current: CurrentPlan, alternative: Plan): PlanComparison` -- Core comparison
- `calculateSwitchingCosts(current: CurrentPlan, alternative: Plan): SwitchingCosts` -- All one-time costs
- `projectCosts(plan: Plan, months: number): CostProjection` -- Total cost over N months including promo expiry
- `computeScore(comparison: PlanComparison): number` -- Composite benefit score

**PlanComparison:**
```typescript
{
  currentPlan: CurrentPlan;
  alternativePlan: Plan;
  monthlySavings: number;
  annualSavings: number;
  switchingCosts: SwitchingCosts;
  netSavings12Month: number;
  netSavings24Month: number;
  featureGaps: FeatureGap[];
  featureGains: FeatureGain[];
  score: number;                    // 0-100 composite score
  confidenceLevel: number;          // 0-100 based on data freshness
  recommendation: 'STRONG' | 'MODERATE' | 'WEAK' | 'NOT_RECOMMENDED';
}
```

**Dependencies:** None (pure computation)

---

## PlanSwitchExecutor

Executes an approved plan switch, handling both same-provider changes and cross-provider migrations.

**Responsibilities:**
- Determines execution strategy: API call, portal automation, or voice call
- For same-provider switches: calls provider API or delegates to Feature 04 voice agent
- For cross-provider switches: coordinates new service signup and old service cancellation (Feature 03)
- Manages service overlap period to prevent gaps in coverage
- Verifies successful switch by monitoring subsequent billing transactions
- Updates subscription record with new plan details

**Key Methods:**
- `executeSameProviderSwitch(subscriptionId: string, newPlanId: string): Promise<SwitchResult>` -- Plan change within provider
- `executeCrossProviderSwitch(subscriptionId: string, newPlan: Plan): Promise<SwitchResult>` -- Full migration
- `verifySwitch(subscriptionId: string): Promise<VerificationResult>` -- Confirms via billing check
- `rollbackSwitch(switchId: string): Promise<void>` -- Reverts if verification fails

**SwitchResult:**
```typescript
{
  switchId: string;
  status: 'COMPLETED' | 'PENDING_VERIFICATION' | 'FAILED' | 'REQUIRES_USER_ACTION';
  newPlanDetails: Plan;
  confirmationNumber: string | null;
  effectiveDate: Date;
  userActionRequired: string | null;   // e.g., "Complete credit check at provider website"
}
```

**Dependencies:** Feature 03 (Cancellation), Feature 04 (Voice Negotiation), Provider APIs

---

## ProviderPlanCatalog

Centralized repository of plan data across all tracked providers. Refreshed by scheduled scraping jobs and manual curation.

**Responsibilities:**
- Stores and indexes plans by provider, category, and geographic availability
- Provides query interface for plan discovery
- Tracks data freshness per provider (last updated timestamp)
- Normalizes pricing (monthly, annual, promotional) into consistent schema
- Manages plan feature taxonomy (speed tiers, data caps, channel counts, etc.)

**Key Methods:**
- `getPlans(providerId: string, category?: string): Promise<Plan[]>` -- Query plans
- `getPlansByCategory(category: string, zipCode: string): Promise<Plan[]>` -- Cross-provider query
- `refreshProvider(providerId: string): Promise<void>` -- Trigger catalog update
- `getDataFreshness(providerId: string): Date` -- Last update time

**Plan Schema:**
```typescript
{
  id: string;
  providerId: string;
  providerName: string;
  planName: string;
  category: ServiceCategory;        // INTERNET | MOBILE | STREAMING | INSURANCE | UTILITIES
  monthlyCost: number;
  promoCost: number | null;
  promoDurationMonths: number | null;
  contractLengthMonths: number | null;
  earlyTerminationFee: number | null;
  features: Record<string, string | number | boolean>;
  availableZipCodes: string[] | null;  // null = nationwide
  lastVerified: Date;
  sourceUrl: string;
}
```

**Dependencies:** IPlanDataSource implementations, Drizzle ORM (PostgreSQL)

---

## IPlanDataSource

Interface for plan data ingestion from various sources.

```typescript
interface IPlanDataSource {
  readonly providerIds: string[];
  fetchPlans(providerId: string): Promise<Plan[]>;
  getLastUpdated(providerId: string): Date | null;
  isAvailable(): Promise<boolean>;
}
```

Implementations:
- **ProviderAPIPlanSource** -- Fetches from provider APIs where available
- **WebScrapingPlanSource** -- Scrapes provider pricing pages via Puppeteer
- **ManualPlanSource** -- Reads from manually curated JSON/CSV files
- **CommunityPlanSource** -- Aggregates anonymized plan data from users

---

## PlanComparison (Entity)

Persisted recommendation record in PostgreSQL.

```typescript
{
  id: string;
  userId: string;
  subscriptionId: string;
  currentPlanSummary: string;
  alternativePlanId: string;
  alternativeProviderName: string;
  monthlySavings: number;
  annualSavings: number;
  netSavings12Month: number;
  score: number;
  recommendation: string;
  status: 'DISCOVERED' | 'PRESENTED' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'DISMISSED';
  presentedAt: Date | null;
  approvedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```
