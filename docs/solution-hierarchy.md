# BillKillAgent — Solution Folder Hierarchy

## Overview

BillKillAgent uses a **pnpm monorepo** managed by **Turborepo** for build orchestration. The codebase is organized into `apps/` (deployable units) and `packages/` (shared libraries).

---

## Root Structure

```
BillKillAgent/
├── apps/                             # Deployable applications
│   ├── web/                          # Next.js 15 frontend (Vercel)
│   └── worker/                       # BullMQ background worker (Railway/AWS)
├── packages/                         # Shared libraries
│   ├── api/                          # tRPC router definitions
│   ├── db/                           # Drizzle ORM schema & migrations
│   ├── services/                     # Core business logic
│   ├── ai/                           # AI & voice orchestration
│   ├── integrations/                 # External service adapters
│   ├── queue/                        # BullMQ queue & job definitions
│   └── shared/                       # Types, validators, utilities
├── e2e/                              # Playwright end-to-end tests
├── docs/                             # Documentation
│   ├── specs/                        # L1 & L2 requirements
│   ├── detailed-designs/             # Feature design documents
│   ├── ui-design.pen                 # UI design file
│   ├── solution-hierarchy.md         # This file
│   └── hosting-costs.md              # Infrastructure cost analysis
├── infra/                            # Infrastructure configuration
├── .github/                          # CI/CD workflows
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml               # pnpm workspace definition
├── package.json                      # Root package.json
├── tsconfig.base.json                # Shared TypeScript config
├── .env.example                      # Environment variable template
├── .gitignore
└── README.md
```

---

## apps/web — Next.js 15 Frontend

The primary user-facing web application. Deployed to Vercel.

