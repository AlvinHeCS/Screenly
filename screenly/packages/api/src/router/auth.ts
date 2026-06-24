import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  /** Current session (or null) — safe to call when signed out. */
  getSession: publicProcedure.query(({ ctx }) => ctx.session),

  /** Current user — only resolves when signed in. */
  me: protectedProcedure.query(({ ctx }) => ctx.session.user),
});
