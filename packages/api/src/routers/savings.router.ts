import { eq } from "drizzle-orm";
import { savingsRecords, savingsDestinations, transfers, actions } from "@billkill/db";
import { router, protectedProcedure } from "../trpc.js";

export const savingsRouter = router({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const records = await ctx.db
      .select()
      .from(savingsRecords)
      .where(eq(savingsRecords.userId, ctx.session.userId));

    const totalSaved = records.reduce(
      (sum, r) => sum + parseFloat(r.amount),
      0
    );

    // Calculate monthly savings from active completed actions
    const completedActions = await ctx.db
      .select()
      .from(actions)
      .where(eq(actions.userId, ctx.session.userId));

    const activeNegotiations = completedActions.filter(
      (a) => a.type === "negotiate" && (a.status === "in_progress" || a.status === "approved")
    ).length;

    const activeCancellations = completedActions.filter(
      (a) => a.type === "cancel" && (a.status === "in_progress" || a.status === "approved")
    ).length;

    const monthlySavings = completedActions
      .filter((a) => a.status === "completed" && a.actualSavings)
      .reduce((sum, a) => sum + parseFloat(a.actualSavings!), 0);

    return {
      totalSaved: Math.round(totalSaved * 100) / 100,
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      savingsGoal: 2000,
      savingsGoalProgress: Math.round((totalSaved / 2000) * 100),
      activeCancellations,
      activeNegotiations,
    };
  }),

  getChartData: protectedProcedure.query(async ({ ctx }) => {
    const records = await ctx.db
      .select()
      .from(savingsRecords)
      .where(eq(savingsRecords.userId, ctx.session.userId));

    // Group by month
    const monthMap = new Map<string, number>();
    for (const record of records) {
      const month = record.realizedAt.toISOString().slice(0, 7); // YYYY-MM
      monthMap.set(month, (monthMap.get(month) ?? 0) + parseFloat(record.amount));
    }

    const sorted = [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    let cumulative = 0;

    return sorted.map(([month, amount]) => {
      cumulative += amount;
      return {
        month,
        amount: Math.round(amount * 100) / 100,
        cumulative: Math.round(cumulative * 100) / 100,
      };
    });
  }),

  getBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const records = await ctx.db
      .select()
      .from(savingsRecords)
      .where(eq(savingsRecords.userId, ctx.session.userId));

    const typeMap = new Map<string, { amount: number; count: number }>();
    let total = 0;

    for (const record of records) {
      const amount = parseFloat(record.amount);
      total += amount;
      const existing = typeMap.get(record.type) ?? { amount: 0, count: 0 };
      typeMap.set(record.type, {
        amount: existing.amount + amount,
        count: existing.count + 1,
      });
    }

    return [...typeMap.entries()].map(([type, data]) => ({
      type: type as "cancellation" | "negotiation" | "downgrade" | "switch",
      amount: Math.round(data.amount * 100) / 100,
      count: data.count,
      percentage: total > 0 ? Math.round((data.amount / total) * 1000) / 10 : 0,
    }));
  }),

  getTransfers: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select({
        transfer: transfers,
        destination: savingsDestinations,
      })
      .from(transfers)
      .innerJoin(
        savingsDestinations,
        eq(transfers.destinationId, savingsDestinations.id)
      )
      .where(eq(transfers.userId, ctx.session.userId));

    return results.map((r) => ({
      ...r.transfer,
      destination: r.destination,
    }));
  }),
});
