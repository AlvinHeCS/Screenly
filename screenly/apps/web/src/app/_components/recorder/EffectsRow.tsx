import { EffectButton } from "./EffectButton";
import { BlurIcon } from "./icons/BlurIcon";
import { EffectsIcon } from "./icons/EffectsIcon";
import { MoreDotsIcon } from "./icons/MoreDotsIcon";

/**
 * The effects row beneath the recording limit note (`content-okh4p8`): Effects,
 * Blur and More, each an icon button with a caption. Separated from the body
 * above by a top border using the `--lns-color-border` token.
 */
export function EffectsRow() {
  return (
    <div className="mt-[16px] flex items-start justify-around border-t border-[hsla(225.5,57%,10%,0.14)] pt-[12px]">
      <EffectButton
        ariaLabel="Effects"
        label="Effects"
        icon={<EffectsIcon className="h-[16px] w-[16px]" />}
      />
      <EffectButton
        ariaLabel="Blur"
        label="Blur"
        icon={<BlurIcon className="h-[16px] w-[16px]" />}
      />
      <EffectButton
        ariaLabel="Settings menu"
        label="More"
        icon={<MoreDotsIcon className="h-[16px] w-[16px]" />}
      />
    </div>
  );
}
