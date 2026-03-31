# Feature 08: Components

## Services

### AuthService

**Package**: `packages/services/auth`

Wraps the Supabase Auth Admin SDK for server-side authentication operations. The frontend calls Supabase client SDK directly for sign-up and login; AuthService handles the server-side consequences (profile creation, Stripe customer creation, account disabling).

**Responsibilities**:
- `completeSignUp(supabaseUserId, email, name?)`: Called after Supabase Auth confirms a new user. Creates the `users` row with default settings, creates a Stripe customer, and returns the hydrated user profile.
- `getSessionUser(jwt: string)`: Validates the JWT against Supabase JWKS, extracts the `sub` claim, and returns the corresponding `users` row. Returns `null` for invalid/expired tokens.
- `disableAccount(userId)`: Disables the Supabase Auth account via admin API. Used during account deletion.
- `reactivateAccount(userId)`: Re-enables a previously disabled Supabase Auth account. Used when a user cancels deletion within the 30-day grace period.
- `deleteAuthAccount(supabaseAuthId)`: Permanently deletes the Supabase Auth record. Called by the purge job after 30 days.

**Dependencies**: Supabase Admin Client, Drizzle ORM, Stripe SDK

**Error Handling**: Throws `TRPCError` with code `UNAUTHORIZED` for invalid tokens, `CONFLICT` for duplicate sign-ups, `INTERNAL_SERVER_ERROR` for Supabase/Stripe failures.

---

### UserProfileService

**Package**: `packages/services/user`

Manages user profile data including display name, avatar, and read access to computed fields (total savings, subscription count).

**Responsibilities**:
- `getProfile(userId)`: Returns the full user profile including computed aggregates (total savings, active subscription count, pending action count).
- `updateProfile(userId, data)`: Updates mutable profile fields (display_name, avatar_url). Validates with Zod schema. Returns the updated profile.
- `uploadAvatar(userId, file)`: Uploads an image to Supabase Storage (`avatars/{userId}/{uuid}.{ext}`), deletes the previous avatar if one exists, and updates `avatar_url` on the `users` row. Accepts JPEG/PNG/WebP up to 2 MB.
- `deleteAvatar(userId)`: Removes the avatar from Supabase Storage and sets `avatar_url` to null.

**Validation Rules**:
- `display_name`: 1-100 characters, trimmed, no consecutive whitespace
- `avatar_url`: Must be a valid Supabase Storage URL (validated server-side after upload)

**Dependencies**: Drizzle ORM, Supabase Storage Client

---

### AutonomySettingsService

**Package**: `packages/services/user`

Manages the user's autonomy preferences which control how aggressively BillKillAgent acts on their behalf.

**Responsibilities**:
- `getSettings(userId)`: Returns the current autonomy level and dollar threshold.
- `updateAutonomyLevel(userId, level)`: Sets the autonomy level to `supervised`, `semi_autonomous`, or `fully_autonomous`. When changing to `semi_autonomous`, a `savings_threshold` must be provided.
- `updateSavingsThreshold(userId, threshold)`: Updates the dollar threshold for semi-autonomous mode. Must be between $1.00 and $10,000.00. Only valid when `autonomy_level = 'semi_autonomous'`.
- `evaluateAction(userId, estimatedSavings)`: Used by the action execution pipeline. Returns `{ autoExecute: boolean }` based on the user's autonomy level and threshold. Supervised always returns false. Fully autonomous always returns true. Semi-autonomous compares the estimated savings against the threshold.

**Business Rules**:
- New users default to `supervised` with `savings_threshold = 25.00`.
- Changing from `fully_autonomous` to a lower level does not cancel in-flight actions (they complete as approved).
- Changing from `supervised` to `fully_autonomous` triggers a confirmation dialog on the frontend.

**Dependencies**: Drizzle ORM

---

### PremiumTierService

**Package**: `packages/services/billing`

Manages Stripe subscription lifecycle for the premium tier.

**Responsibilities**:
- `createCheckoutSession(userId)`: Creates a Stripe Checkout Session for the premium plan. Returns the checkout URL. Sets `success_url` and `cancel_url` to appropriate app routes.
- `createPortalSession(userId)`: Creates a Stripe Customer Portal session for subscription management (update payment method, cancel). Returns the portal URL.
- `handleWebhook(event)`: Processes Stripe webhook events:
  - `customer.subscription.created` / `customer.subscription.updated`: Updates `plan_tier` on the `users` row. Creates a `billing_events` record.
  - `customer.subscription.deleted`: Reverts `plan_tier` to `free`. Creates a `billing_events` record.
  - `invoice.payment_failed`: Creates a `billing_events` record. After 3 consecutive failures, sends a notification (via NotificationService) warning of impending downgrade.
  - `invoice.paid`: Creates a `billing_events` record.
- `getCurrentTier(userId)`: Returns the user's current plan tier and subscription status (active, past_due, cancelled).
- `cancelSubscription(userId)`: Cancels the Stripe subscription at period end.

**Idempotency**: Webhook handler uses `stripe_event_id` unique constraint on `billing_events` to prevent duplicate processing.

**Dependencies**: Stripe SDK, Drizzle ORM, NotificationService

---

### SessionMiddleware

**Package**: `packages/api/middleware`

tRPC middleware that enforces authentication on protected routes. Attaches the authenticated user to the tRPC context.

