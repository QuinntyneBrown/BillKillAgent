export type SavingsType = "cancellation" | "negotiation" | "downgrade" | "switch";

export type TransferStatus = "pending" | "processing" | "completed" | "failed";

export type TransferFrequency = "weekly" | "biweekly" | "monthly" | "on_savings";

export interface SavingsRecord {
  id: string;
  userId: string;
  actionId: string;
  amount: number;
  type: SavingsType;
  realizedAt: Date;
}

export interface SavingsDestination {
  id: string;
  userId: string;
  accountName: string;
  accountMask: string;
  autoTransfer: boolean;
  transferFrequency: TransferFrequency;
}

export interface Transfer {
  id: string;
  userId: string;
  destinationId: string;
  amount: number;
  status: TransferStatus;
  initiatedAt: Date;
  completedAt: Date | null;
}

export interface SavingsSummary {
  totalSaved: number;
  monthlySavings: number;
  savingsGoal: number;
  savingsGoalProgress: number;
  activeCancellations: number;
  activeNegotiations: number;
}

export interface SavingsChartDataPoint {
  month: string;
  amount: number;
  cumulative: number;
}

export interface SavingsBreakdown {
  type: SavingsType;
  amount: number;
  count: number;
  percentage: number;
}
