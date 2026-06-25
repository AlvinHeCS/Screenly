"use client";

import { useState } from "react";

import { SettingsIcon } from "./icons/SettingsIcon";

/**
 * The Settings row with its collapsible Personal/Workspace submenu.
 *
 * The trigger reuses Loom's `navigation_menuItem_KV7` row shape (here a
 * `<button aria-controls="settings-panel">` rather than an `<a>`) with the
 * `css-1a7lzif`, `css-1w3ibup` and `css-1xi9xlt` rules resolved from
 * `loom_style_guide.css`. The submenu (`#settings-panel`) ships `hidden` in the
 * source markup; the toggle here is reconstructed with `useState`. The
 * `navigation_adsVl_zLj` element was not in the recorded stylesheet — it is the
 * icon-width spacer that indents each submenu label beneath the parent label,
 * reconstructed as a 20px (icon-sized) leading gap.
 */
export function SettingsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-controls="settings-panel"
        onClick={() => setOpen((v) => !v)}
        className="block w-full cursor-pointer text-[hsla(228,6%,17%,1)]"
      >
        {/* navigation_root_mPG navigation_menuItemInner_Ljz */}
        <span className="flex w-full items-center rounded-[8px] px-[8px] py-[7px] transition-colors hover:bg-[#0515240f]">
          {/* css-1a7lzif (20px icon) */}
          <span className="block shrink-0 text-current">
            <SettingsIcon className="h-[20px] w-[20px] p-[8%]" />
          </span>
          {/* css-1w3ibup: 8px spacer */}
          <span aria-hidden className="block pr-[8px]" />
          {/* navigation_text_JrS > css-1xi9xlt */}
          <span className="block text-[14px] font-medium leading-[1.57]">
            Settings
          </span>
        </span>
      </button>

      <ul id="settings-panel" hidden={!open} className="m-0 list-none p-0">
        {[
          { label: "Personal", href: "/settings/account" },
          { label: "Workspace", href: "/settings/workspace" },
        ].map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_self">
              {/* flex flexDirection:row items:center navigation_menuItem_KV7 */}
              <div className="flex items-center rounded-[8px] px-[8px] py-[7px] no-underline transition-colors hover:bg-[#0515240f]">
                {/* navigation_adsVl_zLj: icon-width indent (reconstructed) */}
                <div aria-hidden className="w-[20px] shrink-0" />
                {/* css-1w3ibup: 8px spacer */}
                <span aria-hidden className="block pr-[8px]" />
                {/* css-1xi9xlt */}
                <span className="block text-[14px] font-medium leading-[1.57] text-[hsla(228,6%,17%,1)]">
                  {item.label}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
