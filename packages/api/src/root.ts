import { router } from "./trpc.js";
import { authRouter } from "./routers/auth.router.js";
import { subscriptionRouter } from "./routers/subscription.router.js";
import { actionRouter } from "./routers/action.router.js";
import { negotiationRouter } from "./routers/negotiation.router.js";
import { savingsRouter } from "./routers/savings.router.js";
import { notificationRouter } from "./routers/notification.router.js";
import { settingsRouter } from "./routers/settings.router.js";
import { plaidRouter } from "./routers/plaid.router.js";

export const appRouter = router({
  auth: authRouter,
  subscription: subscriptionRouter,
  action: actionRouter,
  negotiation: negotiationRouter,
  savings: savingsRouter,
  notification: notificationRouter,
  settings: settingsRouter,
  plaid: plaidRouter,
});

export type AppRouter = typeof appRouter;
