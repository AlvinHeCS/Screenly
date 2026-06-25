"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { RecorderContext } from "./RecorderContext";

/**
 * Holds the open/closed state for the recorder overlay and exposes it through
 * `RecorderContext`. Rendered by the (server) `/videos` page so that both the
 * sidebar's "Record a video" button and the `RecorderOverlay` — passed in as
 * children — share the same state.
 */
export function RecorderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <RecorderContext.Provider value={value}>
      {children}
    </RecorderContext.Provider>
  );
}
