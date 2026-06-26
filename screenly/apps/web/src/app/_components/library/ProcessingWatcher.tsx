"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

const POLL_MS = 5000;
const MAX_ATTEMPTS = 60; // ~5 minutes — realistic for Cloudflare encodes

/**
 * Polls `video.syncStatus` for videos still encoding and refreshes the library
 * when one becomes Ready/Errored. This is the dev-time fallback for the
 * Cloudflare Stream webhook (which can't reach localhost). In production the
 * webhook updates the row and a normal navigation reflects it. Renders nothing.
 *
 * `idsKey` is the comma-joined list of pending video ids (a stable string prop
 * so the effect only restarts when the pending set actually changes).
 */
export function ProcessingWatcher({ idsKey }: { idsKey: string }) {
  const router = useRouter();
  const syncStatus = api.video.syncStatus.useMutation();

  // Hold the latest mutate fn in a ref so the polling effect doesn't restart
  // every time the mutation's internal state changes.
  const syncRef = useRef(syncStatus.mutateAsync);
  syncRef.current = syncStatus.mutateAsync;

  useEffect(() => {
    if (!idsKey) return;
    const ids = idsKey.split(",");
    const reported = new Set<string>(); // ids that already reached a terminal state
    let cancelled = false;
    let inFlight = false;
    let attempts = 0;

    const finish = () => {
      window.clearInterval(interval);
      // Re-render once with whatever the webhook/poll has written, so a card
      // never stays stuck on "Processing…" after we stop polling.
      if (!cancelled) router.refresh();
    };

    const interval = window.setInterval(() => {
      if (inFlight) return; // don't stack batches if a poll is slow
      attempts += 1;
      if (attempts > MAX_ATTEMPTS) {
        finish();
        return;
      }
      inFlight = true;
      void (async () => {
        let changed = false;
        for (const id of ids) {
          if (reported.has(id)) continue;
          try {
            const result = await syncRef.current({ videoId: id });
            if (result.status === "READY" || result.status === "ERRORED") {
              reported.add(id);
              changed = true;
            }
          } catch {
            // Transient — try again next tick.
          }
        }
        inFlight = false;
        if (cancelled) return;
        if (changed) router.refresh();
        // Everything resolved — stop early instead of spinning to the cap.
        if (reported.size === ids.length) window.clearInterval(interval);
      })();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [idsKey, router]);

  return null;
}
