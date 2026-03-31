import { z } from "zod";

export const subscriptionFiltersSchema = z.object({
  category: z.string().optional(),
  status: z.enum(["active", "paused", "cancelled", "pending_cancellation"]).optional(),
  search: z.string().optional(),
  sort: z
    .enum(["amount_asc", "amount_desc", "name_asc", "name_desc", "date_asc", "date_desc"])
    .optional()
    .default("amount_desc"),
});

export const subscriptionIdSchema = z.object({
  id: z.string().uuid(),
});

export type SubscriptionFiltersInput = z.infer<typeof subscriptionFiltersSchema>;