**Responsibilities**:
- Extracts the `Authorization: Bearer {token}` header from the request.
- Calls `AuthService.getSessionUser(token)` to validate and resolve the user.
- If valid, attaches `ctx.user` (the `users` row) to the context and calls `next()`.
- If invalid or missing, throws `TRPCError({ code: 'UNAUTHORIZED' })`.

**Usage**:
```typescript
// In router definition
const protectedProcedure = t.procedure.use(sessionMiddleware);

export const userRouter = router({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return userProfileService.getProfile(ctx.user.id);
  }),
});
```

**Performance**: The middleware caches validated JWTs in Redis for 60 seconds (keyed by JWT `jti` claim) to avoid repeated Supabase JWKS lookups. Cache is invalidated on sign-out.

**Dependencies**: AuthService, Redis

---

## Interfaces

### IAuthProvider

**Package**: `packages/services/auth`

Abstraction over the authentication provider to enable testing and potential future provider swaps.

```typescript
interface IAuthProvider {
  /** Validate a JWT and return the provider user ID, or null if invalid */
  validateToken(token: string): Promise<{ sub: string; email: string } | null>;

  /** Create a new auth record (used in testing, not production sign-up) */
  createUser(email: string, password: string): Promise<{ id: string }>;

  /** Disable an auth account (prevent sign-in) */
  disableUser(providerUserId: string): Promise<void>;

  /** Re-enable a disabled auth account */
  enableUser(providerUserId: string): Promise<void>;

  /** Permanently delete an auth account */
  deleteUser(providerUserId: string): Promise<void>;
}
```

The production implementation (`SupabaseAuthProvider`) wraps the Supabase Admin SDK. Tests use an `InMemoryAuthProvider`.

---

## Entities

### User

**Table**: `users`

The core user record. Maps 1:1 with a Supabase Auth account.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Internal user ID |
| `supabase_auth_id` | `text` | UNIQUE, NOT NULL | Supabase Auth user ID (`auth.uid()`) |
| `email` | `text` | NOT NULL | User's email address (synced from Supabase) |
| `display_name` | `text` | nullable | User's display name |
| `avatar_url` | `text` | nullable | URL to avatar in Supabase Storage |
| `autonomy_level` | `enum('supervised','semi_autonomous','fully_autonomous')` | NOT NULL, default `'supervised'` | How much agency BillKillAgent has |
| `savings_threshold` | `numeric(10,2)` | nullable, default `25.00` | Dollar threshold for semi-autonomous mode |
| `stripe_customer_id` | `text` | NOT NULL | Stripe customer ID |
| `plan_tier` | `enum('free','premium')` | NOT NULL, default `'free'` | Billing tier |
| `status` | `enum('onboarding','active','suspended','deleted')` | NOT NULL, default `'onboarding'` | Account status |
| `deleted_at` | `timestamptz` | nullable | When soft-delete was initiated |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Account creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

**Indexes**:
- `users_supabase_auth_id_idx` (unique) on `supabase_auth_id`
- `users_email_idx` on `email`
- `users_stripe_customer_id_idx` on `stripe_customer_id`

---

### UserSettings

**Table**: `user_settings`

Extended user preferences that do not belong on the core `users` row. One row per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Record ID |
| `user_id` | `uuid` | FK `users.id`, UNIQUE, NOT NULL | Owning user |
| `notification_email_enabled` | `boolean` | NOT NULL, default `true` | Receive email notifications |
| `notification_push_enabled` | `boolean` | NOT NULL, default `true` | Receive push notifications |
| `notification_sms_enabled` | `boolean` | NOT NULL, default `false` | Receive SMS notifications |
| `savings_destination_id` | `uuid` | FK `savings_destinations.id`, nullable | Default savings destination account |
| `auto_transfer_enabled` | `boolean` | NOT NULL, default `false` | Auto-transfer savings to destination |
| `auto_transfer_frequency` | `enum('weekly','biweekly','monthly')` | nullable | Transfer frequency |
| `monthly_report_enabled` | `boolean` | NOT NULL, default `true` | Receive monthly savings report |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

**Indexes**:
- `user_settings_user_id_idx` (unique) on `user_id`

---

## tRPC Router: `authRouter`

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `auth.completeSignUp` | mutation | public | Creates user profile after Supabase Auth confirmation |
| `auth.getSession` | query | protected | Returns current session user data |
| `auth.deleteAccount` | mutation | protected | Initiates soft-delete flow |
| `auth.reactivateAccount` | mutation | protected | Cancels pending deletion |

## tRPC Router: `userRouter`

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `user.getProfile` | query | protected | Returns user profile with computed fields |
| `user.updateProfile` | mutation | protected | Updates display name and avatar |
| `user.uploadAvatar` | mutation | protected | Uploads avatar image |
| `user.getSettings` | query | protected | Returns user settings |
| `user.updateSettings` | mutation | protected | Updates notification/transfer preferences |
| `user.updateAutonomyLevel` | mutation | protected | Changes autonomy level |
| `user.updateSavingsThreshold` | mutation | protected | Changes semi-auto dollar threshold |

## tRPC Router: `billingRouter`

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `billing.getCurrentTier` | query | protected | Returns current plan and subscription status |
| `billing.createCheckoutSession` | mutation | protected | Creates Stripe Checkout session for upgrade |
| `billing.createPortalSession` | mutation | protected | Creates Stripe Customer Portal session |
| `billing.webhook` | mutation | public | Handles Stripe webhook events (verified by signature) |
