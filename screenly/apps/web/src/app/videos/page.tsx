import { redirect } from "next/navigation";

import { auth } from "@screenly/auth";

import { Header } from "~/app/_components/header/Header";
import { LibraryView } from "~/app/_components/library/LibraryView";
import { ProfileMenuOverlay } from "~/app/_components/profile-menu/ProfileMenuOverlay";
import { ProfileMenuProvider } from "~/app/_components/profile-menu/ProfileMenuProvider";
import { RecorderOverlay } from "~/app/_components/recorder/RecorderOverlay";
import { RecorderProvider } from "~/app/_components/recorder/RecorderProvider";
import { Sidebar } from "~/app/_components/sidebar/Sidebar";
import { api } from "~/trpc/server";

export default async function VideosPage() {
  const session = await auth();

  // Guard the route: anyone not signed in gets bounced to the marketing page.
  if (!session?.user) {
    redirect("/");
  }

  // The video collection — newest first, scoped to the caller's workspace.
  // Returns [] when the user has no videos/workspace, which renders the empty state.
  const videos = await api.video.list();

  return (
    <ProfileMenuProvider>
      <RecorderProvider>
        <div className="flex h-screen overflow-hidden bg-white">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <Header userName={session.user.name ?? session.user.email ?? "User"} />
            {/* mainContentSection — `--pagePadding` is read by the tab bar's
                negative-margin bleed in LibraryTabs; 24px horizontal gutter. */}
            <main
              id="mainContent"
              className="w-full px-[24px] py-[24px] [--pagePadding:24px]"
            >
              <LibraryView videos={videos} />
            </main>
          </div>
        </div>
        <RecorderOverlay />
      </RecorderProvider>
      <ProfileMenuOverlay />
    </ProfileMenuProvider>
  );
}
