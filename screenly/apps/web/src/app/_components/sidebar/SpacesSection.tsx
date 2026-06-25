import { NavMenuItem } from "./NavMenuItem";
import { InfoIcon } from "./icons/InfoIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { SpacesIcon } from "./icons/SpacesIcon";

/**
 * The "Spaces" section: heading + create button, "View all spaces", and the
 * "All Lyratechnologies" space row.
 *
 * Heading layout resolved from `loom_style_guide.css`:
 *   navigation_librariesHeading_qqM `pb:small pl:xsmall pr:xsmall` → pb 8px,
 *     pl/pr 4px; `css-2m39qo` grid space-between; `css-1g2ib9c` grid baseline
 *     gap 4px; `css-1codye8` heading (14px, font-weight 653, colour #6B6E76);
 *     `css-1c39lxe` 24px create button + `css-1y53iih` (size 2.25 → 18px icon).
 * The space avatar uses `css-u659hu` (background `--lns-color-tealLight`
 * hsla(155,70%,84%,1), 20×20, padding-top 1px) and `css-1c8w1f0` ("A", 14px,
 * font-weight 653, colour `--lns-color-tealDark` hsla(155,55%,19%,1)); the
 * `avatar_spacesAvatar_Mqt` radius and `navigation_infoIcon_YAE` colour were not
 * recorded and are reconstructed (6px radius / dimmed). The trailing info icon
 * box is `css-1g3q97h` (18×18).
 */
export function SpacesSection() {
  return (
    <div>
      {/* navigation_librariesHeading_qqM */}
      <div className="pb-[8px] pl-[4px] pr-[4px]">
        {/* css-2m39qo */}
        <div className="grid grid-flow-col items-center justify-between">
          {/* css-1g2ib9c */}
          <div className="grid grid-flow-col items-baseline justify-start gap-[4px]">
            {/* css-1codye8 */}
            <h2 className="block text-[14px] font-[653] leading-[1.57] text-[#6B6E76]">
              Spaces
            </h2>
          </div>
          <div>
            <div className="block align-middle">
              <button
                aria-label="Create a Space"
                className="relative inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[4px] border-none bg-transparent p-0 align-middle outline outline-1 outline-transparent transition-colors duration-[600ms] hover:bg-[#0515240f] hover:duration-[300ms] active:bg-[#0b120e24]"
              >
                {/* css-1y53iih (size 2.25 → 18px) */}
                <span className="block text-[hsla(228,6%,17%,1)]">
                  <PlusIcon className="h-[18px] w-[18px] p-[8%]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <NavMenuItem
        href="/spaces/browse"
        label="View all spaces"
        icon={<SpacesIcon className="h-[20px] w-[20px] p-[8%]" />}
      />

      <article>
        <NavMenuItem
          href="/spaces/All-Lyratechnologies-31901848"
          label="All Lyratechnologies"
          icon={
            // css-u659hu + css-1c8w1f0 (avatar_spacesAvatar_Mqt radius reconstructed)
            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-[6px] bg-[hsla(155,70%,84%,1)] pt-px">
              <span className="block text-[14px] font-[653] leading-[1.57] text-[hsla(155,55%,19%,1)]">
                A
              </span>
            </div>
          }
          trailing={
            // css-1g3q97h (18×18) > navigation_infoIcon_YAE (dimmed, reconstructed)
            <div className="h-[18px] w-[18px] text-[#6B6E76]">
              <InfoIcon className="h-[18px] w-[18px]" />
            </div>
          }
        />
      </article>
    </div>
  );
}
