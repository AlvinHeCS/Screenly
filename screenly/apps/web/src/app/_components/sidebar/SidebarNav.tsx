import { NavMenuItem } from "./NavMenuItem";
import { SettingsMenu } from "./SettingsMenu";
import { SpacesSection } from "./SpacesSection";
import { SuggestedSection } from "./SuggestedSection";
import { ForYouIcon } from "./icons/ForYouIcon";
import { LibraryIcon } from "./icons/LibraryIcon";
import { MeetingsIcon } from "./icons/MeetingsIcon";
import { RecentIcon } from "./icons/RecentIcon";
import { WatchLaterIcon } from "./icons/WatchLaterIcon";

/** css-1n7vqrn (py 20px) wrapping css-1hfrlgz (1px bottom border #0B120E24). */
function Divider() {
  return (
    <div className="block py-[20px] align-middle">
      <div className="border-b border-[#0B120E24]" />
    </div>
  );
}

const NAV_ITEMS = [
  { label: "For you", href: "/home", Icon: ForYouIcon, active: false },
  { label: "Library", href: "/looms", Icon: LibraryIcon, active: true },
  { label: "Meetings", href: "/meetings", Icon: MeetingsIcon, active: false },
  { label: "Watch later", href: "/watch-later", Icon: WatchLaterIcon, active: false },
  { label: "Recent", href: "/history", Icon: RecentIcon, active: false },
] as const;

/**
 * The sidebar `<nav>` (Loom's `navigation_menuList_gc9`).
 *
 * `css-198ncd` and `css-iektes` (both grid, grid-auto-flow:row, gap 2px;
 * `css-iektes` also list-style:none, margin/padding 0) were resolved from
 * `loom_style_guide.css`. The list holds the five primary destinations, then
 * the Settings menu, a divider, the Spaces section, another divider and the
 * Suggested section — the exact child order confirmed from the source markup.
 * `navigation_menuList_gc9` itself was not in the recorded stylesheet and adds
 * no resolved properties.
 */
export function SidebarNav() {
  return (
    <nav aria-label="side">
      {/* css-198ncd */}
      <div className="grid grid-flow-row grid-cols-[1fr] items-center justify-start gap-[2px]">
        {/* css-iektes */}
        <ul
          id="intercom-destination-menu"
          className="m-0 grid list-none grid-flow-row grid-cols-[1fr] items-center justify-start gap-[2px] p-0"
        >
          {NAV_ITEMS.map(({ label, href, Icon, active }) => (
            <li key={href}>
              <NavMenuItem
                href={href}
                label={label}
                active={active}
                icon={<Icon className="h-[20px] w-[20px] p-[8%]" />}
              />
            </li>
          ))}
        </ul>

        <SettingsMenu />
        <Divider />
        <SpacesSection />
        <Divider />
        <SuggestedSection />
      </div>
    </nav>
  );
}
