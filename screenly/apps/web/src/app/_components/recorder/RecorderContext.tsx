"use client";

import { createContext, useContext } from "react";

export interface RecorderContextValue {
  /** Whether the recorder overlay is currently shown. */
  isOpen: boolean;
  /** Open the recorder overlay. */
  open: () => void;
  /** Close the recorder overlay. */
  close: () => void;
}

export const RecorderContext = createContext<RecorderContextValue | null>(null);

/**
 * Read the recorder overlay state. Must be called from a component rendered
 * inside `<RecorderProvider>` (which wraps the `/videos` page).
 */
export function useRecorder(): RecorderContextValue {
  const ctx = useContext(RecorderContext);
  if (!ctx) {
    throw new Error("useRecorder must be used within a RecorderProvider");
  }
  return ctx;
}
