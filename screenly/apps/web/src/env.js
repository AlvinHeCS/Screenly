import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables. Validated at build/boot so the app never
   * runs with a malformed config. Feature secrets are `.optional()` for now so
   * the app boots before they're set — the features that need them simply won't
   * work until you populate `.env`.
   */
  server: {
    DATABASE_URL: z.string().url(),
    // Session-mode connection used only by `prisma migrate` / `db push`.
    DIRECT_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Auth.js (NextAuth v5). AUTH_SECRET is required in production (NextAuth
    // enforces this itself); Google OAuth creds gate sign-in.
    AUTH_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    // Cloudflare Stream — video upload, transcode, HLS streaming, thumbnails.
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    CLOUDFLARE_STREAM_TOKEN: z.string().optional(),
    STREAM_WEBHOOK_SECRET: z.string().optional(),

    // Inngest — background workflows (transcription, notifications, rollups).
    INNGEST_EVENT_KEY: z.string().optional(),
    INNGEST_SIGNING_KEY: z.string().optional(),
  },

  /**
   * Client-side environment variables. Prefix with `NEXT_PUBLIC_` to expose.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * Destructure manually — `process.env` can't be destructured in edge runtimes.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_STREAM_TOKEN: process.env.CLOUDFLARE_STREAM_TOKEN,
    STREAM_WEBHOOK_SECRET: process.env.STREAM_WEBHOOK_SECRET,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Treat empty strings as undefined so `SOME_VAR=''` throws like a missing var.
   */
  emptyStringAsUndefined: true,
});
