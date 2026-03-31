import { z } from "zod";
import { eq, and, inArray, sql } from "drizzle-orm";
import { actions, subscriptions } from "@billkill/db";
import { actionTabSchema, approveActionSchema, dismissActionSchema, approveAllSchema } from "@billkill/shared";
import { router, protectedProcedure } from "../trpc.js";

export const actionRouter = router({
  list: protectedProcedure
    .input(actionTabSchema)
    .query(async ({ ctx, input }) => {
      const statusMap: Record<string, string[]> = {
        pending: ["pending"],
        in_progress: ["approved", "in_progress"],
        completed: ["completed", "failed", "dismissed"],
      };

      const statuses = statusMap[input.tab] ?? ["pending"];

      const results = await ctx.db
        .select({
          action: actions,
          subscription: subscriptions,
        })
        .from(actions)
        .innerJoin(subscriptions, eq(actions.subscriptionId, subscriptions.id))
        .where(
          and(
            eq(actions.userId, ctx.session.userId),
            inArray(actions.status, statuses as [string, ...string[]])
          )
        );

      return results.map((r) => ({
        ...r.action,
        subscription: r.subscription,
      }));
    }),

  approve: protectedProcedure
    .input(approveActionSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(actions)
        .set({
          status: "approved",
          autonomyApproved: true,
        })
        .where(
          and(
            eq(actions.id, input.actionId),
            eq(actions.userId, ctx.session.userId),
            eq(actions.status, "pending")
          )
        )
        .returning();

      return updated ?? null;
    }),

  dismiss: protectedProcedure
    .input(dismissActionSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(actions)
        .set({ status: "dismissed" })
        .where(
          and(
            eq(actions.id, input.actionId),
            eq(actions.userId, ctx.session.userId),
            eq(actions.status, "pending")
          )
        )
        .returning();

      return updated ?? null;
    }),

  approveAll: protectedProcedure
    .input(approveAllSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(actions)
        .set({
          status: "approved",
          autonomyApproved: true,
        })
        .where(
          and(
            inArray(actions.id, input.actionIds),
            eq(actions.userId, ctx.session.userId),
            eq(actions.status, "pending")
          )
        )
        .returning();

      return { count: updated.length };
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const allActions = await ctx.db
      .select()
      .from(actions)
      .where(eq(actions.userId, ctx.session.userId));

    const pending = allActions.filter((a) => a.status === "pending").length;
    const inProgress = allActions.filter(
      (a) => a.status === "approved" || a.status === "in_progress"
    ).length;
    const completed = allActions.filter((a) => a.status === "completed").length;
    const totalSaved = allActions
      .filter((a) => a.status === "completed" && a.actualSavings)
      .reduce((sum, a) => sum + parseFloat(a.actualSavings!), 0);

    return {
      pending,
      inProgress,
      completed,
      totalSaved: Math.round(totalSaved * 100) / 100,
    };
  }),
});
