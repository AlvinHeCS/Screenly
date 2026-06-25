import type { LibraryVisibility } from "./types";

/** "5 min" / "1 min" — matches Loom's library duration badge. */
export function formatDuration(durationSec: number | null): string | null {
  if (!durationSec || durationSec <= 0) return null;
  const minutes = Math.max(1, Math.round(durationSec / 60));
  return `${minutes} min`;
}

/** Compact "6 days" / "3 hours" / "just now" relative label. */
export function relativeTimeFromNow(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${unit}${value === 1 ? "" : "s"}`;
  }
  return "just now";
}

const VISIBILITY_LABELS: Record<LibraryVisibility, string> = {
  PRIVATE: "Not shared",
  LINK: "Anyone with the link",
  WORKSPACE: "Your workspace",
  PASSWORD: "Password protected",
};

export function visibilityLabel(visibility: LibraryVisibility): string {
  return VISIBILITY_LABELS[visibility];
}

/** Up to two-letter initials for the avatar fallback. */
export function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}
