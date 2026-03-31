import { z } from "zod";

export const actionTabSchema = z.object({
  tab: z.enum(["pending", "in_progress", "completed"]).default("pending"),
});

export const approveActionSchema = z.object({
  actionId: z.string().uuid(),
});

export const dismissActionSchema = z.object({
  actionId: z.string().uuid(),
  reason: z.string().optional(),
});

export const approveAllSchema = z.object({
  actionIds: z.array(z.string().uuid()).min(1),
});

export type ActionTabInput = z.infer<typeof actionTabSchema>;
export type ApproveActionInput = z.infer<typeof approveActionSchema>;
export type DismissActionInput = z.infer<typeof dismissActionSchema>;
export type ApproveAllInput = z.infer<typeof approveAllSchema>;
