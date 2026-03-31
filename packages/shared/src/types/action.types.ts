export type ActionType = "cancel" | "negotiate" | "downgrade" | "pause" | "switch_plan";

export type ActionStatus = "pending" | "approved" | "in_progress" | "completed" | "failed" | "dismissed";

export type CancellationMethod = "api" | "phone" | "email" | "chat" | "portal";

export type CancellationStatus = "pending" | "in_progress" | "completed" | "failed" | "requires_manual";

export interface Action {
  id: string;
  userId: string;
  subscriptionId: string;
  type: ActionType;
  status: ActionStatus;
  estimatedSavings: number;
  actualSavings: number | null;
  autonomyApproved: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export interface CancellationAttempt {
  id: string;
  actionId: string;
  method: CancellationMethod;
  status: CancellationStatus;
  providerFlowId: string | null;
  error: string | null;
  attemptNumber: number;
}

export interface ActionStats {
  pending: number;
  inProgress: number;
  completed: number;
  totalSaved: number;
}

export type ActionTab = "pending" | "in_progress" | "completed";
