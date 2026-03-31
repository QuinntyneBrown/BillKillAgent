import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { notifications } from "@billkill/db";
import { router, protectedProcedure } from "../trpc.js";

export const notificationRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const results = await ctx.db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.session.userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

      return results;
    }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(notifications)
        .set({ read: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.session.userId)
          )
        )
        .returning();

      return updated ?? null;
    }),

  dismiss: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.session.userId)
          )
        )
        .returning();

      return { success: !!deleted };
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.session.userId),
          eq(notifications.read, false)
        )
      );

    return { count: result[0]?.count ?? 0 };
  }),
});
