interface ProfileMenuItemProps {
  label: string;
  /** When present the item is a link; otherwise it renders as a button. */
  href?: string;
}

const ITEM_CLASS =
  "flex w-full cursor-pointer rounded-[8px] bg-transparent px-[8px] py-[8px] text-left transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]";

const LABEL_CLASS =
  "text-[14px] font-normal leading-[1.57] text-[hsla(228,6%,17%,1)]";

/**
 * A single row in the bubble menu list (`css-1p4ipkg` → `css-a4uw7l` →
 * `css-1uavoj5`). Renders an `<a>` when `href` is given, otherwise a `<button>`,
 * matching the source markup (some rows are links, some are buttons). Hover
 * background uses `--lns-color-backgroundHover`.
 */
export function ProfileMenuItem({ label, href }: ProfileMenuItemProps) {
  if (href) {
    return (
      <a href={href} className={ITEM_CLASS}>
        <span className={LABEL_CLASS}>{label}</span>
      </a>
    );
  }

  return (
    <button type="button" className={ITEM_CLASS}>
      <span className={LABEL_CLASS}>{label}</span>
    </button>
  );
}
