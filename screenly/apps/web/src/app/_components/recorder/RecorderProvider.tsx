"use client";

import type { ReactNode } from "react";

import { RecorderContext } from "./RecorderContext";
import { useRecorderEngine } from "./useRecorderEngine";

/**
 * Owns the recorder's capture engine (phase machine, media streams, the
 * composited MediaRecorder) and exposes it through `RecorderContext`. Rendered
 * by the (server) `/videos` page so the sidebar's "Record a video" button and
 * the `RecorderOverlay` — passed in as children — share one engine.
 *
 * `children` is a stable element from the server page, so non-consumer shell
 * subtrees (sidebar, header, library) are NOT re-rendered when recorder state
 * ticks. Components that call `useRecorder()` (e.g. the sidebar RecordButton)
 * still re-render when the context value changes — about once per second while
 * recording, as `elapsedSec` advances — which is negligible for those.
 */
export function RecorderProvider({ children }: { children: ReactNode }) {
  const engine = useRecorderEngine();

  return (
    <RecorderContext.Provider value={engine}>
      {children}
    </RecorderContext.Provider>
  );
}
