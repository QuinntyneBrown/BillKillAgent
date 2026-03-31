import { z } from "zod";
import { eq } from "drizzle-orm";
import { plaidItems, accounts } from "@billkill/db";
import { router, protectedProcedure } from "../trpc.js";

export const plaidRouter = router({
  createLinkToken: protectedProcedure.mutation(async ({ ctx }) => {
    // In production, this would call Plaid API to create a link token
    // For now, return a stub token
    return {
      linkToken: `link-sandbox-${ctx.session.userId}-${Date.now()}`,
      expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }),

  exchangeToken: protectedProcedure
    .input(
      z.object({
        publicToken: z.string(),
        institutionId: z.string(),
        institutionName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, this would exchange the public token for an access token via Plaid API
      const [plaidItem] = await ctx.db
        .insert(plaidItems)
        .values({
          userId: ctx.session.userId,
          plaidItemId: `item-sandbox-${Date.now()}`,
          institutionName: input.institutionName,
          status: "active",
          accessTokenEncrypted: `encrypted-sandbox-${Date.now()}`,
        })
        .returning();

      return {
        itemId: plaidItem.id,
        institutionName: input.institutionName,
      };
    }),

  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.db
      .select()
      .from(plaidItems)
      .where(eq(plaidItems.userId, ctx.session.userId));

    const userAccounts = await ctx.db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, ctx.session.userId));

    return items.map((item) => ({
      ...item,
      accounts: userAccounts.filter((a) => a.plaidItemId === item.id),
    }));
  }),
});
