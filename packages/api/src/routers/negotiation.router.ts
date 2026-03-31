import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { negotiationSessions, actions } from "@billkill/db";
import { router, protectedProcedure } from "../trpc.js";

export const negotiationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select({
        session: negotiationSessions,
        action: actions,
      })
      .from(negotiationSessions)
      .innerJoin(actions, eq(negotiationSessions.actionId, actions.id))
      .where(eq(actions.userId, ctx.session.userId));

    return results.map((r) => ({
      ...r.session,
      action: r.action,
    }));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({
          session: negotiationSessions,
          action: actions,
        })
        .from(negotiationSessions)
        .innerJoin(actions, eq(negotiationSessions.actionId, actions.id))
        .where(
          and(
            eq(negotiationSessions.id, input.id),
            eq(actions.userId, ctx.session.userId)
          )
        )
        .limit(1);

      if (!result) return null;

      return {
        ...result.session,
        action: result.action,
      };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select({
        session: negotiationSessions,
        action: actions,
      })
      .from(negotiationSessions)
      .innerJoin(actions, eq(negotiationSessions.actionId, actions.id))
      .where(eq(actions.userId, ctx.session.userId));

    const sessions = results.map((r) => r.session);
    const successful = sessions.filter((s) => s.outcome === "success");
    const totalSaved = successful.reduce(
      (sum, s) => sum + (s.savings ? parseFloat(s.savings) : 0),
      0
    );

    const avgSavingsPercent =
      successful.length > 0
        ? successful.reduce((sum, s) => {
            const original = parseFloat(s.originalRate);
            const savings = s.savings ? parseFloat(s.savings) : 0;
            return sum + (original > 0 ? (savings / original) * 100 : 0);
          }, 0) / successful.length
        : 0;

    return {
      totalNegotiations: sessions.length,
      successful: successful.length,
      totalSaved: Math.round(totalSaved * 100) / 100,
      averageSavingsPercent: Math.round(avgSavingsPercent * 10) / 10,
    };
  }),
});
