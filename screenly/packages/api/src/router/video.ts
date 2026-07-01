import type {
  Prisma,
  PrismaClient,
  Transcript,
  Visibility,
} from "@screenly/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { CaptionStatus, TranscriptCue } from "../cloudflare";
import {
  createDirectUpload,
  deleteCaptions,
  deleteStreamVideo,
  generateCaptions,
  getCaptionStatus,
  getCaptionVtt,
  getStreamVideo,
  isStreamConfigured,
  parseVtt,
} from "../cloudflare";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  workspaceProcedure,
} from "../trpc";

const TRANSCRIPT_LANGUAGE = "en";
const MAX_TRANSCRIPT_ATTEMPTS = 3;
/** Give up on caption generation after this long; release with no transcript. */
const GENERATING_TIMEOUT_MS = 10 * 60 * 1000;
/** Min gap between outbound Cloudflare caption calls per video (public endpoint). */
const TRANSCRIPT_SYNC_COOLDOWN_MS = 3000;

type VideoForTranscript = {
  id: string;
  status: string;
  cloudflareUid: string | null;
  transcript: Transcript | null;
};

/** Coerce the stored Json blob back into validated cues. */
function toCues(value: Prisma.JsonValue | null | undefined): TranscriptCue[] {
  if (!Array.isArray(value)) return [];
  const cues: TranscriptCue[] = [];
  for (const item of value) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const rec = item as Record<string, unknown>;
      if (typeof rec.startMs === "number" && typeof rec.text === "string") {
        cues.push({ startMs: rec.startMs, text: rec.text });
      }
    }
  }
  return cues;
}

/** Visibility gate shared by getBySlug + syncTranscript. Throws NOT_FOUND. */
async function assertCanView(
  db: PrismaClient,
  video: { visibility: Visibility; ownerId: string; workspaceId: string },
  userId: string | null,
): Promise<void> {
  switch (video.visibility) {
    case "LINK":
      return;
    case "PRIVATE":
      if (userId && userId === video.ownerId) return;
      break;
    case "WORKSPACE":
      if (
        userId &&
        (await db.membership.findFirst({
          where: { userId, workspaceId: video.workspaceId },
          select: { id: true },
        }))
      ) {
        return;
      }
      break;
    case "PASSWORD":
      break;
  }
  throw new TRPCError({ code: "NOT_FOUND" });
}

/**
 * Advance the transcript one step for a READY video: ensure a row, generate
 * captions, poll Cloudflare, store cues. Throttled + time-bounded so the public
 * sync endpoint can't fan out unbounded and a stuck job can't pin "generating".
 */
async function advanceTranscript(
  db: PrismaClient,
  video: VideoForTranscript,
): Promise<Transcript | null> {
  const uid = video.cloudflareUid;
  if (!uid || video.status !== "READY") return video.transcript;

  let transcript =
    video.transcript ??
    (await db.transcript.create({
      data: { videoId: video.id, language: TRANSCRIPT_LANGUAGE },
    }));

  if (
    transcript.status === "READY" ||
    transcript.status === "FAILED" ||
    transcript.status === "UNAVAILABLE"
  ) {
    return transcript;
  }

  const nowMs = Date.now();
  // Throttle the outbound Cloudflare calls from this public endpoint.
  if (
    transcript.lastPolledAt &&
    nowMs - transcript.lastPolledAt.getTime() < TRANSCRIPT_SYNC_COOLDOWN_MS
  ) {
    return transcript;
  }

  if (transcript.status === "PENDING") {
    const claim = await db.transcript.updateMany({
      where: { id: transcript.id, status: "PENDING" },
      data: {
        status: "GENERATING",
        attempts: { increment: 1 },
        generationStartedAt: new Date(),
        lastPolledAt: new Date(),
      },
    });
    if (claim.count === 1) {
      try {
        // Clear any prior errored entry first — generate 409s if one exists.
        await deleteCaptions(uid, TRANSCRIPT_LANGUAGE);
        await generateCaptions(uid, TRANSCRIPT_LANGUAGE);
      } catch {
        const next =
          transcript.attempts + 1 >= MAX_TRANSCRIPT_ATTEMPTS
            ? "FAILED"
            : "PENDING";
        await db.transcript.update({
          where: { id: transcript.id },
          data: { status: next },
        });
      }
    }
    return db.transcript.findUnique({ where: { id: transcript.id } });
  }

  // GENERATING — bound the wait so a never-resolving job can't pin the spinner.
  if (
    transcript.generationStartedAt &&
    nowMs - transcript.generationStartedAt.getTime() > GENERATING_TIMEOUT_MS
  ) {
    return db.transcript.update({
      where: { id: transcript.id },
      data: { status: "UNAVAILABLE" },
    });
  }
  await db.transcript.update({
    where: { id: transcript.id },
    data: { lastPolledAt: new Date() },
  });

  let status: CaptionStatus | null;
  try {
    status = await getCaptionStatus(uid, TRANSCRIPT_LANGUAGE);
  } catch {
    return db.transcript.findUnique({ where: { id: transcript.id } });
  }

  if (status === "ready") {
    try {
      const cues = parseVtt(await getCaptionVtt(uid, TRANSCRIPT_LANGUAGE));
      return db.transcript.update({
        where: { id: transcript.id },
        data: {
          status: cues.length > 0 ? "READY" : "UNAVAILABLE",
          cues: cues as unknown as Prisma.InputJsonValue,
        },
      });
    } catch {
      return db.transcript.update({
        where: { id: transcript.id },
        data: { status: "FAILED" },
      });
    }
  }
  if (status === "error") {
    const next =
      transcript.attempts >= MAX_TRANSCRIPT_ATTEMPTS ? "FAILED" : "PENDING";
    return db.transcript.update({
      where: { id: transcript.id },
      data: { status: next },
    });
  }
  // null (no entry yet) or "inprogress" — keep waiting.
  return db.transcript.findUnique({ where: { id: transcript.id } });
}

