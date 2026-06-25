import type { ReactNode } from "react";

interface NavMenuItemProps {
  /** Leading icon or avatar node (sized by the caller, typically 20px). */
  icon: ReactNode;
  label: string;
  href: string;
  /** aria-current="page" + active blurpleDark colour when true. */
  active?: boolean;
  /** Optional trailing node (e.g. an info icon), right-aligned. */
  trailing?: ReactNode;
  /** Lower opacity for suggested/dimmed rows (navigation_shouldDim_jGF). */
  dim?: boolean;
}

/**
 * A single sidebar navigation row (Loom's `navigation_menuItem_KV7`).
 *
 * The captured `navigation_menuItem_KV7` rule supplied the grid/space-between
 * layout, the 14px/1.57 type and the colour (body `hsla(228,6%,17%,1)`,
 * switching to active blurpleDark `hsla(215.9,79.9%,41%,1)`). The inner wrapper
 * classes `navigation_root_mPG` / `navigation_menuItemInner_Ljz` were not in the
 * recorded stylesheet, so the row's padding and rounded hover highlight are a
 * faithful best-effort reconstruction. The `css-2m39qo`, `css-1a7lzif`,
 * `css-1w3ibup` and `css-16fnn59` utility rules were resolved from
 * `loom_style_guide.css`.
 */
export function NavMenuItem({
  icon,
  label,
  href,
  active = false,
  trailing,
  dim = false,
}: NavMenuItemProps) {
  return (
    <div className="block align-middle">
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block cursor-pointer text-[14px] leading-[1.57] no-underline ${
          active ? "text-[hsla(215.9,79.9%,41%,1)]" : "text-[hsla(228,6%,17%,1)]"
        } ${dim ? "opacity-60" : ""}`}
      >
        {/* css-2m39qo: grid; align-items:center; justify-content:space-between; grid-auto-flow:column */}
        <div className="grid grid-flow-col items-center justify-between">
          {/* navigation_root_mPG navigation_menuItemInner_Ljz (best-effort padding/hover) */}
          <span className="flex w-full items-center rounded-[8px] px-[8px] py-[7px] transition-colors hover:bg-[#0515240f]">
            {/* css-1a7lzif: color:currentcolor */}
            <span className="block shrink-0 text-current">{icon}</span>
            {/* css-1w3ibup: 8px spacer */}
            <span aria-hidden className="block pr-[8px]" />
            {/* navigation_text_JrS > navigation_linkTitle_vzf css-16fnn59 */}
            <span className="block overflow-hidden">
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[1.57]">
                {label}
              </span>
            </span>
          </span>
          {trailing}
        </div>
      </a>
    </div>
  );
}
