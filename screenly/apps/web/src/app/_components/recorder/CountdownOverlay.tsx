"use client";

import { useRecorder } from "./RecorderContext";

/**
 * The 3-2-1 pre-roll shown after a screen source is picked and before capture
 * begins. A big centered number over a dimmed full-screen layer; pressing Esc
 * (handled by RecorderOverlay) cancels back to the options panel.
 */
export function CountdownOverlay() {
  const { countdownValue } = useRecorder();

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[16px] bg-[hsla(224,72%,7%,0.46)]">
      <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-[hsla(228,6%,17%,0.9)] text-[80px] font-bold leading-none text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
        {countdownValue > 0 ? countdownValue : ""}
      </div>
      <p className="text-[14px] font-medium text-white">
        Get ready — press Esc to cancel
      </p>
    </div>
  );
}
