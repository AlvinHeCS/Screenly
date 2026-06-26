import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

/**
 * Public-by-unguessable-slug video player at /v/{slug}. Embeds the Cloudflare
 * Stream iframe once the asset is READY; otherwise shows the encoding state.
 */
export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let video;
  try {
    video = await api.video.getBySlug({ slug });
  } catch {
    notFound();
  }

  const isReady = video.status === "READY" && Boolean(video.cloudflareUid);

  return (
    <main className="flex min-h-screen flex-col bg-[hsla(228,6%,17%,1)] text-white">
      <header className="flex items-center justify-between px-[24px] py-[16px]">
        <Link
          href="/videos"
          className="text-[14px] font-medium text-[hsla(0,0%,100%,0.7)] transition-colors hover:text-white"
        >
          ← Library
        </Link>
      </header>

      <div className="mx-auto w-full max-w-[960px] px-[24px] pb-[48px]">
        <div className="overflow-hidden rounded-[12px] bg-black shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {isReady ? (
            <iframe
              src={`https://iframe.videodelivery.net/${video.cloudflareUid}`}
              title={video.title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center text-[14px] text-[hsla(0,0%,100%,0.7)]">
              {video.status === "ERRORED"
                ? "This recording failed to process."
                : "This recording is still processing — check back in a moment."}
            </div>
          )}
        </div>

        <h1 className="mt-[16px] text-[20px] font-semibold">{video.title}</h1>
        <p className="mt-[4px] text-[13px] text-[hsla(0,0%,100%,0.6)]">
          {video.owner.name ?? "Unknown"}
        </p>
      </div>
    </main>
  );
}
