# Feature 03: Components -- Autonomous Cancellation

## Services

### CancellationOrchestrator

Top-level coordinator that manages the end-to-end cancellation lifecycle from recommendation to completion.

**Responsibilities:**
- Receives cancellation requests from the recommendation engine or direct user action
- Validates the request against the user's autonomy level via `AutonomyGate`
- Delegates to `CancellationActionFactory` to create the appropriate action
- Monitors action progress and handles completion callbacks
- Manages retries and escalation on failure
- Records outcomes in `cancellation_attempts` and updates subscription status

**Key Methods:**
- `requestCancellation(userId: string, subscriptionId: string, source: ActionSource): Promise<CancellationAction>` -- Entry point for all cancellation requests
- `processApprovedAction(actionId: string): Promise<void>` -- Begins execution of an approved action
- `handleActionComplete(actionId: string, result: ActionResult): Promise<void>` -- Processes completion (success or failure)
- `scheduleRetry(actionId: string, reason: string): Promise<void>` -- Schedules a retry with backoff
- `escalateToManual(actionId: string, reason: string): Promise<void>` -- Marks action for user intervention

**Dependencies:** `AutonomyGate`, `CancellationActionFactory`, `ICancellationStrategy`, BullMQ queue

---

### CancellationActionFactory

Selects the optimal cancellation strategy for a given subscription and creates the action entity.

**Responsibilities:**
- Queries `ProviderFlowRegistry` for available flows for the target provider
- Evaluates strategy feasibility based on available credentials, flow data, and provider support
- Selects the highest-success-rate strategy that is currently available
- Creates and persists the `CancellationAction` entity with the chosen strategy
- Falls back through strategies: Browser -> API -> Email

**Key Methods:**
- `createAction(subscription: Subscription, userId: string): Promise<CancellationAction>` -- Creates an action with the best available strategy
- `selectStrategy(providerName: string): ICancellationStrategy` -- Chooses the optimal strategy
- `evaluateStrategies(providerName: string): StrategyEvaluation[]` -- Ranks all available strategies

**Dependencies:** `ProviderFlowRegistry`, `ICancellationStrategy[]`

---

### BrowserAutomationService

Low-level Playwright wrapper that executes browser-based interactions.

**Responsibilities:**
- Manages Playwright browser instance lifecycle (launch, context creation, cleanup)
- Executes navigation steps with configurable timeouts and retry logic
- Handles common web patterns: cookie banners, popups, CAPTCHAs (escalates if unsolvable)
- Captures screenshots at configurable step intervals
- Implements anti-detection measures (user-agent rotation, viewport randomization)
- Provides structured results for each step execution

**Key Methods:**
- `createSession(options?: SessionOptions): Promise<BrowserSession>` -- Launches a new browser session
- `executeStep(session: BrowserSession, step: FlowStep): Promise<StepResult>` -- Executes a single flow step
- `captureScreenshot(session: BrowserSession, label: string): Promise<string>` -- Takes and stores a screenshot
- `detectPageState(session: BrowserSession, indicators: StateIndicator[]): Promise<PageState>` -- Checks for success/failure indicators
- `closeSession(session: BrowserSession): Promise<void>` -- Cleans up browser resources

**Dependencies:** Playwright, screenshot storage (S3/Supabase Storage)

---

### CancellationFlowRunner

Orchestrates the execution of a complete cancellation flow using `BrowserAutomationService`.

**Responsibilities:**
- Loads the flow definition from `ProviderFlowRegistry`
- Creates a browser session and executes steps sequentially
- Handles branching logic (e.g., retention offer pages, different account types)
- Validates each step's result before proceeding to the next
- Detects cancellation success or failure from confirmation page indicators
- Reports per-step telemetry back to the registry for success rate tracking

**Key Methods:**
- `runFlow(action: CancellationAction, flow: ProviderFlow): Promise<FlowResult>` -- Executes the complete flow
- `executeStepSequence(session: BrowserSession, steps: FlowStep[]): Promise<StepResult[]>` -- Runs steps in order
- `handleBranch(session: BrowserSession, branch: FlowBranch): Promise<FlowStep[]>` -- Resolves conditional paths
- `validateStepResult(result: StepResult, expected: ExpectedState): boolean` -- Checks step success
- `reportTelemetry(flowId: string, results: StepResult[]): Promise<void>` -- Updates success metrics

**Dependencies:** `BrowserAutomationService`, `ProviderFlowRegistry`

---

### ProviderFlowRegistry

Manages versioned cancellation flow definitions for each provider.

