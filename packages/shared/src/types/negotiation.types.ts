export type NegotiationOutcome = "success" | "partial" | "failed" | "pending" | "in_progress";

export interface RetentionOffer {
  description: string;
  discountPercent: number;
  durationMonths: number;
  accepted: boolean;
}

export interface NegotiationSession {
  id: string;
  actionId: string;
  providerName: string;
  originalRate: number;
  newRate: number | null;
  savings: number | null;
  durationSeconds: number | null;
  outcome: NegotiationOutcome;
  callSid: string | null;
  transcript: Record<string, unknown>[] | null;
  retentionOffers: RetentionOffer[] | null;
  createdAt: Date;
}

export interface NegotiationStats {
  totalNegotiations: number;
  successful: number;
  totalSaved: number;
  averageSavingsPercent: number;
}
