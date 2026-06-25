"use server";

import { signIn } from "@screenly/auth";

// Kicks off the Google OAuth flow. New + returning users land on their videos
// dashboard after authenticating; `redirectTo` is Auth.js v5's callbackUrl and
// a relative path keeps it same-origin (Auth.js rejects cross-origin targets).
export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/videos" });
}
