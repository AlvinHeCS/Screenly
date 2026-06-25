"use client";

import { useEffect, useRef } from "react";

import { CameraBubble } from "./CameraBubble";
import { PreRecordingPanel } from "./PreRecordingPanel";
import { RecordingControls } from "./RecordingControls";
import { useRecorder } from "./RecorderContext";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen layer shown when the "Record a video" button is pressed. Ports
 * Loom's recorder extension UI: a dimmed backdrop, the pre-recording options
 * panel (modal), the draggable camera bubble, and the (pre-recording, disabled)
 * recording-controls rail.
 *
 * The recorder markup uses the Chrome extension's own emotion classes
 * (`content-*`, `bubble-controls-*`) which are NOT present in
 * `loom_style_guide.css`, so the shell layout is reconstructed from the resolved
 * icon/text classes plus the `--lns-*` design tokens (record red
 * `hsla(11.2,100%,58%,1)`, blurple `hsla(215.4,80%,47.65%,1)`, body
 * `hsla(228,6%,17%,1)`, backdrop `hsla(224,72%,7%,0.46)`, border
 * `hsla(225.5,57%,10%,0.14)`).
 */
export function RecorderOverlay() {
  const { isOpen, close } = useRecorder();
  const panelRef = useRef<HTMLDivElement>(null);

  // While open: move focus into the dialog, trap Tab inside the panel, close on
  // Escape, and restore focus to the trigger on close (aria-modal semantics).
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    // Move focus into the panel once it has mounted.
    const focusable = getFocusable();
    (focusable[0] ?? panelRef.current)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

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
        // Focus escaped the dialog — pull it back in.
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Dimmed backdrop — click outside the panel to dismiss. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close recorder"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-[hsla(224,72%,7%,0.46)]"
      />

      {/* Pre-recording options panel — top right. */}
      <div
        ref={panelRef}
        className="pointer-events-auto absolute right-[32px] top-[32px]"
      >
        <PreRecordingPanel onClose={close} />
      </div>

      {/* Camera bubble bottom-left, with the vertical controls rail above it. */}
      <div className="pointer-events-none absolute bottom-[32px] left-[32px] flex flex-col items-start gap-[16px]">
        <RecordingControls />
        <CameraBubble />
      </div>
    </div>
  );
}
