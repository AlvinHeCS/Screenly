import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { GiftIcon } from "./icons/GiftIcon";

/**
 * The workspace switcher card: the workspace button stacked above the
 * "Earn free videos" invite button (`workspace-selector_withInviteButton_Z68`).
 *
 * Both buttons come from captured matched-CSS with tokens resolved:
 *   dropdown-header_workspaceButton_uUI — background #fff, border 1px
 *     hsla(225.5,57%,10%,0.14), width 100%, height 3.75rem (60px),
 *     border-top radius 0.5rem (8px), transition 0.3s.
 *   dropdown-header_inviteButton_EoG — background `--lns-color-tealLight`
 *     hsla(155,70%,84%,1), colour body, width 100%, min-height 2.8125rem
 *     (45px), padding 0.5rem 0.75rem (8px 12px), border-bottom radius 0.5rem.
 * The content classes (`dropdown-header_workspaceContentNormal_yTs`,
 * `dropdown-header_inviteButtonContent_Q2F`, …) were not recorded, so their
 * inner padding/flex is reconstructed; the `css-1by6xax`, `css-ybmnre`,
 * `css-1l00s7y`, `css-2ez31r`, `css-1rap0lk` and `css-gbk6xl` utility rules were
 * resolved from `loom_style_guide.css`. The compact "L" avatar
 * (`dropdown-header_workspaceContentCompact_XVu`, shown only when the sidebar is
 * collapsed) is rendered hidden in this expanded layout.
 */
export function WorkspaceSelector() {
  return (
    <div>
      <div>
        <div className="relative">
          {/* workspace button */}
          <div className="block align-middle">
            <button
              id="workspaceDropdownHeader"
              aria-expanded="false"
              className="relative block h-[60px] w-full cursor-pointer overflow-hidden rounded-t-[8px] border border-[hsla(225.5,57%,10%,0.14)] bg-white text-[hsla(228,6%,17%,1)] transition-all duration-300"
            >
              {/* dropdown-header_workspaceContentCompact_XVu — collapsed-only "L" avatar */}
              <div className="hidden">
                {/* css-1by6xax */}
                <div className="grid h-[48px] grid-flow-col items-center justify-center">
                  {/* css-ybmnre */}
                  <span className="relative z-0 flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-white text-[16px] font-[653] leading-none text-[hsla(216.3,69.2%,23%,1)]">
                    L
                  </span>
                </div>
              </div>
              {/* dropdown-header_workspaceContentNormal_yTs (px reconstructed) */}
              <div className="px-[12px]">
                {/* css-1l00s7y: grid 1fr 1.5rem */}
                <div className="grid w-full grid-cols-[1fr_1.5rem] items-center justify-start">
                  <span className="w-full text-left">
                    {/* dropdown-header_workspaceName_tGv css-2ez31r */}
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-left text-[14px] font-medium leading-[1.57]">
                      Lyratechnologies
                    </span>
                    {/* css-1rap0lk */}
                    <span className="block text-left text-[12px] font-normal leading-[1.5] text-[#6B6E76]">
                      64 members
                    </span>
                  </span>
                  {/* css-1n93cg0: colour body, size 3 (24px) */}
                  <span className="block text-[hsla(228,6%,17%,1)]">
                    <ChevronDownIcon className="h-[24px] w-[24px] p-[8%]" />
                  </span>
                </div>
              </div>
            </button>
          </div>
          {/* invite button */}
          <div className="block align-middle">
            <button
              id="navigationInviteTeammatesButton"
              data-testid="navigation-invite-teammates-button"
              className="relative block min-h-[45px] w-full cursor-pointer overflow-hidden rounded-b-[8px] border border-[hsla(155,70%,84%,1)] bg-[hsla(155,70%,84%,1)] px-[12px] py-[8px] text-[hsla(228,6%,17%,1)] transition-all duration-300"
            >
              {/* dropdown-header_inviteButtonContent_Q2F */}
              <span className="flex items-center">
                {/* dropdown-header_inviteIcon_B0I > css-ilx5r9 (24px) */}
                <span className="block text-current">
                  <GiftIcon className="h-[24px] w-[24px] p-[8%]" />
                </span>
                {/* css-1w3ibup: 8px spacer */}
                <span aria-hidden className="block pr-[8px]" />
                {/* flex flexDirection:column items:selfStart */}
                <div className="flex flex-col items-[self-start]">
                  {/* dropdown-header_inviteButtonLabel_qK0 css-gbk6xl */}
                  <span className="block text-[12px] font-medium leading-[1.5] text-current">
                    Earn free videos
                  </span>
                </div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
