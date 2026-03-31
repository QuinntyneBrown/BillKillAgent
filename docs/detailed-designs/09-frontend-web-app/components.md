# Feature 09: Components

## Layout Components

### AppShell

**Path**: `apps/web/components/layout/AppShell.tsx`

The root layout component for authenticated pages. Manages the responsive switch between sidebar (desktop) and tab bar (mobile).

**Props**: `children: React.ReactNode`

**Behavior**:
- At 1024px+: Renders `<Sidebar>` on the left (240px fixed width) and `<main>` content area to the right with `<TopHeader>` above it.
- At 768-1023px: Renders a collapsed `<Sidebar>` (64px, icon-only) that expands on hover.
- Below 768px: Renders `<TopHeader>` at top and `<TabBar>` fixed at bottom. No sidebar.
- Uses `useMediaQuery` hook to determine breakpoint. SSR renders desktop layout; client hydration adjusts.
- Content area has horizontal padding of 24px (desktop) / 16px (mobile) and a max-width of 1400px centered.

### Sidebar

**Path**: `apps/web/components/layout/Sidebar.tsx`

Fixed vertical navigation for desktop viewports.

**Structure**:
- Logo section (top): BillKillAgent logomark + wordmark
- Navigation links: Dashboard, Subscriptions, Action Queue, Negotiations, Savings, Settings
- Each link: icon (Lucide) + label text + optional badge (e.g., pending action count on Action Queue)
- Active link: orange left border (3px `#FF5C00`), background `#1C1C21`
- User section (bottom): Avatar circle, display name, notification bell with unread badge

**Props**: `collapsed?: boolean`

### TabBar

**Path**: `apps/web/components/layout/TabBar.tsx`

Fixed bottom navigation for mobile viewports.

**Structure**:
- Five tabs: Dashboard, Subscriptions, Actions, Savings, Settings
- Each tab: icon (24px Lucide) + label (12px Inter)
- Active tab: icon and label colored `#FF5C00`; inactive: `#8A8A8E`
- Badge on Actions tab showing pending count
- Height: 64px + safe area inset bottom
- Background: `#141417` with top border `#2A2A2F`

### TopHeader

**Path**: `apps/web/components/layout/TopHeader.tsx`

Horizontal header bar displayed above the content area.

**Structure**:
- Left: Page title (h1, Instrument Serif 24px) on desktop; hamburger menu + logo on mobile
- Right: Notification bell (with unread badge), user avatar (32px circle)
- Height: 64px
- Background: transparent (blends with page bg) on desktop; `#0A0A0B` on mobile

---

## Page Components

### DashboardPage

**Path**: `apps/web/app/(app)/dashboard/page.tsx`

The primary hub after login. Server component that prefetches summary data.

**Sections**:
1. **Greeting header**: "Good morning, {name}" with current date (Inter 14px secondary)
2. **MetricCard row**: Three cards in a responsive grid (3-col desktop, stacked mobile)
3. **SavingsChart**: Area chart below metrics
4. **Two-column layout** (desktop) / stacked (mobile): PendingActions (left/top) + ActivityFeed (right/bottom)

#### MetricCard

**Path**: `apps/web/components/dashboard/MetricCard.tsx`

Displays a single summary metric.

**Props**:
- `label: string` -- e.g., "Monthly Recurring Spend"
- `value: number` -- Dollar amount
- `trend?: { direction: 'up' | 'down'; percent: number }` -- Optional trend indicator
- `variant?: 'default' | 'accent' | 'success'` -- Color scheme

**Rendering**:
- Card bg `#141417`, rounded-xl, padding 24px
- Label: Inter 14px `#8A8A8E`
- Value: DM Mono 36px `#FFFFFF` (or accent/success color), formatted as currency
- Trend: Arrow icon + percentage, green for savings going up, red for spend going up

#### SavingsChart

**Path**: `apps/web/components/dashboard/SavingsChart.tsx`

Recharts area chart showing savings over the last 6 months.

**Props**: `data: Array<{ month: string; amount: number }>`

**Rendering**:
- Recharts `<AreaChart>` with gradient fill from `#FF5C00` (20% opacity) to transparent
- Stroke: `#FF5C00` 2px
- X-axis: month labels (Inter 12px `#555558`)
- Y-axis: dollar amounts (DM Mono 12px `#555558`)
- Tooltip: Custom styled with card bg, showing month + dollar amount
- Responsive: fills container width, height 240px (desktop) / 180px (mobile)

#### PendingActions

**Path**: `apps/web/components/dashboard/PendingActions.tsx`

