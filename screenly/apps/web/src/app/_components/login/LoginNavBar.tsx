import Link from "next/link";

import { signInWithGoogle } from "./actions";
import { ScreenlyLogoIcon } from "../sidebar/icons/ScreenlyLogoIcon";

// Top bar: Screenly brand on the left, "Sign up for free" on the right. OAuth
// sign-up and sign-in are the same flow, so the CTA hands off to Google too.
export function LoginNavBar() {
  return (
    <header className="flex w-full items-center justify-between px-[24px] py-[16px]">
      <Link
        href="/"
        aria-label="Screenly"
        className="flex items-center gap-[10px]"
      >
        <ScreenlyLogoIcon className="h-[28px] w-[28px]" />
        <span className="text-[22px] font-bold leading-none text-[#16161D]">
          Screenly
        </span>
      </Link>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="rounded-[8px] border border-[#DCDCE3] px-[16px] py-[8px] text-[14px] font-semibold text-[#16161D] transition-colors duration-150 hover:bg-[#F4F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1868DB]"
        >
          <span>Sign up for free</span>
        </button>
      </form>
    </header>
  );
}
