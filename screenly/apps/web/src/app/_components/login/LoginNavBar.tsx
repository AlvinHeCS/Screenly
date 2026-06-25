import { signInWithGoogle } from "./actions";
import { LoomWordmarkIcon } from "./icons/LoomWordmarkIcon";

// Top bar: Loom wordmark on the left, "Sign up for free" on the right. OAuth
// sign-up and sign-in are the same flow, so the CTA hands off to Google too.
export function LoginNavBar() {
  return (
    <header className="flex w-full items-center justify-between px-[24px] py-[16px]">
      <a href="/" aria-label="Loom" className="flex items-center">
        <LoomWordmarkIcon className="h-[28px] w-auto" />
      </a>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="rounded-[8px] border border-[#DCDCE3] px-[16px] py-[8px] text-[14px] font-semibold text-[#16161D] transition-colors duration-150 hover:bg-[#F4F5F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#625DF5]"
        >
          <span>Sign up for free</span>
        </button>
      </form>
    </header>
  );
}
