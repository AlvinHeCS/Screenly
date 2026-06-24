import { authRouter } from "./router/auth";
import { healthRouter } from "./router/health";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * The primary router. Add new routers here as features come online
 * (video, comment, view, transcript, …).
 */
export const appRouter = createTRPCRouter({
  health: healthRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

/** Server-side caller, used by the Next.js RSC tRPC helper. */
export const createCaller = createCallerFactory(appRouter);