**Responsibilities:**
- Stores and retrieves structured flow definitions from the `provider_flows` table
- Supports flow versioning (new versions created when steps change)
- Tracks per-flow success rates based on execution telemetry
- Provides fallback flows for unknown providers (generic cancellation patterns)
- Supports flow lookup by provider name with fuzzy matching

**Key Methods:**
- `getFlow(providerName: string, flowType: FlowType): Promise<ProviderFlow | null>` -- Retrieves the active flow
- `getFlowWithFallback(providerName: string): Promise<ProviderFlow>` -- Returns provider-specific or generic flow
- `updateSuccessRate(flowId: string, succeeded: boolean): Promise<void>` -- Updates success metrics
- `createFlowVersion(flowId: string, steps: FlowStep[]): Promise<ProviderFlow>` -- Creates a new version
- `listFlows(options?: ListOptions): Promise<ProviderFlow[]>` -- Lists flows with filtering

**Dependencies:** PostgreSQL (`provider_flows` table)

---

### AutonomyGate

Evaluates whether a cancellation action can proceed automatically or requires user approval.

**Responsibilities:**
- Loads the user's configured autonomy level
- Evaluates action risk based on subscription value, strategy type, and provider reliability
- For `Manual` level: always requires approval
- For `Supervised` level: auto-approves low-risk actions (low-cost subscriptions with high-success-rate flows)
- For `Autonomous` level: auto-approves all actions, notifies user post-execution
- Creates notification requests when approval is needed

**Key Methods:**
- `evaluateAction(userId: string, action: CancellationAction): Promise<GateDecision>` -- Returns Approved, PendingApproval, or Denied
- `calculateRiskScore(action: CancellationAction): number` -- Assesses action risk (0-100)
- `getUserAutonomyLevel(userId: string): Promise<AutonomyLevel>` -- Retrieves user preference

**Dependencies:** User preferences, notification service

---

## Interfaces

### ICancellationStrategy

Defines a cancellation execution method. Each implementation handles a different channel.

```typescript
interface ICancellationStrategy {
  readonly strategyType: CancellationStrategyType;
  
  canHandle(providerName: string): Promise<boolean>;
  
  execute(action: CancellationAction, context: ExecutionContext): Promise<ActionResult>;
  
  verify(action: CancellationAction): Promise<VerificationResult>;
}
```

**Implementations:**
- `BrowserCancellationStrategy` -- Uses `CancellationFlowRunner` for web-based cancellation
- `APICancellationStrategy` -- Calls provider APIs directly for cancellation
- `EmailCancellationStrategy` -- Sends templated cancellation emails and monitors for confirmation

### IProviderFlow

Defines the structure of a cancellation flow for a specific provider.

```typescript
interface IProviderFlow {
  id: string;
  providerName: string;
  flowType: FlowType;
  steps: FlowStep[];
  successIndicators: StateIndicator[];
  failureIndicators: StateIndicator[];
  successRate: number;
  version: number;
  isActive: boolean;
}
```

---

## Domain Entities

### CancellationAction

Represents a cancellation request and its execution state.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| subscriptionId | uuid | Target subscription |
| userId | uuid | Owning user |
| actionType | enum | `Cancel` (always for this feature) |
| strategy | enum | `Browser`, `API`, `Email` |
| status | enum | See state machine diagram |
| autonomyLevelRequired | enum | `Manual`, `Supervised`, `Autonomous` |
| approvedAt | Date | When approval was granted |
| approvedBy | enum | `User`, `AutonomyGate` |
| createdAt | Date | When the action was created |
| updatedAt | Date | Last status change |

### FlowStep

A single step in a cancellation flow.

| Field | Type | Description |
|---|---|---|
| order | number | Step sequence number |
| action | enum | `Navigate`, `Click`, `Fill`, `Select`, `Wait`, `Screenshot` |
| selector | string | CSS/XPath selector for the target element |
| value | string | Value for fill/select actions |
| url | string | URL for navigate actions |
| waitMs | number | Wait duration for wait actions |
| expectedState | StateIndicator | What the page should look like after this step |
| branches | FlowBranch[] | Conditional next-steps based on page state |

### ActionResult

Outcome of a cancellation execution attempt.

| Field | Type | Description |
|---|---|---|
| actionId | uuid | The action that was executed |
| succeeded | boolean | Whether cancellation was confirmed |
| strategy | enum | Strategy that was used |
| startedAt | Date | Execution start time |
| completedAt | Date | Execution end time |
| screenshotUrls | string[] | Captured screenshot URLs |
| errorMessage | string | Error details if failed |
| retryable | boolean | Whether a retry is worthwhile |
