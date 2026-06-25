import { FollowAddIcon } from "./icons/FollowAddIcon";
import { FollowRemoveIcon } from "./icons/FollowRemoveIcon";

/**
 * The "Suggested" section with a single follow-suggestion row.
 *
 * Heading uses `css-6787gv` (block, pb 8px, pl 4px) + `css-1codye8` (14px,
 * font-weight 653, colour #6B6E76), resolved from `loom_style_guide.css`. The
 * row reuses the `navigation_menuItem_KV7` shape with the `css-4a2gry` avatar
 * (20×20, rounded-full) wrapping the `css-qpzrua` gravatar image, and the
 * `css-1ule054` action cluster (`css-1c39lxe` 24px buttons + `css-95zwth`
 * colour #6B6E76, size 2.25 → 18px icons). The external module classes
 * `navigation_shouldDim_jGF` (dims the row) and `suggested-follows_navIcon_Gby`
 * (reveals the follow/hide buttons on hover) were not recorded, so they are
 * reconstructed with `opacity` + `group-hover`.
 */
export function SuggestedSection() {
  return (
    <div>
      {/* navigation_librariesHeading_qqM */}
      <div>
        {/* css-6787gv */}
        <div className="block pb-[8px] pl-[4px]">
          <span className="block text-[14px] font-[653] leading-[1.57] text-[#6B6E76]">
            Suggested
          </span>
        </div>
      </div>

      {/* css-gn0a2q */}
      <div className="block align-middle">
        <a
          href="/profile/Lyra-f422b334-0bbc-45fe-b349-d558aa88ac5b"
          className="group block cursor-pointer text-[14px] leading-[1.57] text-[hsla(228,6%,17%,1)] no-underline opacity-80 transition-opacity hover:opacity-100"
        >
          {/* css-2m39qo */}
          <div className="grid grid-flow-col items-center justify-between">
            {/* navigation_root_mPG navigation_menuItemInner_Ljz */}
            <span className="flex w-full items-center rounded-[8px] px-[8px] py-[7px] transition-colors group-hover:bg-[#0515240f]">
              {/* css-1a7lzif > css-4a2gry avatar */}
              <span className="block shrink-0 text-current">
                <span className="relative z-0 flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-full bg-white leading-none font-[653] text-[hsla(216.3,69.2%,23%,1)]">
                  {/* css-qpzrua */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Lyra Technologies"
                    src="https://secure.gravatar.com/avatar/4fffb22684c50c2a9ed967eabacac843?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FLT-3.png"
                    className="h-[20px] w-[20px] max-w-full"
                  />
                </span>
              </span>
              {/* css-1w3ibup: 8px spacer */}
              <span aria-hidden className="block pr-[8px]" />
              {/* navigation_text_JrS > css-16fnn59 */}
              <span className="block overflow-hidden">
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[1.57]">
                  Lyra Technologies
                </span>
              </span>
            </span>
            {/* css-1ule054 — follow/hide actions, revealed on hover */}
            <div className="grid grid-flow-col items-center justify-start opacity-0 transition-opacity group-hover:opacity-100">
              <button
                aria-label="Add"
                className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[#0515240f] hover:duration-[300ms] active:bg-[#0b120e24]"
              >
                <span className="block text-[#6B6E76]">
                  <FollowAddIcon className="h-[18px] w-[18px] p-[8%]" />
                </span>
              </button>
              <button
                aria-label="Remove"
                className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[#0515240f] hover:duration-[300ms] active:bg-[#0b120e24]"
              >
                <span className="block text-[#6B6E76]">
                  <FollowRemoveIcon className="h-[18px] w-[18px] p-[8%]" />
                </span>
              </button>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
