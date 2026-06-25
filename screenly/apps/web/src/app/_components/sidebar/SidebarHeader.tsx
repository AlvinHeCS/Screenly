import Link from "next/link";

import { CollapseSidebarIcon } from "./icons/CollapseSidebarIcon";
import { ScreenlyLogoIcon } from "./icons/ScreenlyLogoIcon";

/**
 * Sidebar header row: the Screenly wordmark and the collapse-sidebar button.
 *
 * Layout/sizing all resolved from `loom_style_guide.css`: `css-trha3p` (grid,
 * align-items:center, justify-content:space-between, grid-auto-flow:column,
 * gap 8px), `css-n7wfxh` (width 106.67px, margin-left 8px), `css-nez7wg`
 * (inline-block, vertical-align middle), `css-1c39lxe` (24×24 icon button,
 * rounded 4px, transparent, transition background-color 0.6s) and
 * `css-1y53iih` (block, colour body). The brand mark renders at 24px next to
 * the "Screenly" wordmark; the collapse icon renders at the wrapper's
 * `size="2.25"` (18px).
 */
export function SidebarHeader() {
  return (
    <div className="grid grid-flow-col items-center justify-between gap-[8px]">
      {/* css-n7wfxh */}
      <div className="ml-[8px] w-[106.67px]">
        <Link
          href="/"
          aria-label="Screenly home"
          className="flex items-center gap-[6px]"
        >
          <ScreenlyLogoIcon className="block h-[24px] w-[24px] shrink-0" />
          <span className="text-[18px] font-semibold leading-none tracking-[-0.01em] text-[#292a2e]">
            Screenly
          </span>
        </Link>
      </div>
      {/* css-nez7wg */}
      <div className="inline-block align-middle">
        <button
          aria-label="Collapse sidebar"
          className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[#0515240f] hover:duration-[300ms] active:bg-[#0b120e24]"
        >
          {/* css-1y53iih: colour body */}
          <span className="block text-[hsla(228,6%,17%,1)]">
            <CollapseSidebarIcon className="h-[18px] w-[18px] p-[8%]" />
          </span>
        </button>
      </div>
    </div>
  );
}
