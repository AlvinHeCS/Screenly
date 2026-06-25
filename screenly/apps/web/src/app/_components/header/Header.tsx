import { NotificationBell } from "./NotificationBell";
import { ProfileAvatar } from "./ProfileAvatar";
import { SearchBar } from "./SearchBar";
import { SkipNavigation } from "./SkipNavigation";
import { VideoUsageMeter } from "./VideoUsageMeter";

/**
 * Reusable top navigation header (port of Loom's destination header).
 *
 * The `<header>`, `<ul>` header bar and the per-item `<li>` wrappers came from
 * external Loom CSS-module classes (`top-navigation_*`, `search-bar_*`,
 * `upgrade-prompt_*`) that the stylesheet recorded as "Could not read", so
 * their layout is reconstructed from the self-describing utility classes on
 * the markup (`sticky top:0 bgc:background`, `py:small md:py:medium`,
 * `items:center flex`, `shrink:0`, `pl:medium`, `ml:medium`) plus the resolved
 * `--lns-*` design tokens. Drop it onto any page above the main content.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div>
        <SkipNavigation />
        <ul className="flex w-full items-center px-[16px]">
          <li className="grow py-[8px] md:py-[16px]">
            <SearchBar />
          </li>
          <li className="flex items-center" />
          <li className="flex shrink-0 items-center">
            <VideoUsageMeter />
          </li>
          <li className="pl-[16px]" />
          <li className="ml-[16px]">
            <NotificationBell />
          </li>
          <li id="profileBubble" className="ml-[16px]">
            <ProfileAvatar />
          </li>
        </ul>
      </div>
    </header>
  );
}
