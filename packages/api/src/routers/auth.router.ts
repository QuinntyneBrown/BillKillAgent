import { eq } from "drizzle-orm";
import { users } from "@billkill/db";
import { router, publicProcedure, protectedProcedure } from "../trpc.js";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    if (!ctx.session) {
      return null;
    }
    return {
      userId: ctx.session.userId,
      email: ctx.session.email,
    };
  }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        autonomyLevel: users.autonomyLevel,
        premiumTier: users.premiumTier,
        onboardingCompleted: users.onboardingCompleted,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .limit(1);

    if (!user) {
      return null;
    }

    return user;
  }),
});
