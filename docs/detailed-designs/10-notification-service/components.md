# Feature 10: Components

## Services

### NotificationService

**Package**: `packages/services/notification`

Central dispatcher that receives notification events and orchestrates multi-channel delivery.

**Responsibilities**:
- `send(params: SendNotificationParams)`: Main entry point. Accepts a notification type, target user ID, and data context. Orchestrates the full delivery pipeline:
  1. Loads user preferences via `NotificationPreferenceService`.
  2. Filters to enabled channels for this event type.
  3. Renders content for each channel via `NotificationTemplateEngine`.
  4. Persists the notification to the `notifications` table (always, regardless of channel preferences).
  5. Dispatches to each enabled channel in parallel.
  6. Returns the created notification record.
- `sendBulk(params: SendNotificationParams[])`: Batch send for multiple notifications (e.g., monthly reports). Processes in chunks of 50 to avoid overwhelming external APIs.
- `getForUser(userId, options?)`: Returns paginated notifications for a user, ordered by `created_at` descending. Supports filtering by read/unread and type.
- `markAsRead(notificationId, userId)`: Sets `read = true` and `read_at = now()`.
- `markAllAsRead(userId)`: Marks all unread notifications for the user as read.
- `dismiss(notificationId, userId)`: Sets `dismissed_at = now()`. Used for alert banners.
- `getUnreadCount(userId)`: Returns the count of unread notifications. Cached in Redis (key: `notif:unread:{userId}`) with 60-second TTL, invalidated on new notification or read.

**SendNotificationParams**:
```typescript
interface SendNotificationParams {
  userId: string;
  type: NotificationType;
  data: Record<string, unknown>;  // Template variables
  severity?: 'info' | 'warning' | 'critical';
  actionUrl?: string;             // Deep link for tap/click
  displayAsBanner?: boolean;      // Show as alert banner
  referenceType?: string;         // e.g., 'subscription', 'action'
  referenceId?: string;           // ID of related entity
}
```

**Dependencies**: NotificationPreferenceService, NotificationTemplateEngine, all INotificationChannel implementations, Drizzle ORM, Redis

---

### NotificationTemplateEngine

**Package**: `packages/services/notification`

Renders notification content from templates and data contexts, producing channel-specific output.

**Responsibilities**:
- `render(type: NotificationType, channel: NotificationChannel, data: Record<string, unknown>)`: Loads the active template for the given type and channel, interpolates variables, and returns rendered title and body.
- `registerTemplate(template: NotificationTemplate)`: Creates or updates a template in the database.
- `getTemplate(type: NotificationType, channel: NotificationChannel)`: Returns the active template for a type/channel combination.

**Template Resolution**:
1. Look up template by `(type, channel)` in the `notification_templates` table where `is_active = true`, ordered by `version DESC`.
2. If no channel-specific template exists, fall back to the `in_app` template (plain text).
3. Interpolate variables using Handlebars syntax: `{{variable_name}}`.
4. Apply channel-specific formatting:
   - **in_app**: Plain text, truncated to 200 chars for body.
   - **push**: Plain text, truncated to 100 chars for body.
   - **email**: Full HTML rendered via React Email component. The template body is injected into a branded email layout.
   - **sms**: Plain text, truncated to 160 chars total.

**Variable Formatting**:
- `{{amount}}` values are auto-formatted as currency (`$12.99`)
- `{{date}}` values are auto-formatted as localized dates
- `{{percent}}` values are auto-formatted with `%` suffix

**Dependencies**: Drizzle ORM, Handlebars (template engine), React Email (email rendering)

---

### InAppNotificationChannel

**Package**: `packages/services/notification`

Persists notifications to the database and pushes real-time updates via Redis pub/sub.

**Implements**: `INotificationChannel`

**Responsibilities**:
- `deliver(notification: RenderedNotification)`: The notification is already persisted by `NotificationService`. This channel publishes a real-time event to Redis pub/sub channel `user:{userId}:notifications` for SSE delivery to connected browsers.

**Real-Time Flow**:
1. `deliver()` publishes `{ type: 'notification.created', notification }` to Redis.
2. The Next.js SSE endpoint (`/api/events`) is subscribed to the user's channel.
3. The browser `EventSource` receives the event.
4. The `useNotifications` hook prepends the notification to the local list and increments the unread badge.

**Dependencies**: Redis (pub/sub)

---

### PushNotificationChannel

**Package**: `packages/services/notification`

