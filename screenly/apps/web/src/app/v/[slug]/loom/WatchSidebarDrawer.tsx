"use client";

import { useEffect, useRef } from "react";

import { Sidebar } from "~/app/_components/sidebar/Sidebar";

export const WATCH_SIDEBAR_DRAWER_ID = "watch-sidebar-drawer";

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface WatchSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WatchSidebarDrawer({
  isOpen,
  onClose,
}: WatchSidebarDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstFocusable =
      drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    firstFocusable?.focus();

    return () => previouslyFocused?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900]">
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(9,10,12,0.24)]"
      />
      <aside
        id={WATCH_SIDEBAR_DRAWER_ID}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="absolute left-0 top-0 h-full bg-white shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
      >
        <Sidebar onCollapse={onClose} />
      </aside>
    </div>
  );
}
