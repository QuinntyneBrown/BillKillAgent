export type AutonomyLevel = "full_auto" | "supervised" | "manual";

export type PremiumTier = "free" | "plus" | "pro";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  autonomyLevel: AutonomyLevel;
  savingsThreshold: number;
  premiumTier: PremiumTier;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  autonomyLevel: AutonomyLevel;
  premiumTier: PremiumTier;
  onboardingCompleted: boolean;
}
