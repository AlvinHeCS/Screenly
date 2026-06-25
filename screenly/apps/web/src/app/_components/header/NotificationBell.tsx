import { BellIcon } from "./icons/BellIcon";

interface NotificationBellProps {
  /** Badge label, e.g. "9+". Hidden when empty. */
  count?: string;
}

/**
 * Notification bell with a count badge. Button styling is from `.css-1q1s5qm`
 * (32×32, transparent, rounded 6px, hover/active background, focus-visible
 * ring) and the icon colour from `.css-1n93cg0` (body). The badge classes
 * (`_2rko… ` / `_19pk…`) and `.css-vgmi1o` were not present in the stylesheet
 * (external Atlassian Badge component), so the pill is reconstructed using the
 * danger colour token (`--lns-color-danger`, hsla(4,64%,48%,1)); positioning
 * comes from the resolved `.css-1qfim1i` (absolute, right -4px, top -6px).
 */
export function NotificationBell({ count = "9+" }: NotificationBellProps) {
  return (
    <div className="relative z-0 w-fit">
      <div className="inline-block align-middle">
        <div className="relative">
          {count ? (
            <div className="pointer-events-none absolute right-[-4px] top-[-6px] z-[1]">
              <span className="flex min-w-[16px] items-center justify-center rounded-full bg-[hsla(4,64%,48%,1)] px-[4px] text-[11px] font-bold leading-none text-white">
                {count}
              </span>
            </div>
          ) : null}
          <button
            aria-label="Notifications"
            className="relative inline-flex h-[32px] w-[32px] cursor-pointer appearance-none items-center justify-center rounded-[6px] border-none bg-transparent p-0 align-middle font-[inherit] outline-none transition-[background-color] duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)] hover:duration-300 active:bg-[hsla(225.5,56.9%,10%,0.14)] focus-visible:shadow-[0_0_0_2px_hsla(216.1,81.4%,60%,1)] disabled:pointer-events-none disabled:text-[hsla(223,5%,73%,1)]"
          >
            <span className="block h-[24px] w-[24px] text-[hsla(228,6%,17%,1)]">
              <BellIcon className="block h-full w-full p-[8%]" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