export const videoRouter = createTRPCRouter({
  /**
   * All non-deleted videos in the caller's active (first) workspace, newest
   * first, shaped for the Library grid. Returns [] when the user has no
   * workspace yet so the page renders its empty state instead of throwing.
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const membership = await ctx.db.membership.findFirst({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
    });
    if (!membership) return [];

    const videos = await ctx.db.video.findMany({
      where: {
        workspaceId: membership.workspaceId,
        status: { not: "DELETED" },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        durationSec: true,
        thumbnailUrl: true,
        visibility: true,
        createdAt: true,
        owner: { select: { name: true, image: true } },
        _count: { select: { views: true, comments: true } },
      },
    });

    return videos.map((v) => ({
      id: v.id,
      slug: v.slug,
      title: v.title,
      status: v.status,
      durationSec: v.durationSec,
      thumbnailUrl: v.thumbnailUrl,
      visibility: v.visibility,
      createdAt: v.createdAt,
      owner: v.owner,
      viewCount: v._count.views,
      commentCount: v._count.comments,
      reactionCount: 0,
    }));
  }),

  /**
   * Step 1 of upload: reserve a Cloudflare Stream asset + a one-time direct
   * upload URL, and create the backing Video row (status UPLOADING). The client
   * then POSTs the recording straight to `uploadURL` and calls `markUploaded`.
   */
  createUpload: workspaceProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(200).optional(),
        mode: z.enum(["SCREEN", "CAMERA", "BOTH"]).optional(),
        durationSec: z
          .number()
          .int()
          .positive()
          .max(60 * 60 * 4)
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isStreamConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Video uploads aren't configured yet. Set the Cloudflare Stream environment variables.",
        });
      }
      const title = input.title?.length ? input.title : "Untitled recording";
      const upload = await createDirectUpload({
        name: title,
        maxDurationSeconds: input.durationSec
          ? input.durationSec + 60
          : undefined,
      });

      const video = await ctx.db.video.create({
        data: {
          cloudflareUid: upload.uid,
          status: "UPLOADING",
          title,
          mode: input.mode ?? "BOTH",
          durationSec: input.durationSec ?? null,
          ownerId: ctx.session.user.id,
          workspaceId: ctx.workspace.id,
        },
        select: { id: true, slug: true },
      });

      return {
        videoId: video.id,
        slug: video.slug,
        uploadURL: upload.uploadURL,
      };
    }),

  /**
   * Step 2: the browser finished POSTing the file to Cloudflare. Flip
   * UPLOADING → PROCESSING. The READY transition comes from the Stream webhook
   * (prod) or `syncStatus` polling (dev).
   */
  markUploaded: protectedProcedure
    .input(z.object({ videoId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: { id: input.videoId, ownerId: ctx.session.user.id },
        select: { id: true, status: true },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });
      if (video.status === "UPLOADING") {
        await ctx.db.video.update({
          where: { id: video.id },
          data: { status: "PROCESSING" },
        });
      }
      return { ok: true };
    }),

  /**
   * The browser upload to Cloudflare failed or was cancelled. Mark the reserved
   * row ERRORED and best-effort release the (empty) Stream asset, so it doesn't
   * linger as a permanent "Uploading…" card. Never demotes an already-READY row.
   */
  markFailed: protectedProcedure
    .input(z.object({ videoId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: { id: input.videoId, ownerId: ctx.session.user.id },
        select: { id: true, status: true, cloudflareUid: true },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });
      if (video.status === "READY") return { ok: true };

      if (video.cloudflareUid && isStreamConfigured()) {
        try {
          await deleteStreamVideo(video.cloudflareUid);
        } catch {
          // Best-effort — the row is still marked ERRORED below.
        }
      }
      await ctx.db.video.update({
        where: { id: video.id },
        data: { status: "ERRORED" },
      });
      return { ok: true };
    }),

  /**
   * Rename a recording from the watch room. Owner-only: non-owners get NOT_FOUND
   * so private/link slugs don't reveal ownership details.
   */
  updateTitle: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().trim().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: {
          slug: input.slug,
          ownerId: ctx.session.user.id,
          status: { not: "DELETED" },
        },
        select: { id: true },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });

      const updated = await ctx.db.video.update({
        where: { id: video.id },
        data: { title: input.title },
        select: { title: true },
      });

      return { title: updated.title };
    }),

  /**
   * Poll Cloudflare for a still-processing video and reconcile the DB row
   * (status, duration, thumbnail). Used as the dev fallback when the webhook
   * can't reach localhost; safe to call repeatedly.
   */
  syncStatus: protectedProcedure
    .input(z.object({ videoId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: { id: input.videoId, ownerId: ctx.session.user.id },
        select: {
          id: true,
          status: true,
          cloudflareUid: true,
          durationSec: true,
          thumbnailUrl: true,
        },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });

      if (
        !video.cloudflareUid ||
        video.status === "READY" ||
        video.status === "ERRORED" ||
        !isStreamConfigured()
      ) {
        return { status: video.status };
      }

      const cf = await getStreamVideo(video.cloudflareUid);
      const nextStatus = cf.readyToStream
        ? "READY"
        : cf.status.state === "error"
          ? "ERRORED"
          : "PROCESSING";

      await ctx.db.video.update({
        where: { id: video.id },
        data: {
          status: nextStatus,
          durationSec:
            cf.duration > 0 ? Math.round(cf.duration) : video.durationSec,
          thumbnailUrl: cf.thumbnail || video.thumbnailUrl,
        },
      });

      return { status: nextStatus };
    }),

  /**
   * Slug lookup for the /v/{slug} player, gated by the video's visibility:
   *   LINK      — anyone with the slug (the MVP default)
   *   PRIVATE   — owner only
   *   WORKSPACE — members of the video's workspace
   *   PASSWORD  — not served here yet (needs a password-verify flow)
   * Unauthorized access throws NOT_FOUND so the slug can't be probed.
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: { slug: input.slug, status: { not: "DELETED" } },
        select: {
          id: true,
          title: true,
          status: true,
          cloudflareUid: true,
          durationSec: true,
          createdAt: true,
          visibility: true,
          ownerId: true,
          workspaceId: true,
          owner: { select: { name: true, image: true } },
          transcript: { select: { status: true, cues: true } },
        },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });
      await assertCanView(ctx.db, video, ctx.session?.user?.id ?? null);

      return {
        id: video.id,
        title: video.title,
        canEditTitle: ctx.session?.user?.id === video.ownerId,
        status: video.status,
        cloudflareUid: video.cloudflareUid,
        durationSec: video.durationSec,
        createdAt: video.createdAt,
        owner: video.owner,
        transcript: {
          status: video.transcript?.status ?? "PENDING",
          cues: toCues(video.transcript?.cues),
        },
      };
    }),

  /**
   * Advance + return the transcript for the /v/{slug} room. Public (same gate as
   * getBySlug) and throttled. The watch page polls this while the video is READY
   * and the transcript isn't terminal yet.
   */
  syncTranscript: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.db.video.findFirst({
        where: { slug: input.slug, status: { not: "DELETED" } },
        select: {
          id: true,
          status: true,
          cloudflareUid: true,
          visibility: true,
          ownerId: true,
          workspaceId: true,
          transcript: true,
        },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });
      await assertCanView(ctx.db, video, ctx.session?.user?.id ?? null);

      const transcript = await advanceTranscript(ctx.db, video);
      return {
        status: transcript?.status ?? "PENDING",
        cues: toCues(transcript?.cues),
      };
    }),
});
