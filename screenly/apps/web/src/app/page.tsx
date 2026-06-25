import { auth, signIn, signOut } from "@screenly/auth";

import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();
  const health = await api.health.check();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#0b0b14] to-[#15162c] text-white">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Screen<span className="text-[hsl(280,100%,70%)]">ly</span>
        </h1>
        <p className="text-lg text-white/60">Record your screen. Share a link.</p>

        {session?.user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">
              Signed in as{" "}
              <span className="font-semibold">
                {session.user.name ?? session.user.email}
              </span>
            </p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              // New + returning users land on their videos dashboard after
              // authenticating. `redirectTo` is Auth.js v5's callbackUrl; a
              // relative path keeps it same-origin (Auth.js rejects others).
              await signIn("google", { redirectTo: "/videos" });
            }}
          >
            <button className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20">
              Sign in with Google
            </button>
          </form>
        )}

        <p className="text-xs text-white/30">
          api status: {health.ok ? "ok" : "down"} · {health.time}
        </p>
      </main>
    </HydrateClient>
  );
}