```
apps/web/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (unauthenticated)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx                # Minimal auth layout
│   ├── (onboarding)/                 # Onboarding route group
│   │   ├── connect/
│   │   │   └── page.tsx              # Connect bank accounts
│   │   ├── scanning/
│   │   │   └── page.tsx              # Transaction scanning
│   │   ├── discovery/
│   │   │   └── page.tsx              # Savings discovery "aha moment"
│   │   ├── approve/
│   │   │   └── page.tsx              # Action approval
│   │   └── layout.tsx                # Onboarding layout (progress steps)
│   ├── (dashboard)/                  # Authenticated app route group
│   │   ├── page.tsx                  # Dashboard (default)
│   │   ├── subscriptions/
│   │   │   ├── page.tsx              # Subscriptions list
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Subscription detail
│   │   ├── actions/
│   │   │   └── page.tsx              # Action queue
│   │   ├── negotiations/
│   │   │   ├── page.tsx              # Negotiation log
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Negotiation detail
│   │   ├── savings/
│   │   │   └── page.tsx              # Savings tracker
│   │   ├── settings/
│   │   │   └── page.tsx              # Settings
│   │   ├── notifications/
│   │   │   └── page.tsx              # Notification center
│   │   └── layout.tsx                # App shell (sidebar/tabs + header)
│   ├── api/
│   │   ├── trpc/
│   │   │   └── [trpc]/
│   │   │       └── route.ts          # tRPC HTTP handler
│   │   └── webhooks/
│   │       ├── plaid/
│   │       │   └── route.ts          # Plaid webhook endpoint
│   │       └── stripe/
│   │           └── route.ts          # Stripe webhook endpoint
│   ├── layout.tsx                    # Root layout (providers, fonts)
│   ├── globals.css                   # Tailwind base styles
│   └── not-found.tsx
├── components/
│   ├── ui/                           # Shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── toggle.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── app-shell.tsx             # Responsive shell (sidebar/tabs)
│   │   ├── sidebar.tsx               # Desktop sidebar navigation
│   │   ├── bottom-tabs.tsx           # Mobile bottom tab bar
│   │   ├── header.tsx                # Top header with bell + avatar
│   │   └── nav-item.tsx              # Navigation item component
│   ├── dashboard/
│   │   ├── metric-card.tsx           # Summary stat card
│   │   ├── savings-chart.tsx         # Recharts area chart
│   │   ├── pending-actions.tsx       # Action preview list
│   │   └── activity-feed.tsx         # Recent activity timeline
│   ├── subscriptions/
│   │   ├── subscription-filters.tsx  # Category/status filter chips
│   │   ├── subscription-row.tsx      # Table row with usage bar
│   │   ├── subscription-detail.tsx   # Expanded detail view
│   │   └── usage-bar.tsx             # Usage indicator component
│   ├── actions/
│   │   ├── action-tabs.tsx           # Pending/InProgress/Completed tabs
│   │   ├── action-item.tsx           # Action card with approve/dismiss
│   │   └── bulk-approve.tsx          # Approve all button
│   ├── negotiations/
│   │   ├── negotiation-stats.tsx     # Stats cards row
│   │   ├── negotiation-row.tsx       # History row with rates
│   │   └── negotiation-detail.tsx    # Full detail view
│   ├── savings/
│   │   ├── savings-overview.tsx      # Lifetime total + breakdowns
│   │   ├── cumulative-chart.tsx      # Savings over time chart
│   │   ├── category-breakdown.tsx    # Donut chart + list
│   │   └── transfer-history.tsx      # Transfer list
│   ├── settings/
│   │   ├── connected-accounts.tsx    # Bank account list
│   │   ├── autonomy-selector.tsx     # 3-level radio selector
│   │   ├── notification-prefs.tsx    # Toggle switches
│   │   ├── savings-destination.tsx   # Destination account
│   │   └── profile-section.tsx       # Profile + account actions
│   ├── notifications/
│   │   ├── alert-banner.tsx          # Contextual alert banner
│   │   ├── notification-item.tsx     # Individual notification
│   │   ├── notification-bell.tsx     # Bell icon with badge
│   │   └── monthly-report.tsx        # Monthly summary card
│   └── onboarding/
│       ├── welcome-screen.tsx
│       ├── connect-bank.tsx
│       ├── scanning-screen.tsx
│       ├── savings-discovery.tsx
│       └── action-approval.tsx
├── hooks/
│   ├── use-subscriptions.ts
│   ├── use-action-queue.ts
│   ├── use-savings-data.ts
│   ├── use-notifications.ts
│   ├── use-auth.ts
│   ├── use-responsive.ts            # Breakpoint detection
│   └── use-realtime.ts              # WebSocket/SSE updates
├── lib/
│   ├── trpc.ts                      # tRPC client setup
│   ├── supabase.ts                  # Supabase client
│   ├── utils.ts                     # cn() + utility functions
│   └── constants.ts                 # App constants, routes
├── providers/
│   ├── trpc-provider.tsx
│   ├── auth-provider.tsx
│   └── theme-provider.tsx
├── styles/
│   └── fonts.ts                     # Font declarations
├── public/
│   ├── fonts/
│   └── icons/
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## apps/worker — BullMQ Background Worker

Processes async jobs: cancellations, negotiations, scans, monitoring, transfers.

```
apps/worker/
├── src/
│   ├── workers/
│   │   ├── cancellation.worker.ts    # Processes cancellation jobs
│   │   ├── negotiation.worker.ts     # Processes voice negotiation jobs
│   │   ├── scan.worker.ts            # Processes transaction scan jobs
│   │   ├── monitoring.worker.ts      # Processes monitoring/alert jobs
│   │   ├── savings-transfer.worker.ts # Processes savings transfer jobs
│   │   └── notification.worker.ts    # Processes notification delivery jobs
│   ├── index.ts                      # Worker entrypoint
│   └── health.ts                     # Health check endpoint
├── tsconfig.json
├── Dockerfile
└── package.json
```

---

## packages/api — tRPC Router Definitions

Defines all API endpoints as tRPC routers with input validation (Zod).

```
packages/api/
├── src/
│   ├── root.ts                       # Root router (merges all routers)
│   ├── context.ts                    # Request context (user, db, redis)
│   ├── trpc.ts                       # tRPC init + middleware definitions
│   └── routers/
│       ├── auth.router.ts            # signup, login, logout, session
│       ├── subscription.router.ts    # list, get, getDetail, getStats
│       ├── action.router.ts          # list, approve, dismiss, approveAll
│       ├── negotiation.router.ts     # list, get, getStats, getTranscript
│       ├── savings.router.ts         # getSummary, getChart, getBreakdown, getTransfers
│       ├── notification.router.ts    # list, markRead, dismiss, getUnreadCount
│       ├── settings.router.ts        # get, updateAutonomy, updateNotifs, updateProfile
│       ├── plaid.router.ts           # createLinkToken, exchangeToken, getAccounts
│       └── billing.router.ts         # getSubscription, createCheckout, cancelPremium
├── tsconfig.json
└── package.json
```

---

## packages/db — Drizzle ORM Schema & Migrations

Database schema definitions using Drizzle ORM with PostgreSQL.

```
packages/db/
├── src/
│   ├── schema/
│   │   ├── users.ts                  # users, user_settings tables
│   │   ├── accounts.ts              # plaid_items, accounts tables
│   │   ├── transactions.ts          # transactions table
│   │   ├── subscriptions.ts         # subscriptions, waste_flags tables
│   │   ├── actions.ts               # actions, cancellation_attempts tables
│   │   ├── negotiations.ts          # negotiation_sessions table
│   │   ├── savings.ts               # savings_records, savings_destinations, transfers
│   │   ├── notifications.ts         # notifications, user_notification_prefs
│   │   ├── providers.ts             # provider_flows table
│   │   ├── billing.ts               # billing_events table
│   │   └── index.ts                 # Re-exports all schemas
│   ├── migrations/                  # Auto-generated migration files
│   ├── seed.ts                      # Seed script for dev data
│   ├── client.ts                    # Database connection + Drizzle instance
│   └── index.ts                     # Public API
├── drizzle.config.ts                # Drizzle Kit configuration
├── tsconfig.json
└── package.json
```

---

## packages/services — Core Business Logic

Domain services organized by feature. Each service is framework-agnostic.

```
packages/services/
├── src/
│   ├── subscription-discovery/
│   │   ├── recurring-charge-detector.ts
│   │   ├── merchant-enricher.ts
│   │   ├── subscription-factory.ts
│   │   └── index.ts
│   ├── usage-analysis/
│   │   ├── usage-analyzer.ts
│   │   ├── value-scorer.ts
│   │   ├── waste-detector.ts
│   │   ├── overlap-detector.ts
│   │   ├── recommendation-engine.ts
│   │   └── index.ts
│   ├── cancellation/
│   │   ├── cancellation-orchestrator.ts
│   │   ├── browser-automation.ts
│   │   ├── cancellation-flow-runner.ts
│   │   ├── provider-flow-registry.ts
│   │   ├── autonomy-gate.ts
│   │   └── index.ts
│   ├── negotiation/
│   │   ├── negotiation-orchestrator.ts
│   │   ├── strategy-planner.ts
│   │   ├── conversation-state-machine.ts
│   │   ├── retention-offer-evaluator.ts
│   │   ├── transcript-logger.ts
│   │   └── index.ts
│   ├── plan-optimization/
│   │   ├── plan-optimizer.ts
│   │   ├── alternative-discovery.ts
│   │   ├── cost-benefit-analyzer.ts
│   │   ├── plan-switch-executor.ts
│   │   └── index.ts
│   ├── savings/
│   │   ├── savings-calculator.ts
│   │   ├── savings-transfer.ts
│   │   ├── destination-manager.ts
│   │   ├── transfer-scheduler.ts
│   │   └── index.ts
│   ├── monitoring/
│   │   ├── monitoring-scheduler.ts
│   │   ├── price-change-detector.ts
│   │   ├── trial-expiration-tracker.ts
│   │   ├── new-charge-detector.ts
│   │   ├── monthly-report-generator.ts
│   │   └── index.ts
│   └── notification/
│       ├── notification-service.ts
│       ├── template-engine.ts
│       ├── preference-service.ts
│       ├── channels/
│       │   ├── in-app.channel.ts
│       │   ├── push.channel.ts
│       │   ├── email.channel.ts
│       │   └── sms.channel.ts
│       └── index.ts
├── tsconfig.json
└── package.json
```

---

## packages/ai — AI & Voice Orchestration

Claude API integration and real-time voice call management.

```
packages/ai/
├── src/
│   ├── claude/
│   │   ├── client.ts                 # Claude API client wrapper
│   │   ├── prompts/
│   │   │   ├── negotiation-strategy.ts
│   │   │   ├── negotiation-response.ts
│   │   │   ├── subscription-analysis.ts
│   │   │   └── recommendation.ts
│   │   └── index.ts
│   ├── voice/
│   │   ├── voice-call-manager.ts     # Twilio call lifecycle
│   │   ├── speech-to-text.ts         # Deepgram WebSocket stream
│   │   ├── text-to-speech.ts         # ElevenLabs synthesis
│   │   ├── audio-pipeline.ts         # Full audio routing pipeline
│   │   └── index.ts
│   └── agents/
│       ├── negotiation-agent.ts      # Real-time negotiation AI agent
│       └── index.ts
├── tsconfig.json
└── package.json
```

---

## packages/integrations — External Service Adapters

Adapters for all third-party services with clean interfaces.

```
packages/integrations/
├── src/
│   ├── plaid/
│   │   ├── plaid-client.ts           # Plaid API client
│   │   ├── plaid-link.ts             # Link token management
│   │   ├── plaid-transactions.ts     # Transaction sync
│   │   ├── plaid-webhooks.ts         # Webhook verification
│   │   └── index.ts
│   ├── twilio/
│   │   ├── twilio-client.ts          # Twilio REST + voice
│   │   ├── twilio-media-stream.ts    # WebSocket media streams
│   │   └── index.ts
│   ├── deepgram/
│   │   ├── deepgram-client.ts        # Deepgram STT WebSocket
│   │   └── index.ts
│   ├── elevenlabs/
│   │   ├── elevenlabs-client.ts      # ElevenLabs TTS API
│   │   └── index.ts
│   ├── stripe/
│   │   ├── stripe-client.ts          # Stripe payments
│   │   ├── stripe-webhooks.ts        # Webhook handling
│   │   └── index.ts
│   ├── resend/
│   │   ├── resend-client.ts          # Resend email API
│   │   └── index.ts
│   └── browser/
│       ├── playwright-manager.ts     # Playwright session management
│       ├── flows/                    # Provider-specific scripts
│       │   ├── netflix.flow.ts
│       │   ├── hulu.flow.ts
│       │   ├── adobe.flow.ts
│       │   └── generic.flow.ts
│       └── index.ts
├── tsconfig.json
└── package.json
```

---

## packages/queue — BullMQ Queue Definitions

Job queue definitions and type-safe job interfaces.

```
packages/queue/
├── src/
│   ├── queues.ts                     # Queue name constants + creation
│   ├── jobs/
│   │   ├── cancellation.job.ts       # CancellationJobData type + defaults
│   │   ├── negotiation.job.ts
│   │   ├── scan.job.ts
│   │   ├── monitoring.job.ts
│   │   ├── savings-transfer.job.ts
│   │   └── notification.job.ts
│   ├── connection.ts                 # Redis connection config
│   └── index.ts
├── tsconfig.json
└── package.json
```

---

## packages/shared — Shared Types & Utilities

Cross-cutting concerns shared across all packages.

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── subscription.types.ts
│   │   ├── action.types.ts
│   │   ├── negotiation.types.ts
│   │   ├── savings.types.ts
│   │   ├── notification.types.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── auth.validators.ts        # Zod schemas for auth inputs
│   │   ├── subscription.validators.ts
│   │   ├── action.validators.ts
│   │   ├── settings.validators.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── categories.ts            # Subscription categories
│   │   ├── providers.ts             # Known provider list
│   │   ├── autonomy-levels.ts
│   │   └── index.ts
│   └── utils/
│       ├── currency.ts              # Currency formatting
│       ├── date.ts                  # Date helpers
│       ├── percentage.ts            # Percentage calculations
│       └── index.ts
├── tsconfig.json
└── package.json
```

