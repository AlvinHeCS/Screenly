/**
 * Plan/role block of the bubble menu (`css-mscqrf` → `css-pkz555`): the
 * "Request role upgrade" button (`data-testid="profile-menu-upgrade-plan-button"`,
 * primary/blurple bold label), the role/plan `<dl>` (both rows dimmed) and the
 * "18/25 videos" usage line (dimmed). Wrapped in a reconstructed bordered box
 * since the original `css-*` container classes were runtime-only.
 */
export function ProfilePlanSummary() {
  return (
    <div className="px-[16px] pt-[20px]">
      <div className="flex w-full flex-col gap-[8px] rounded-[12px] border border-[hsla(225.5,57%,10%,0.14)] p-[12px]">
        <button
          type="button"
          data-testid="profile-menu-upgrade-plan-button"
          className="self-start bg-transparent p-0 text-[14px] font-[653] leading-[1.57] text-[hsla(215.4,80%,47.65%,1)] hover:underline"
        >
          Request role upgrade
        </button>
        <dl className="flex flex-col gap-[4px]">
          <div className="flex justify-between">
            <dt>
              <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                Current role:
              </span>
            </dt>
            <dd>
              <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                Creator Lite
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>
              <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                Current plan:
              </span>
            </dt>
            <dd>
              <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
                Business + AI
              </span>
            </dd>
          </div>
        </dl>
        <span className="text-[12px] font-normal leading-[1.5] text-[hsla(224,5%,44%,1)]">
          18/25 videos
        </span>
      </div>
    </div>
  );
}
