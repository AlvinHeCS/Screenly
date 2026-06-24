/**
 * Shared UI primitives for the web app and the Electron renderer.
 * Starts tiny; the player, recorder controls, etc. land here in later phases.
 */

/** Join truthy class names — the one helper every component reaches for. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