Delivers push notifications via the Web Push API.

**Implements**: `INotificationChannel`

**Responsibilities**:
- `deliver(notification: RenderedNotification)`: Loads all push subscriptions for the user from the `push_subscriptions` table. Sends the notification payload to each subscription endpoint using the `web-push` npm package.
- `subscribe(userId, subscription: PushSubscription)`: Stores a new push subscription (endpoint, keys) for the user.
- `unsubscribe(userId, endpoint: string)`: Removes a push subscription.

**Error Handling**:
- HTTP 410 (Gone): Subscription is expired/invalid. Automatically deletes from `push_subscriptions`.
- HTTP 429 (Rate Limited): Retries after the `Retry-After` header value.
- Other errors: Logged and retried up to 3 times.

**Payload format**:
```json
{
  "title": "Netflix price increasing",
  "body": "From $15.49 to $17.99/mo. Want us to negotiate?",
  "icon": "/icons/notification-192.png",
  "badge": "/icons/badge-72.png",
  "data": { "url": "/actions/abc123" }
}
```

**Dependencies**: `web-push` npm package, Drizzle ORM

---

### EmailNotificationChannel

**Package**: `packages/services/notification`

Delivers transactional emails via Resend.

**Implements**: `INotificationChannel`

**Responsibilities**:
- `deliver(notification: RenderedNotification)`: Sends an email via the Resend API. The `body` field contains pre-rendered HTML from the template engine (React Email output).
- Rate limiting: Checks Redis counter `email:rate:{userId}`. If the user has received 10+ emails today, the delivery is skipped and logged as `rate_limited`.

**Email Structure**:
- **From**: `BillKillAgent <notifications@billkillagent.com>`
- **Subject**: Notification title
- **Body**: Branded HTML email with:
  - BillKillAgent header with logo
  - Notification content (title, body, CTA button if actionUrl present)
  - Footer with unsubscribe link and legal text

**Unsubscribe Handling**: The unsubscribe link points to `{APP_URL}/settings?tab=notifications&unsubscribe={type}`. Clicking it opens the settings page with the relevant notification type pre-toggled.

**Dependencies**: Resend SDK, Redis (rate limiting), Drizzle ORM

---

### SMSNotificationChannel

**Package**: `packages/services/notification`

Delivers SMS messages via Twilio for critical notifications.

**Implements**: `INotificationChannel`

**Responsibilities**:
- `deliver(notification: RenderedNotification)`: Sends an SMS via the Twilio Messages API. Only delivers if the user has a verified phone number on file.
- Rate limiting: Checks Redis counter `sms:rate:{userId}`. Max 5 SMS per user per day.

**Message Format**: Plain text, max 160 characters. Includes a short URL to the relevant action if applicable.

**Error Handling**:
- Invalid phone number (Twilio error 21211): Logs error, marks phone as unverified.
- Rate limited: Skips delivery, logs as `rate_limited`.

**Dependencies**: Twilio SDK, Redis (rate limiting), Drizzle ORM

---

### NotificationPreferenceService

**Package**: `packages/services/notification`

Evaluates user preferences to determine which channels should receive a notification.

**Responsibilities**:
- `getEnabledChannels(userId, notificationType)`: Returns the list of channels enabled for this user and event type. Queries the `user_notification_prefs` table.
- `updatePreference(userId, notificationType, channel, enabled)`: Updates a single preference row. Creates the row if it does not exist (upsert).
- `getPreferences(userId)`: Returns all notification preferences for display in the Settings page.
- `initializeDefaults(userId)`: Called during sign-up. Creates default preference rows for all notification types and channels based on the defaults defined in the notification types table above.

**Logic**:
1. Check if the user has a global channel toggle enabled (e.g., `notification_push_enabled` on `user_settings`).
2. If the global channel is disabled, that channel is excluded regardless of event-specific settings.
3. Check event-specific preference in `user_notification_prefs` for the `(userId, type, channel)` combination.
4. If no row exists, use the default for that type (as defined in the notification types configuration).
5. In-app channel is always included (cannot be disabled).

**Dependencies**: Drizzle ORM

---

## Interfaces

### INotificationChannel

**Package**: `packages/services/notification`

Abstraction for notification delivery channels.

