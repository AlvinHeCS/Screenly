/**
 * tRPC server setup: context, transformer, and the procedure builders.
 * Routers in ./router import the procedures defined here.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "@screenly/auth";
import { db } from "@screenly/db";

/**
 * Context available to every procedure. We resolve the Auth.js session here
 * (it reads the session cookie via next/headers) so `protectedProcedure` can
 * gate on it, and expose the db client.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return {
    db,
    session,
    headers: opts.headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

/** Logs timing and adds an artificial delay in dev to surface waterfalls. */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  return result;
});

/** Open to everyone; `ctx.session` may be null. */
export const publicProcedure = t.procedure.use(timingMiddleware);

/** Requires a signed-in user. Narrows `ctx.session.user` to non-null. */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * Workspace-scoped procedure. Resolves the caller's active workspace — via the
 * `x-workspace-id` header, falling back to their first (personal) workspace —
 * and attaches the membership. Role enforcement beyond "is a member" is
 * deferred to V1 when invites exist; for MVP everyone owns their personal space.
 */
export const workspaceProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const requestedId = ctx.headers.get("x-workspace-id");
    const membership = await ctx.db.membership.findFirst({
      where: {
        userId: ctx.session.user.id,
        ...(requestedId ? { workspaceId: requestedId } : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { workspace: true },
    });
    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have access to this workspace.",
      });
    }
    return next({
      ctx: {
        workspace: membership.workspace,
        membership,
      },
    });
  },
);
