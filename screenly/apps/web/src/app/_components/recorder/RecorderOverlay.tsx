"use client";

import { useEffect, useRef } from "react";

import { CameraBubble } from "./CameraBubble";
import { CountdownOverlay } from "./CountdownOverlay";
import { PreRecordingPanel } from "./PreRecordingPanel";
import { ReviewPanel } from "./ReviewPanel";
import { RecordingControls } from "./RecordingControls";
import { useRecorder } from "./RecorderContext";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen layer shown while the recorder is open. Renders by phase:
 *  - preview:   dimmed backdrop + options panel (top-right) + camera bubble
 *  - countdown: 3-2-1 overlay + camera bubble (Esc cancels back to preview)
 *  - recording/paused: controls rail + camera bubble (no backdrop)
 *  - review:    backdrop + playback/download panel
 *
 * Modal phases (preview, review) trap Tab and take initial focus; Escape closes
 * them. During recording Escape is ignored so it can't accidentally end a take.
 * Ports Loom's recorder shell using the `--lns-*` tokens (record red
 * `hsla(11.2,100%,58%,1)`, blurple `hsla(215.4,80%,47.65%,1)`, body
 * `hsla(228,6%,17%,1)`, backdrop `hsla(224,72%,7%,0.46)`).
 */
export function RecorderOverlay() {
  const { phase, close, cancelCountdown } = useRecorder();
  const panelRef = useRef<HTMLDivElement>(null);

  const isOpen = phase !== "idle";
  const isModal = phase === "preview" || phase === "review";

  // Restore focus to the trigger only when the overlay fully closes.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => previouslyFocused?.focus?.();
  }, [isOpen]);

  // Per-phase keyboard handling: initial focus + Tab trap for modal phases,
  // and a phase-aware Escape.
  useEffect(() => {
    if (!isOpen) return;

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );

    if (isModal) {
      const focusable = getFocusable();
      (focusable[0] ?? panelRef.current)?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (phase === "countdown") cancelCountdown();
        else if (isModal) close();
        return;
      }
      if (event.key !== "Tab" || !isModal) return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (active instanceof Node && !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isModal, phase, close, cancelCountdown]);

  if (!isOpen) return null;

  const showBubble = phase !== "review";
  const showControls = phase === "recording" || phase === "paused";

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000]">
      {/* Dimmed backdrop on modal phases — click outside to dismiss. The outer
          wrapper is click-through so non-modal phases (recording/paused) don't
          block the page; interactive children opt back in with pointer-events-auto. */}
      {isModal && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close recorder"
          onClick={close}
          className="pointer-events-auto absolute inset-0 h-full w-full cursor-default bg-[hsla(224,72%,7%,0.46)]"
        />
      )}

      {phase === "preview" && (
        <div
          ref={panelRef}
          className="pointer-events-auto absolute right-[32px] top-[32px]"
        >
          <PreRecordingPanel onClose={close} />
        </div>
      )}

      {phase === "countdown" && <CountdownOverlay />}

      {phase === "review" && (
        <div
          ref={panelRef}
          className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <ReviewPanel />
        </div>
      )}

      {/* Controls rail + camera bubble, bottom-left. */}
      {(showControls || showBubble) && (
        <div className="pointer-events-none absolute bottom-[32px] left-[32px] flex flex-col items-start gap-[16px]">
          {showControls && <RecordingControls />}
          {showBubble && <CameraBubble />}
        </div>
      )}
    </div>
  );
}
