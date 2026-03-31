import { eq, and } from "drizzle-orm";
import { users, userNotificationPrefs } from "@billkill/db";
import {
  updateAutonomySchema,
  updateNotificationPrefsSchema,
  updateSettingsProfileSchema,
} from "@billkill/shared";
import { router, protectedProcedure } from "../trpc.js";

export const settingsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.session.userId))
      .limit(1);

    if (!user) return null;

    const prefs = await ctx.db
      .select()
      .from(userNotificationPrefs)
      .where(eq(userNotificationPrefs.userId, ctx.session.userId));

    return {
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        premiumTier: user.premiumTier,
      },
      autonomy: {
        level: user.autonomyLevel,
        savingsThreshold: parseFloat(user.savingsThreshold),
      },
      notificationPrefs: prefs,
    };
  }),

  updateAutonomy: protectedProcedure
    .input(updateAutonomySchema)
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = {
        autonomyLevel: input.autonomyLevel,
        updatedAt: new Date(),
      };

      if (input.savingsThreshold !== undefined) {
        updateData.savingsThreshold = String(input.savingsThreshold);
      }

      const [updated] = await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, ctx.session.userId))
        .returning();

      return updated;
    }),

  updateNotificationPrefs: protectedProcedure
    .input(updateNotificationPrefsSchema)
    .mutation(async ({ ctx, input }) => {
      // Upsert notification preference
      const existing = await ctx.db
        .select()
        .from(userNotificationPrefs)
        .where(
          and(
            eq(userNotificationPrefs.userId, ctx.session.userId),
            eq(userNotificationPrefs.channel, input.channel),
            eq(userNotificationPrefs.eventType, input.eventType)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const [updated] = await ctx.db
          .update(userNotificationPrefs)
          .set({ enabled: input.enabled })
          .where(eq(userNotificationPrefs.id, existing[0].id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(userNotificationPrefs)
        .values({
          userId: ctx.session.userId,
          channel: input.channel,
          eventType: input.eventType,
          enabled: input.enabled,
        })
        .returning();

      return created;
    }),

  updateProfile: protectedProcedure
    .input(updateSettingsProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;

      const [updated] = await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, ctx.session.userId))
        .returning();

      return updated;
    }),
});
