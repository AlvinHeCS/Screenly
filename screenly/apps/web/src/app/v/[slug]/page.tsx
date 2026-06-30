import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { WatchView, type WatchData } from "./WatchView";

/**
 * Public-by-unguessable-slug video room at /v/{slug}. Server-fetches the initial
 * payload (player + transcript), then the client view polls until the video is
 * ready and the transcript is generated.
 */
export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let initial: WatchData;
  try {
    initial = await api.video.getBySlug({ slug });
  } catch {
    notFound();
  }

  return <WatchView slug={slug} initial={initial} />;
}