```typescript
interface INotificationChannel {
  /** Unique channel identifier */
  readonly channel: NotificationChannel;

  /** Deliver a rendered notification to the user */
  deliver(notification: RenderedNotification): Promise<DeliveryResult>;
}

type NotificationChannel = 'in_app' | 'push' | 'email' | 'sms';

interface RenderedNotification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  actionUrl?: string;
  data: Record<string, unknown>;
}

interface DeliveryResult {
  success: boolean;
  channel: NotificationChannel;
  error?: string;
  metadata?: Record<string, unknown>;  // e.g., Twilio SID, Resend ID
}
```

---

## Entities

### Notification

**Table**: `notifications`

Persisted record of every notification sent to a user. Drives the in-app notification center.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Notification ID |
| `user_id` | `uuid` | FK `users.id`, NOT NULL | Target user |
| `type` | `enum` | NOT NULL | Notification type (e.g., `price_increase`) |
| `channel` | `enum` | NOT NULL | Channel this record represents |
| `title` | `text` | NOT NULL | Rendered title |
| `body` | `text` | NOT NULL | Rendered body |
| `severity` | `enum('info','warning','critical')` | NOT NULL, default `'info'` | Severity level |
| `reference_type` | `text` | nullable | Related entity type |
| `reference_id` | `uuid` | nullable | Related entity ID |
| `action_url` | `text` | nullable | Deep link URL |
| `display_as_banner` | `boolean` | NOT NULL, default `false` | Show as alert banner |
| `read` | `boolean` | NOT NULL, default `false` | Whether user has read it |
| `read_at` | `timestamptz` | nullable | When marked as read |
| `dismissed_at` | `timestamptz` | nullable | When banner was dismissed |
| `sent_at` | `timestamptz` | nullable | When successfully delivered |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |

**Indexes**:
- `notifications_user_id_created_at_idx` on `(user_id, created_at DESC)` -- Listing query
- `notifications_user_id_read_idx` on `(user_id)` where `read = false` -- Unread count
- `notifications_user_id_banner_idx` on `(user_id)` where `display_as_banner = true AND dismissed_at IS NULL` -- Active banners

---

### NotificationTemplate

**Table**: `notification_templates`

Templates for rendering notification content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Template ID |
| `type` | `enum` | NOT NULL | Notification type this template serves |
| `channel` | `enum` | NOT NULL | Target channel |
| `title_template` | `text` | NOT NULL | Handlebars title template |
| `body_template` | `text` | NOT NULL | Handlebars body template |
| `version` | `integer` | NOT NULL, default `1` | Template version |
| `is_active` | `boolean` | NOT NULL, default `true` | Whether this version is active |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

**Indexes**:
- `notification_templates_type_channel_idx` on `(type, channel)` where `is_active = true`

**Unique constraint**: `(type, channel, version)`

---

### PushSubscription

**Table**: `push_subscriptions`

Web Push API subscription records for each user's browser/device.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Record ID |
| `user_id` | `uuid` | FK `users.id`, NOT NULL | Owning user |
| `endpoint` | `text` | NOT NULL | Push service endpoint URL |
| `p256dh_key` | `text` | NOT NULL | Client public key |
| `auth_key` | `text` | NOT NULL | Auth secret |
| `user_agent` | `text` | nullable | Browser user agent for identification |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Subscription creation time |

**Indexes**:
- `push_subscriptions_user_id_idx` on `user_id`
- `push_subscriptions_endpoint_idx` (unique) on `endpoint`

---

## tRPC Router: `notificationRouter`

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `notification.list` | query | protected | Paginated notifications for the current user |
| `notification.getUnreadCount` | query | protected | Count of unread notifications |
| `notification.markAsRead` | mutation | protected | Mark a single notification as read |
| `notification.markAllAsRead` | mutation | protected | Mark all notifications as read |
| `notification.dismiss` | mutation | protected | Dismiss an alert banner |
| `notification.getActiveBanners` | query | protected | Get undismissed banner notifications |
| `notification.subscribePush` | mutation | protected | Register a Web Push subscription |
| `notification.unsubscribePush` | mutation | protected | Remove a Web Push subscription |

## BullMQ Jobs

| Job Name | Schedule/Trigger | Description |
|----------|-----------------|-------------|
| `notification.send` | On event | Delivers a notification through all enabled channels |
| `notification.send-bulk` | On event | Batch delivery (e.g., monthly reports for all users) |
| `notification.monthly-report` | Cron: `0 9 1 * *` (1st of month, 9 AM) | Generates and sends monthly savings report cards |
| `notification.cleanup` | Cron: `0 3 * * 0` (weekly Sunday 3 AM) | Deletes read notifications older than 90 days |
