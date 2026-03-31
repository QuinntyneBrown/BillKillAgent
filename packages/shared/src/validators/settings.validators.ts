import { z } from "zod";

export const updateAutonomySchema = z.object({
  autonomyLevel: z.enum(["full_auto", "supervised", "manual"]),
  savingsThreshold: z.number().min(0).max(10000).optional(),
});

export const updateNotificationPrefsSchema = z.object({
  channel: z.enum(["in_app", "email", "push", "sms"]),
  eventType: z.string(),
  enabled: z.boolean(),
});

export const updateSettingsProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export type UpdateAutonomyInput = z.infer<typeof updateAutonomySchema>;
export type UpdateNotificationPrefsInput = z.infer<typeof updateNotificationPrefsSchema>;
export type UpdateSettingsProfileInput = z.infer<typeof updateSettingsProfileSchema>;
