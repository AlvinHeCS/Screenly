import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@screenly/auth";

import { GoogleIcon } from "./_components/login/icons/GoogleIcon";
import { ScreenlyLogoIcon } from "./_components/sidebar/icons/ScreenlyLogoIcon";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/videos");
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#16161D]">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-[20px] py-[20px] sm:px-[32px]">
        <Link
          href="/"
          className="flex items-center gap-[10px]"
          aria-label="Screenly"
        >
          <ScreenlyLogoIcon className="h-[36px] w-[36px]" />
          <span className="text-[18px] font-semibold tracking-[0]">
            Screenly
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-[8px] border border-[#D8DBE2] bg-white px-[16px] py-[9px] text-[14px] font-semibold text-[#16161D] transition-colors duration-150 hover:bg-[#EEF2F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1868DB]"
        >
          Log in
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-[1180px] items-center gap-[48px] px-[20px] pb-[56px] pt-[28px] sm:px-[32px] lg:grid-cols-[0.92fr_1.08fr] lg:pb-[72px]">
        <div className="max-w-[560px]">
          <p className="mb-[18px] text-[14px] font-semibold uppercase tracking-[0.08em] text-[#1868DB]">
            Record, share, move faster
          </p>
          <h1 className="text-[44px] font-bold leading-[1.02] tracking-[0] text-[#101214] sm:text-[60px]">
            Share your screen in seconds.
          </h1>
          <p className="mt-[22px] max-w-[500px] text-[18px] leading-[1.55] text-[#4F5661]">
            Capture crisp walkthroughs, organize your videos, and send a single
            link to keep work moving.
          </p>

          <div className="mt-[34px] flex flex-col gap-[12px] sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-[52px] items-center justify-center gap-[12px] rounded-[8px] bg-[#1868DB] px-[20px] text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#1558B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1868DB] focus-visible:ring-offset-2"
            >
              <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white">
                <GoogleIcon className="h-[18px] w-[18px]" />
              </span>
              <span>Log in with Google</span>
            </Link>
          </div>
        </div>

        <ProductPreview />
      </section>
    </main>
  );
}

function ProductPreview() {
  return (
    <div
      className="overflow-hidden rounded-[8px] border border-[#D9DEE8] bg-white shadow-[0_18px_55px_rgba(28,39,57,0.14)]"
      aria-label="Screenly video library preview"
    >
      <div className="flex items-center justify-between border-b border-[#E5E8EF] px-[18px] py-[14px]">
        <div className="flex items-center gap-[10px]">
          <ScreenlyLogoIcon className="h-[28px] w-[28px]" />
          <div>
            <p className="text-[13px] font-semibold leading-[1.2] text-[#111318]">
              Workspace
            </p>
            <p className="text-[12px] leading-[1.2] text-[#7A818C]">
              Personal library
            </p>
          </div>
        </div>
        <div className="rounded-[999px] bg-[#E9F2FF] px-[10px] py-[5px] text-[12px] font-semibold text-[#1558B8]">
          Ready to share
        </div>
      </div>

      <div className="grid min-h-[440px] grid-cols-[86px_1fr] sm:grid-cols-[180px_1fr]">
        <aside className="border-r border-[#E5E8EF] bg-[#F4F6F9] px-[12px] py-[16px]">
          <div className="mb-[18px] h-[34px] rounded-[8px] bg-[#1868DB]" />
          <div className="space-y-[10px]">
            <div className="h-[28px] rounded-[7px] bg-white" />
            <div className="h-[28px] rounded-[7px] bg-[#DDE5F1]" />
            <div className="h-[28px] rounded-[7px] bg-[#DDE5F1]" />
          </div>
        </aside>

        <div className="p-[18px]">
          <div className="mb-[18px] flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[20px] font-bold leading-[1.2] text-[#111318]">
                Recent videos
              </p>
              <p className="mt-[4px] text-[13px] text-[#68707D]">
                Three updates shared this week
              </p>
            </div>
            <div className="h-[36px] w-[132px] rounded-[8px] bg-[#F0B429]" />
          </div>

          <div className="grid gap-[14px] sm:grid-cols-2">
            <PreviewTile
              color="#1868DB"
              title="Product walkthrough"
              duration="3:42"
            />
            <PreviewTile color="#36B37E" title="Bug report" duration="1:18" />
            <PreviewTile
              color="#6554C0"
              title="Design review"
              duration="5:04"
            />
            <PreviewTile color="#FF7452" title="Team update" duration="2:09" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewTile({
  color,
  title,
  duration,
}: {
  color: string;
  title: string;
  duration: string;
}) {
  return (
    <article className="overflow-hidden rounded-[8px] border border-[#E5E8EF] bg-white">
      <div
        className="flex aspect-video items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <div className="h-[42px] w-[42px] rounded-full bg-white/90" />
      </div>
      <div className="p-[12px]">
        <p className="truncate text-[14px] font-semibold text-[#111318]">
          {title}
        </p>
        <p className="mt-[5px] text-[12px] text-[#68707D]">{duration}</p>
      </div>
    </article>
  );
}
