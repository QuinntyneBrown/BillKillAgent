import { z } from "zod";
import { eq, and, ilike, sql, desc, asc } from "drizzle-orm";
import { subscriptions, wasteFlags } from "@billkill/db";
import { subscriptionFiltersSchema } from "@billkill/shared";
import { router, protectedProcedure } from "../trpc.js";

export const subscriptionRouter = router({
  list: protectedProcedure
    .input(subscriptionFiltersSchema)
    .query(async ({ ctx, input }) => {
      const conditions = [eq(subscriptions.userId, ctx.session.userId)];

      if (input.category) {
        conditions.push(eq(subscriptions.category, input.category));
      }
      if (input.status) {
        conditions.push(eq(subscriptions.status, input.status));
      }
      if (input.search) {
        conditions.push(ilike(subscriptions.merchantName, `%${input.search}%`));
      }

      let orderBy;
      switch (input.sort) {
        case "amount_asc":
          orderBy = asc(subscriptions.amount);
          break;
        case "amount_desc":
          orderBy = desc(subscriptions.amount);
          break;
        case "name_asc":
          orderBy = asc(subscriptions.merchantName);
          break;
        case "name_desc":
          orderBy = desc(subscriptions.merchantName);
          break;
        case "date_asc":
          orderBy = asc(subscriptions.nextBillingDate);
          break;
        case "date_desc":
          orderBy = desc(subscriptions.nextBillingDate);
          break;
        default:
          orderBy = desc(subscriptions.amount);
      }

      const results = await ctx.db
        .select()
        .from(subscriptions)
        .where(and(...conditions))
        .orderBy(orderBy);

      return results;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [subscription] = await ctx.db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.id, input.id),
            eq(subscriptions.userId, ctx.session.userId)
          )
        )
        .limit(1);

      if (!subscription) {
        return null;
      }

      const flags = await ctx.db
        .select()
        .from(wasteFlags)
        .where(eq(wasteFlags.subscriptionId, subscription.id));

      return { ...subscription, wasteFlags: flags };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const allSubs = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.session.userId));

    const activeSubs = allSubs.filter((s) => s.status === "active");
    const totalRecurring = activeSubs.reduce(
      (sum, s) => sum + parseFloat(s.amount),
      0
    );

    const flags = await ctx.db
      .select()
      .from(wasteFlags);

    const subsWithWaste = new Set(flags.map((f) => f.subscriptionId));
    const wasteSubs = activeSubs.filter((s) => subsWithWaste.has(s.id));
    const wasteDetected = wasteSubs.reduce(
      (sum, s) => sum + parseFloat(s.amount),
      0
    );

    return {
      totalRecurring: Math.round(totalRecurring * 100) / 100,
      totalSubscriptions: activeSubs.length,
      wasteDetected: Math.round(wasteDetected * 100) / 100,
      potentialSavings: Math.round(wasteDetected * 100) / 100,
    };
  }),
});
