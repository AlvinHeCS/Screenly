"use client";

import { createContext, useContext } from "react";

import type { RecorderEngine } from "./useRecorderEngine";

/**
 * Everything the recorder exposes: the open/close overlay controls plus the full
 * capture engine (phase machine, camera/mic toggles, and the
 * start/stop/pause/restart/cancel actions). See {@link RecorderEngine}.
 */
export type RecorderContextValue = RecorderEngine;

export const RecorderContext = createContext<RecorderContextValue | null>(null);

/**
 * Read the recorder state. Must be called from a component rendered inside
 * `<RecorderProvider>` (which wraps the `/videos` page).
 */
export function useRecorder(): RecorderContextValue {
  const ctx = useContext(RecorderContext);
  if (!ctx) {
    throw new Error("useRecorder must be used within a RecorderProvider");
  }
  return ctx;
}