Preview list of top 3-5 pending actions with quick-approve buttons.

**Props**: `actions: PendingAction[]`

**Structure per action**:
- Provider logo (32px) + name + action type badge
- Estimated savings (DM Mono, `#00C48C`)
- "Approve" button (accent orange, small) + "Dismiss" link
- "View All" link at bottom navigating to `/actions`

**Interactions**:
- Approve button: calls `trpc.action.approve.useMutation()` with optimistic removal from list
- Dismiss: calls `trpc.action.dismiss.useMutation()`

#### ActivityFeed

**Path**: `apps/web/components/dashboard/ActivityFeed.tsx`

Chronological list of the 5 most recent activities.

**Props**: `activities: Activity[]`

**Structure per activity**:
- Icon (color-coded by type: green check for completed, blue phone for negotiation, amber alert for detection)
- Description text (Inter 14px)
- Timestamp (Inter 12px `#555558`, relative: "2 hours ago")

---

### SubscriptionsPage

**Path**: `apps/web/app/(app)/subscriptions/page.tsx`

Full subscription list with filtering, sorting, and detail expansion.

#### FilterBar

**Path**: `apps/web/components/subscriptions/FilterBar.tsx`

Horizontal filter controls above the subscription table.

**Props**:
- `categories: string[]` -- Available categories
- `onFilterChange: (filters: Filters) => void`

**Structure**:
- Category filter: Horizontal scrollable chip group (e.g., "Streaming", "Software", "Utilities"). Multi-select. Active chips have orange border.
- Status filter: Chip group ("Active", "Flagged", "Cancelled")
- Sort dropdown: "Cost (High-Low)", "Value Score", "Date Added"
- Search input: Text field with search icon, debounced 300ms
- On mobile: Collapses to a single row with a filter icon that opens a bottom sheet

#### SubscriptionTable

**Path**: `apps/web/components/subscriptions/SubscriptionTable.tsx`

Container for subscription rows. Desktop renders as a table; mobile renders as a card list.

**Props**: `subscriptions: Subscription[]; filters: Filters`

**Desktop layout** (1024px+): Table with columns -- Provider, Cost/mo, Category, Usage, Value Score, Action
**Mobile layout**: Stacked cards with key info (logo, name, cost, action badge)

#### SubscriptionRow

**Path**: `apps/web/components/subscriptions/SubscriptionRow.tsx`

A single subscription entry.

**Props**: `subscription: Subscription; onExpand: () => void`

**Structure**:
- Provider logo (40px, rounded) + name (Inter 16px 500)
- Monthly cost (DM Mono 16px)
- Category tag (pill badge, muted bg)
- Usage bar: Horizontal bar (height 6px) showing usage percentage. Color gradient from red (low usage) through amber to green (high usage). Percentage label right-aligned.
- Value score: Numeric 0-100 (DM Mono 14px). Color: green (70+), amber (40-69), red (0-39).
- Action badge: "Cancel" (red), "Negotiate" (orange), "Switch" (blue), "Keep" (green). Pill shape.
- Click/tap to expand to `SubscriptionDetail`

#### SubscriptionDetail

**Path**: `apps/web/components/subscriptions/SubscriptionDetail.tsx`

Expanded view for a single subscription.

**Props**: `subscription: Subscription; onClose: () => void`

**Desktop**: Inline expansion below the row (accordion style)
**Mobile**: Full-screen modal with close button

**Sections**:
1. **Header**: Large logo + name + status
2. **Usage History**: Mini bar chart (last 90 days, weekly buckets)
3. **Cost History**: Line showing last 6 charges with any price changes highlighted
4. **Warnings**: Overlap/duplicate alerts if any (yellow banner)
5. **Alternatives**: Suggested alternative services with price comparison
6. **Actions**: Full-width buttons -- "Cancel Subscription", "Negotiate Price", "Switch Plan", "Dismiss Flag"

---

### ActionQueuePage

**Path**: `apps/web/app/(app)/actions/page.tsx`

Tabbed view of all user actions across lifecycle stages.

#### TabGroup

**Path**: `apps/web/components/actions/TabGroup.tsx`

Tab switcher for action states.

**Props**:
- `tabs: Array<{ id: string; label: string; count: number }>`
- `activeTab: string`
- `onTabChange: (id: string) => void`

**Structure**:
- Three tabs: "Pending" / "In Progress" / "Completed"
- Each tab shows a badge with the item count (DM Mono 12px, orange bg for non-zero)
- Active tab: bottom border `#FF5C00` 2px, white text. Inactive: `#8A8A8E` text.
- On mobile: full-width, evenly spaced. Swipe-to-switch gesture supported.

