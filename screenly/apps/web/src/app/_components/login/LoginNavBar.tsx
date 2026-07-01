import Link from "next/link";

import { ScreenlyLogoIcon } from "../sidebar/icons/ScreenlyLogoIcon";

// Top bar with the product wordmark.
export function LoginNavBar() {
  return (
    <header className="flex w-full items-center px-[24px] py-[16px]">
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
    </header>
  );
}
