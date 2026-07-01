"use client";

import { usePathname } from "next/navigation";

import { NavMenuItem } from "./NavMenuItem";
import { LibraryIcon } from "./icons/LibraryIcon";

const NAV_ITEMS = [
  { label: "Library", href: "/videos", Icon: LibraryIcon },
] as const;

/**
 * The sidebar `<nav>` (Loom's `navigation_menuList_gc9`).
 *
 * `css-198ncd` and `css-iektes` (both grid, grid-auto-flow:row, gap 2px;
 * `css-iektes` also list-style:none, margin/padding 0) were resolved from
 * `loom_style_guide.css`. The list holds the five primary destinations followed
 * by the Settings menu (rendered as a list row so it spans the full width like
 * the other destinations); then a divider, the Spaces section, another divider
 * and the Suggested section. A 20px top padding is applied to the list to space
 * it from the workspace selector above. `navigation_menuList_gc9` itself was not
 * in the recorded stylesheet and adds no resolved properties.
 */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="side">
      {/* css-198ncd */}
      <div className="grid grid-flow-row grid-cols-[1fr] items-center justify-start gap-[2px]">
        {/* css-iektes (+ 20px top padding) */}
        <ul
          id="intercom-destination-menu"
          className="m-0 grid list-none grid-flow-row grid-cols-[1fr] items-center justify-start gap-[2px] p-0 pt-[20px]"
        >
          {NAV_ITEMS.map(({ label, href, Icon }) => (
            <li key={href}>
              <NavMenuItem
                href={href}
                label={label}
                active={isActivePath(pathname, href)}
                icon={<Icon className="h-[20px] w-[20px] p-[8%]" />}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
