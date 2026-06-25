"use client";

import { useEffect, useRef } from "react";

import { ProfileBubbleMenu } from "./ProfileBubbleMenu";
import { useProfileMenu } from "./ProfileMenuContext";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The profile popover shown when the header avatar is pressed. Ports Loom's
 * profile `<dialog>`: the narrow bubble menu, anchored under the avatar.
 *
 * Loom's `profile-bubble_*` module classes are not present in
 * `loom_style_guide.css`, so the layer's geometry is reconstructed: a fixed,
 * non-dimming popover (a profile menu is a popover, not a modal backdrop) with a
 * transparent click-catcher to dismiss on outside click, right-anchored just
 * under the sticky header (`top-[64px] right-[16px]`, lining the bubble up with
 * the avatar). Focus handling (trap, Escape to close, restore focus to the
 * trigger) mirrors `RecorderOverlay`. The popover panel can scroll vertically on
 * short viewports (`max-h` + `overflow-y-auto`).
 */
export function ProfileMenuOverlay() {
  const { isOpen, close } = useProfileMenu();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );

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
      {/* Transparent click-catcher — click outside the panel to dismiss. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close profile menu"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* Popover panel, right-anchored under the header. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Profile and personal settings"
        className="pointer-events-auto absolute right-[16px] top-[64px] max-h-[calc(100vh-80px)] overflow-y-auto"
      >
        <ProfileBubbleMenu onClose={close} />
      </div>
    </div>
  );
}
