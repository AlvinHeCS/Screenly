import Link from "next/link";

import { ScreenlyLogoIcon } from "../sidebar/icons/ScreenlyLogoIcon";

// Top bar with the product wordmark.
export function LoginNavBar() {
  return (
    <header className="flex w-full items-center px-[24px] py-[16px]">
      <Link href="/" aria-label="Screenly" className="flex items-center gap-[6px]">
        <ScreenlyLogoIcon className="h-[28px] w-[28px]" />
        <span className="text-[20px] font-semibold leading-none text-[#292a2e]">
          Screenly
        </span>
      </Link>
    </header>
  );
}