---

## e2e/ — Playwright End-to-End Tests

```
e2e/
├── page-objects/
│   ├── BasePage.ts                   # Base page with common methods
│   ├── WelcomePage.ts
│   ├── ConnectBankPage.ts
│   ├── ScanningPage.ts
│   ├── SavingsDiscoveryPage.ts
│   ├── ActionApprovalPage.ts
│   ├── DashboardPage.ts
│   ├── SubscriptionsPage.ts
│   ├── ActionQueuePage.ts
│   ├── NegotiationLogPage.ts
│   ├── SavingsTrackerPage.ts
│   ├── SettingsPage.ts
│   └── NotificationsPage.ts
├── tests/
│   ├── onboarding.spec.ts
│   ├── dashboard.spec.ts
│   ├── subscriptions.spec.ts
│   ├── action-queue.spec.ts
│   ├── negotiations.spec.ts
│   ├── savings.spec.ts
│   ├── settings.spec.ts
│   └── notifications.spec.ts
├── fixtures/
│   └── test-data.ts                  # Mock data for tests
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## infra/ — Infrastructure Configuration

```
infra/
├── docker-compose.yml                # Local dev: PostgreSQL + Redis
├── docker-compose.test.yml           # Test environment
├── Dockerfile.worker                 # Worker container
├── railway.toml                      # Railway deployment config
├── vercel.json                       # Vercel deployment config
└── .env.example                      # Environment variables template
```

---

## Key Configuration Files

### turbo.json
Defines the build pipeline: `build`, `dev`, `lint`, `typecheck`, `test` tasks with proper dependency ordering.

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "e2e"
```

### tsconfig.base.json
Shared TypeScript configuration with path aliases for `@billkill/api`, `@billkill/db`, `@billkill/services`, etc.

---

## Package Dependency Graph

```
apps/web ──────► packages/api ──────► packages/services
    │                │                      │
    │                ▼                      ▼
    │          packages/db           packages/ai
    │                │               packages/integrations
    │                ▼                      │
    │          packages/shared ◄────────────┘
    │                │
    ▼                ▼
apps/worker ──► packages/queue
```
