"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { ProfileMenuContext } from "./ProfileMenuContext";

/**
 * Holds the open/closed state for the profile popover and exposes it through
 * `ProfileMenuContext`. Rendered by the (server) `/videos` page so that both
 * the header's profile avatar and the `ProfileMenuOverlay` — passed in as
 * children — share the same state.
 */
export function ProfileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <ProfileMenuContext.Provider value={value}>
      {children}
    </ProfileMenuContext.Provider>
  );
}
