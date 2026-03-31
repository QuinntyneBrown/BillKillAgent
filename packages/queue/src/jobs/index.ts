export interface CancellationJobData {
  actionId: string;
  userId: string;
  subscriptionId: string;
  providerName: string;
  method: "api" | "phone" | "email" | "chat" | "portal";
}

export interface NegotiationJobData {
  actionId: string;
  userId: string;
  subscriptionId: string;
  providerName: string;
  currentRate: number;
  targetRate: number;
  providerFlowId?: string;
}

export interface ScanJobData {
  userId: string;
  plaidItemId: string;
  cursor?: string;
  fullSync?: boolean;
}

export interface MonitoringJobData {
  userId: string;
  subscriptionId: string;
  checkType: "price_change" | "usage_analysis" | "waste_detection" | "status_check";
}

export interface NotificationJobData {
  userId: string;
  type: "action_required" | "savings_found" | "negotiation_complete" | "cancellation_complete" | "price_alert" | "system";
  title: string;
  body: string;
  severity: "info" | "warning" | "success" | "error";
  channels: ("in_app" | "email" | "push" | "sms")[];
  actionUrl?: string;
}

export interface SavingsTransferJobData {
  userId: string;
  destinationId: string;
  amount: number;
  savingsRecordId: string;
}
