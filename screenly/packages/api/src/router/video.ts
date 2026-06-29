import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createDirectUpload,
  deleteStreamVideo,
  getStreamVideo,
  isStreamConfigured,
} from "../cloudflare";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  workspaceProcedure,
} from "../trpc";

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
        },
      });
      if (!video) throw new TRPCError({ code: "NOT_FOUND" });

      const userId = ctx.session?.user?.id ?? null;
      let canView = false;
      switch (video.visibility) {
        case "LINK":
          canView = true;
          break;
        case "PRIVATE":
          canView = userId !== null && userId === video.ownerId;
          break;
        case "WORKSPACE":
          canView =
            userId !== null &&
            (await ctx.db.membership.findFirst({
              where: { userId, workspaceId: video.workspaceId },
              select: { id: true },
            })) !== null;
          break;
        case "PASSWORD":
          canView = false;
          break;
      }
      if (!canView) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        id: video.id,
        title: video.title,
        status: video.status,
        cloudflareUid: video.cloudflareUid,
        durationSec: video.durationSec,
        createdAt: video.createdAt,
        owner: video.owner,
      };
    }),
});