#### ActionItem

**Path**: `apps/web/components/actions/ActionItem.tsx`

A single action card. Appearance varies by tab context.

**Props**: `action: Action; variant: 'pending' | 'in_progress' | 'completed'`

**Pending variant**:
- Provider logo + name + action type (Inter 14px uppercase `#8A8A8E`)
- Estimated savings (DM Mono 20px `#00C48C`)
- Risk indicator (low/medium/high with color dot)
- "Approve" button (orange filled) + "Dismiss" button (ghost/outline)

**In-Progress variant**:
- Provider logo + name + action type
- Status text: "Calling provider...", "Navigating cancellation flow...", etc. (Inter 14px)
- Animated progress bar (indeterminate or percentage-based, orange)
- Elapsed time since start

**Completed variant**:
- Provider logo + name + action type
- Outcome badge: "Success" (green), "Partial" (amber), "Failed" (red)
- Savings achieved (DM Mono 20px `#00C48C`) or "No savings" in muted text
- Completion date (Inter 12px `#555558`)
- "View Details" link

---

### NegotiationLogPage

**Path**: `apps/web/app/(app)/negotiations/page.tsx`

History of AI-conducted negotiations with outcomes.

#### StatsCards

**Path**: `apps/web/components/negotiations/StatsCards.tsx`

Summary statistics displayed in a row above the negotiation list.

**Props**: `stats: { totalNegotiations: number; successRate: number; totalSavings: number }`

**Structure**: Three `MetricCard`-style elements:
- "Total Negotiations" -- count (DM Mono)
- "Success Rate" -- percentage with color coding (green 70%+, amber 40-69%, red <40%)
- "Total Savings" -- dollar amount (DM Mono, `#00C48C`)

#### NegotiationRow

**Path**: `apps/web/components/negotiations/NegotiationRow.tsx`

A single negotiation entry in the log.

**Props**: `negotiation: NegotiationSession; onSelect: () => void`

**Structure**:
- Provider logo (40px) + name (Inter 16px 500)
- Date (Inter 14px `#8A8A8E`)
- Original rate (DM Mono 14px, strikethrough `#8A8A8E`) -> New rate (DM Mono 14px `#FFFFFF`)
- Monthly savings (DM Mono 16px `#00C48C`)
- Outcome badge: "Success" / "Partial" / "Failed" (same color scheme as ActionItem completed)
- Click to expand `NegotiationDetail`

#### NegotiationDetail

**Path**: `apps/web/components/negotiations/NegotiationDetail.tsx`

Full detail view for a negotiation.

**Props**: `negotiation: NegotiationSession; onClose: () => void`

**Sections**:
1. **Header**: Provider name, date/time, duration
2. **Rate Comparison**: Original vs. new rate with visual bar comparison
3. **Savings Summary**: Monthly and annual savings calculated
4. **Transcript Summary**: Key points from the negotiation (AI-generated summary)
5. **Retention Offers**: Any offers received during the negotiation
6. **Outcome**: Final status with explanation

---

### SavingsTrackerPage

**Path**: `apps/web/app/(app)/savings/page.tsx`

Comprehensive savings visualization and transfer tracking.

#### SavingsOverview

**Path**: `apps/web/components/savings/SavingsOverview.tsx`

Hero section with lifetime savings.

**Props**: `data: { lifetime: number; monthly: number; annual: number; destination?: string }`

**Structure**:
- Lifetime savings: Large DM Mono 48px `#00C48C` centered
- Monthly / Annual toggle (segmented control) showing the current period amount
- Destination label: "Saving to: {account name}" (Inter 14px `#8A8A8E`) if configured

#### SavingsChart (Tracker)

**Path**: `apps/web/components/savings/SavingsChart.tsx`

Cumulative area chart of savings over time.

**Props**: `data: TimeSeriesData[]; view: 'achieved' | 'projected'`

**Structure**:
- Recharts `<AreaChart>` with cumulative savings line
- Toggle control: "Achieved" (solid fill) vs. "Projected" (dashed line extension)
- Achieved fill: gradient `#00C48C` to transparent
- Projected: dashed stroke `#00C48C` at 50% opacity
- Monthly x-axis, dollar y-axis
- Full-width, height 280px (desktop) / 200px (mobile)

#### CategoryBreakdown

**Path**: `apps/web/components/savings/CategoryBreakdown.tsx`

Donut chart + list breakdown of savings by category.

**Props**: `data: Array<{ category: string; amount: number; percent: number; color: string }>`

