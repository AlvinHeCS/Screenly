"use client";

import { createContext, useContext } from "react";

export interface ProfileMenuContextValue {
  /** Whether the profile popover is currently shown. */
  isOpen: boolean;
  /** Open the profile popover. */
  open: () => void;
  /** Close the profile popover. */
  close: () => void;
  /** Toggle the profile popover (used by the header avatar trigger). */
  toggle: () => void;
}

export const ProfileMenuContext = createContext<ProfileMenuContextValue | null>(
  null,
);

/**
 * Read the profile popover state. Must be called from a component rendered
 * inside `<ProfileMenuProvider>` (which wraps the `/videos` page).
 */
export function useProfileMenu(): ProfileMenuContextValue {
  const ctx = useContext(ProfileMenuContext);
  if (!ctx) {
    throw new Error("useProfileMenu must be used within a ProfileMenuProvider");
  }
  return ctx;
}
