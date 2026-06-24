import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "@screenly/db";

/**
 * Add `user.id` to the session type. We use the database session strategy
 * (sessions live in Postgres) so the same session can later be reused by the
 * Electron desktop client — see the roadmap's auth-handoff risk.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  // `@auth/prisma-adapter` is typed against the stock PrismaClient; our client
  // is generated to a custom output dir, so the structural types line up at
  // runtime but TS needs a nudge.
  adapter: PrismaAdapter(db as never),
  providers: [
    // Auth.js auto-reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET from the env.
    Google,
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    // Every new user gets a personal workspace they own. Team workspaces +
    // invites land in V1; for MVP this is the only workspace that exists.
    createUser: async ({ user }) => {
      if (!user.id) return;
      await db.workspace.create({
        data: {
          name: "Personal",
          type: "PERSONAL",
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });
    },
  },
} satisfies NextAuthConfig;
