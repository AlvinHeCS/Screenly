import Link from "next/link";

import { ScreenlyLogoIcon } from "~/app/_components/sidebar/icons/ScreenlyLogoIcon";

import { HeaderIconButton } from "./HeaderIconButton";
import { MainNavIcon } from "./icons/MainNavIcon";

interface WatchHeaderProps {
  isMainNavOpen?: boolean;
  mainNavControlsId?: string;
  onMainNavClick?: () => void;
}

/**
 * Sticky share-video header: main-nav toggle + logo on the left, then
 * the usage meter, Share split button, actions/search/notifications, and the
 * account avatar on the right.
 */
export function WatchHeader({
  isMainNavOpen = false,
  mainNavControlsId,
  onMainNavClick,
}: WatchHeaderProps) {
  return (
    <header className="sticky top-0 z-[103] flex h-[56px] items-center gap-[8px] border-b border-[#ececef] bg-white px-[16px]">
      <a
        href="#mainContent"
        className="sr-only focus:not-sr-only focus:rounded-[6px] focus:bg-[#f4f4f6] focus:px-[8px] focus:py-[4px] focus:text-[13px] focus:text-[#1d1c20]"
      >
        Skip to content
      </a>

      <HeaderIconButton
        label="Main nav"
        ariaControls={mainNavControlsId}
        ariaExpanded={isMainNavOpen}
        onClick={onMainNavClick}
      >
        <MainNavIcon className="h-[16px] w-[16px]" />
      </HeaderIconButton>

      <Link
        href="/"
        aria-label="Screenly home"
        className="flex items-center gap-[6px]"
      >
        <ScreenlyLogoIcon className="h-[24px] w-[24px] shrink-0" />
        <span className="text-[18px] font-semibold leading-none text-[#292a2e]">
          Screenly
        </span>
      </Link>

      <div className="ml-auto" />
    </header>
  );
}
