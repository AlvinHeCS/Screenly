import { redirect } from "next/navigation";

import { auth, signOut } from "@screenly/auth";

/**
 * The signed-in home — where users land right after signing up. Recording +
 * Cloudflare Stream playback land in a later roadmap step; for now this is the
 * empty-state dashboard.
 */
export default async function VideosPage() {
  const session = await auth();

  // Guard the route: anyone not signed in gets bounced to the marketing page.
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#0b0b14] to-[#15162c] text-white">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Screen<span className="text-[hsl(280,100%,70%)]">ly</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">
            {session.user.name ?? session.user.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold transition hover:bg-white/20">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold">Your videos</h2>
        <p className="max-w-md text-white/60">
          No videos yet. Record your screen to share your first link.
        </p>
      </section>
    </main>
  );
}
