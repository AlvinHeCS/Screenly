import { redirect } from "next/navigation";

import { auth } from "@screenly/auth";

import { Header } from "~/app/_components/header/Header";
import { Sidebar } from "~/app/_components/sidebar/Sidebar";

export default async function VideosPage() {
  const session = await auth();

  // Guard the route: anyone not signed in gets bounced to the marketing page.
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Header />
        <main
          id="mainContent"
          className="mx-auto w-full max-w-[780px] px-[16px] py-[24px]"
        >
          <h1 className="text-[24px] font-[653] leading-[1.16] tracking-[-0.2px] text-[hsla(228,6%,17%,1)]">
            Videos
          </h1>
          <p className="mt-[8px] text-[14px] leading-[1.57] text-[hsla(224,5%,44%,1)]">
            Your recorded Looms will show up here.
          </p>
        </main>
      </div>
    </div>
  );
}
