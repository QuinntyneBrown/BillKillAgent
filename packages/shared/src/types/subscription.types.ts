export type SubscriptionFrequency = "monthly" | "yearly" | "weekly" | "quarterly";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "pending_cancellation";

export type RecommendedAction = "cancel" | "negotiate" | "downgrade" | "keep" | "review";

export type WasteFlagType = "unused" | "duplicate" | "price_increase" | "better_alternative" | "low_usage";

export type WasteFlagSeverity = "low" | "medium" | "high" | "critical";

export interface Subscription {
  id: string;
  userId: string;
  merchantName: string;
  logoUrl: string | null;
  amount: number;
  frequency: SubscriptionFrequency;
  category: string;
  valueScore: number;
  usageScore: number;
  status: SubscriptionStatus;
  recommendedAction: RecommendedAction;
  nextBillingDate: Date | null;
  detectedAt: Date;
}

export interface WasteFlag {
  id: string;
  subscriptionId: string;
  type: WasteFlagType;
  severity: WasteFlagSeverity;
  evidence: Record<string, unknown>;
}

export interface SubscriptionStats {
  totalRecurring: number;
  totalSubscriptions: number;
  wasteDetected: number;
  potentialSavings: number;
}

export interface SubscriptionFilters {
  category?: string;
  status?: SubscriptionStatus;
  search?: string;
  sort?: "amount_asc" | "amount_desc" | "name_asc" | "name_desc" | "date_asc" | "date_desc";
}
