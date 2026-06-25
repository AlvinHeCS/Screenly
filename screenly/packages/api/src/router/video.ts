import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
