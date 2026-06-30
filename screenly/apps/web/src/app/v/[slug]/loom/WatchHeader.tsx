import Link from "next/link";

import { Avatar } from "./Avatar";
import { HeaderIconButton } from "./HeaderIconButton";
import { ShareButton } from "./ShareButton";
import { UsageMeter } from "./UsageMeter";
import { LoomLogo } from "./icons/LoomLogo";
import { MainNavIcon } from "./icons/MainNavIcon";
import { NotificationsIcon } from "./icons/NotificationsIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { ToggleActionsIcon } from "./icons/ToggleActionsIcon";

interface WatchHeaderProps {
  usageLabel: string;
  notificationsLabel: string;
  avatarSrc?: string;
  avatarAlt: string;
  avatarInitials: string;
  isMainNavOpen?: boolean;
  mainNavControlsId?: string;
  onMainNavClick?: () => void;
}

/**
 * Loom's sticky share-video header: main-nav toggle + logo on the left, then
 * the usage meter, Share split button, actions/search/notifications, and the
 * account avatar on the right.
 */
export function WatchHeader({
  usageLabel,
  notificationsLabel,
  avatarSrc,
  avatarAlt,
  avatarInitials,
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

      <Link href="/" aria-label="Loom home" className="flex items-center">
        <LoomLogo className="h-[24px] w-auto" />
      </Link>

      <div className="ml-auto flex items-center gap-[16px]">
        <UsageMeter label={usageLabel} />
        <ShareButton />

        <div className="flex items-center gap-[4px]">
          <HeaderIconButton label="Toggle actions">
            <ToggleActionsIcon className="h-[16px] w-[16px]" />
          </HeaderIconButton>
          <HeaderIconButton label="Search">
            <SearchIcon className="h-[16px] w-[16px]" />
          </HeaderIconButton>
          <div className="relative">
            <HeaderIconButton label="Notifications">
              <NotificationsIcon className="h-[16px] w-[16px]" />
            </HeaderIconButton>
            <span className="pointer-events-none absolute -right-[2px] -top-[2px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#e5484d] px-[4px] text-[10px] font-bold leading-none text-white">
              {notificationsLabel}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Account menu for ${avatarAlt}`}
          className="ml-[8px] flex h-[32px] w-[32px] shrink-0 overflow-hidden rounded-full"
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={avatarAlt}
              src={avatarSrc}
              className="h-[32px] w-[32px] max-w-full rounded-full object-cover"
            />
          ) : (
            <Avatar
              initials={avatarInitials}
              className="h-[32px] w-[32px] bg-[#2c6ae4] text-[13px]"
            />
          )}
        </button>
      </div>
    </header>
  );
}