**Structure**:
- Left (desktop) / top (mobile): Recharts `<PieChart>` donut with total savings in center
- Right (desktop) / bottom (mobile): Ordered list of categories with color dot, name, amount, and percentage
- Max 8 categories; remaining grouped as "Other"

#### TransferHistory

**Path**: `apps/web/components/savings/TransferHistory.tsx`

Table/list of automated savings transfers.

**Props**: `transfers: Transfer[]`

**Structure per row**:
- Date (Inter 14px)
- Amount (DM Mono 16px)
- Destination account name + last 4 digits
- Status badge: "Completed" (green), "Pending" (amber), "Failed" (red)

---

### SettingsPage

**Path**: `apps/web/app/(app)/settings/page.tsx`

Stacked sections for all user configuration.

#### ConnectedAccounts

**Path**: `apps/web/components/settings/ConnectedAccounts.tsx`

List of linked bank accounts and credit cards.

**Props**: `accounts: PlaidItem[]`

**Structure per account**:
- Institution logo (32px) + name + last 4 digits of primary account
- Connection status: "Connected" (green dot) / "Error" (red dot + "Reconnect" link)
- Disconnect button (ghost, red text)
- "Add Account" button at bottom (outline, accent orange)

#### AutonomySelector

**Path**: `apps/web/components/settings/AutonomySelector.tsx`

Three-option radio group for autonomy level.

**Props**:
- `currentLevel: AutonomyLevel`
- `threshold: number`
- `onLevelChange: (level: AutonomyLevel) => void`
- `onThresholdChange: (value: number) => void`

**Structure**:
- Three radio cards (vertical stack), each with:
  - Radio indicator + title (Inter 16px 600)
  - Description paragraph (Inter 14px `#8A8A8E`)
- **Supervised**: "We'll ask before taking any action"
- **Semi-Autonomous**: "Auto-execute savings under your threshold" -- shows a slider (range $5-$500, step $5) when selected
- **Fully Autonomous**: "We handle everything automatically" -- shows a confirmation warning banner when selected

#### NotificationToggles

**Path**: `apps/web/components/settings/NotificationToggles.tsx`

Grouped toggle switches for notification channels and event types.

**Props**: `settings: UserSettings; onChange: (key: string, value: boolean) => void`

**Structure**:
- **Channels section**: Push Notifications, Email Digests, SMS Alerts -- each with a toggle switch
- **Events section** (shown per enabled channel): Price Increases, Trial Expirations, Negotiation Outcomes, Monthly Reports -- each with a toggle switch
- Toggles use Shadcn/ui `<Switch>` component styled with orange accent

#### SavingsDestination

**Path**: `apps/web/components/settings/SavingsDestination.tsx`

Configure where saved money is redirected.

**Props**: `destination?: SavingsDestination; onUpdate: () => void`

**Structure**:
- Current destination display: Account name + institution + last 4 digits (or "Not configured")
- "Change Destination" button opening a connected accounts selector
- Auto-transfer toggle with frequency dropdown (Weekly / Biweekly / Monthly)

#### ProfileSection

**Path**: `apps/web/components/settings/ProfileSection.tsx`

User profile and account management.

**Props**: `user: User; onUpdate: () => void`

**Structure**:
- Avatar (64px circle) with camera icon overlay for upload
- Display name (editable text field)
- Email (read-only, Inter 14px `#8A8A8E`)
- Plan badge: "Free" or "Premium" with upgrade CTA if free
- Action links: "Change Password", "Log Out" (accent), "Delete Account" (red, opens confirmation dialog)

---

### OnboardingFlow

**Path**: `apps/web/app/(onboarding)/layout.tsx` + individual page files

Multi-step onboarding sequence rendered in a special layout without sidebar/tabbar.

**Layout**: Centered content (max-width 600px), progress indicator at top (5 dots, filled up to current step), BillKillAgent logo above.

**Steps**:

1. **Welcome** (`/connect-bank` redirect from signup): Brief value proposition + "Let's get started" CTA
2. **ConnectBank** (`/connect-bank`): Security assurances + "Connect with Plaid" button. Opens Plaid Link modal.
3. **Scanning** (`/scanning`): Animated progress indicator. Polls `trpc.plaid.getSyncStatus` until transactions are processed. Auto-advances when complete.
4. **Discovery** (`/discovery`): Hero savings number + summary cards. "Review & Save" CTA.
5. **ActionApproval** (`/approve`): Grouped action list with approve/dismiss per item + "Approve All" button. "Go to Dashboard" CTA at bottom.

