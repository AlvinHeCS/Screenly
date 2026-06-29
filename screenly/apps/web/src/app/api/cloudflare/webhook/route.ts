import { type NextRequest } from "next/server";

import { getStreamVideo, verifyStreamWebhook } from "@screenly/api/cloudflare";
import { db } from "@screenly/db";

/**
 * Cloudflare Stream webhook. Fires when an asset finishes (or fails) encoding.
 * We verify the HMAC signature, then reconcile the matching Video row:
 * PROCESSING → READY (+ duration, thumbnail) or → ERRORED.
 *
 * Configure the webhook URL + secret in the Cloudflare Stream dashboard and set
 * STREAM_WEBHOOK_SECRET. Locally (no public URL) the recorder falls back to the
 * `video.syncStatus` poll instead.
 */
interface StreamWebhookPayload {
  uid?: string;
  readyToStream?: boolean;
  status?: { state?: string };
  duration?: number;
  thumbnail?: string;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("webhook-signature");

  if (!verifyStreamWebhook(signature, raw)) {
    return new Response("Invalid signature", { status: 403 });
  }

  let payload: StreamWebhookPayload;
  try {
    payload = JSON.parse(raw) as StreamWebhookPayload;
  } catch {
    return new Response("Invalid body", { status: 400 });
  }

  const uid = payload.uid;
  if (!uid) return new Response("Missing uid", { status: 400 });

  const video = await db.video.findUnique({
    where: { cloudflareUid: uid },
    select: { id: true, status: true, durationSec: true, thumbnailUrl: true },
  });
  // 200 even when unknown/terminal so Cloudflare doesn't retry, and a late
  // duplicate webhook can't resurrect a READY/ERRORED video.
  if (
    !video ||
    video.status === "READY" ||
    video.status === "ERRORED" ||
    video.status === "DELETED"
  ) {
    return new Response("OK", { status: 200 });
  }

  const nextStatus = payload.readyToStream
    ? "READY"
    : payload.status?.state === "error"
      ? "ERRORED"
      : "PROCESSING";

  // On READY, prefer the authoritative asset metadata so this path and
  // `video.syncStatus` produce identical rows even if the webhook body omits
  // duration/thumbnail.
  let duration = payload.duration;
  let thumbnail = payload.thumbnail;
  if (nextStatus === "READY") {
    try {
      const asset = await getStreamVideo(uid);
      if (asset.duration > 0) duration = asset.duration;
      if (asset.thumbnail) thumbnail = asset.thumbnail;
    } catch {
      // Fall back to the (signed) webhook payload values below.
    }
  }

  await db.video.update({
    where: { id: video.id },
    data: {
      status: nextStatus,
      durationSec:
        duration && duration > 0 ? Math.round(duration) : video.durationSec,
      thumbnailUrl: thumbnail ?? video.thumbnailUrl,
    },
  });

  return new Response("OK", { status: 200 });
}
