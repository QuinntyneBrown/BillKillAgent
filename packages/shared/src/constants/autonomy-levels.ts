import type { AutonomyLevel } from "../types/user.types.js";

export interface AutonomyLevelConfig {
  level: AutonomyLevel;
  label: string;
  description: string;
  features: string[];
}

export const AUTONOMY_LEVELS: AutonomyLevelConfig[] = [
  {
    level: "full_auto",
    label: "Full Autopilot",
    description: "BillKill handles everything automatically — cancellations, negotiations, and plan switches.",
    features: [
      "Auto-cancel unused subscriptions",
      "Auto-negotiate better rates",
      "Auto-switch to cheaper plans",
      "Savings auto-transferred",
    ],
  },
  {
    level: "supervised",
    label: "Supervised",
    description: "BillKill recommends actions and executes them after your approval.",
    features: [
      "Review before cancellations",
      "Approve negotiation strategies",
      "One-tap approval for actions",
      "Batch approve similar actions",
    ],
  },
  {
    level: "manual",
    label: "Manual",
    description: "BillKill detects waste and suggests actions, but you handle everything yourself.",
    features: [
      "Waste detection alerts",
      "Savings recommendations",
      "DIY cancellation guides",
      "Rate comparison data",
    ],
  },
];

export const DEFAULT_AUTONOMY_LEVEL: AutonomyLevel = "supervised";
export const DEFAULT_SAVINGS_THRESHOLD = 50;
