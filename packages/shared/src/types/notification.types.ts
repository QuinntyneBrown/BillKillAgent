export type NotificationType = "action_required" | "savings_found" | "negotiation_complete" | "cancellation_complete" | "price_alert" | "system";

export type NotificationSeverity = "info" | "warning" | "success" | "error";

export type NotificationChannel = "in_app" | "email" | "push" | "sms";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  severity: NotificationSeverity;
  read: boolean;
  actionUrl: string | null;
  createdAt: Date;
}

export interface UserNotificationPrefs {
  id: string;
  userId: string;
  channel: NotificationChannel;
  eventType: string;
  enabled: boolean;
}