**State persistence**: Onboarding progress is tracked via the `users.status` column (`onboarding` -> `active`). If a user drops off, they resume from where they left off on next login.

---

### NotificationsPage

**Path**: `apps/web/app/(app)/notifications/page.tsx`

Full notification center.

#### AlertBanner

**Path**: `apps/web/components/notifications/AlertBanner.tsx`

Contextual alert banner displayed at the top of relevant pages.

**Props**:
- `severity: 'info' | 'warning' | 'critical'`
- `title: string`
- `body?: string`
- `actionLabel?: string`
- `onAction?: () => void`
- `onDismiss: () => void`

**Rendering**:
- Full-width bar with left color accent strip (blue info, amber warning, red critical)
- Background: slightly tinted version of the severity color at 10% opacity
- Icon (left) + title (Inter 14px 600) + body (Inter 14px) + action button (accent) + dismiss X
- Dismissible: stores dismissed ID in local storage to prevent re-showing

#### NotificationItem

**Path**: `apps/web/components/notifications/NotificationItem.tsx`

A single notification entry.

**Props**: `notification: Notification; onRead: () => void`

**Structure**:
- Icon (type-specific: bell, dollar, phone, alert)
- Title (Inter 14px 500) + body (Inter 14px `#8A8A8E`)
- Timestamp (Inter 12px `#555558`, relative)
- Unread indicator: orange dot (left side)
- Click marks as read and navigates to `action_url` if present

#### MonthlyReportCard

**Path**: `apps/web/components/notifications/MonthlyReportCard.tsx`

Monthly savings summary card.

**Props**: `report: MonthlyReport`

**Structure**:
- Card (wider than standard, `#141417` bg)
- Header: "March 2026 Report" (Instrument Serif 20px)
- Grid of stats: Total Saved, Actions Taken, New Charges Detected
- Top recommendation for next month (highlighted box)
- "Share" button (generates a shareable image/link for social proof)

---

## Hooks

### useAuth

**Path**: `apps/web/hooks/useAuth.ts`

Wraps Supabase Auth client state.

**Returns**:
- `user: SupabaseUser | null` -- Current authenticated user
- `session: Session | null` -- Current session with tokens
- `isLoading: boolean` -- True during initial session check
- `signOut: () => Promise<void>` -- Signs out and redirects to `/login`
- `isAuthenticated: boolean` -- Convenience derived boolean

### useSubscriptions

**Path**: `apps/web/hooks/useSubscriptions.ts`

Manages subscription list data with filtering and sorting.

**Params**: `filters?: SubscriptionFilters`

**Returns**:
- `subscriptions: Subscription[]` -- Filtered and sorted list
- `isLoading: boolean`
- `totalCount: number`
- `refetch: () => void`

**Implementation**: Wraps `trpc.subscription.list.useQuery(filters)` with debounced filter parameter updates.

### useActionQueue

**Path**: `apps/web/hooks/useActionQueue.ts`

Manages action queue data across all tabs with real-time updates.

**Returns**:
- `pending: Action[]`
- `inProgress: Action[]`
- `completed: Action[]`
- `counts: { pending: number; inProgress: number; completed: number }`
- `approve: (actionId: string) => Promise<void>` -- Optimistic update mutation
- `dismiss: (actionId: string) => Promise<void>` -- Optimistic update mutation
- `isLoading: boolean`

**Real-time**: Subscribes to SSE for action status changes. On `action.status_changed` event, invalidates the action queries to refresh data.

### useSavingsData

**Path**: `apps/web/hooks/useSavingsData.ts`

Aggregated savings data for the savings tracker.

**Returns**:
- `overview: { lifetime: number; monthly: number; annual: number }`
- `timeSeries: TimeSeriesData[]` -- Monthly cumulative savings
- `categories: CategoryBreakdown[]`
- `transfers: Transfer[]`
- `isLoading: boolean`

**Implementation**: Wraps multiple tRPC queries (`savings.getOverview`, `savings.getTimeSeries`, `savings.getByCategory`, `savings.getTransfers`) with parallel fetching.

### useNotifications

**Path**: `apps/web/hooks/useNotifications.ts`

Notification data and real-time delivery.

**Returns**:
- `notifications: Notification[]`
- `unreadCount: number`
- `markAsRead: (id: string) => Promise<void>`
- `markAllAsRead: () => Promise<void>`
- `isLoading: boolean`

**Real-time**: Subscribes to SSE for new notifications. On `notification.created` event, prepends to the local list and increments `unreadCount` via optimistic cache update.
