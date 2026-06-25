"use server";

import { signOut } from "@screenly/auth";

/**
 * Sign the current user out and return them to the marketing page. Mirrors the
 * home page's `signOut()` server action (Auth.js v5); `redirectTo: "/"` sends the
 * user to a public route since `/videos` is auth-guarded.
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
