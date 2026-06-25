interface ProfileBubbleHeaderProps {
  name?: string;
  src?: string;
}

const DEFAULT_AVATAR =
  "https://secure.gravatar.com/avatar/06fe4080490286b2489f1e2f8407224f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAH-3.png";

/**
 * Top of the bubble menu (`css-16gesod`): the 48px avatar (`size="6"` →
 * 6×`--lns-unit`(8px)), the bold name (`css-11vvlvy`, h1) and the "Edit profile"
 * link (`a[href="/settings/account"]`). The avatar circle (`css-1eycoj6`,
 * blueDark) and image (`css-1n8qdfn`) are reconstructed at 48px. "Edit profile"
 * is reconstructed as a neutral bordered pill since its `css-1delz3x` class was
 * runtime-only.
 */
export function ProfileBubbleHeader({
  name = "Alvin He",
  src = DEFAULT_AVATAR,
}: ProfileBubbleHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-[8px] px-[16px] pt-[28px]">
      <span className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full bg-white text-[hsla(216.3,69.2%,23%,1)]">
        <img alt="" src={src} className="h-[48px] w-[48px] max-w-full" />
      </span>
      <h1 className="text-[20px] font-[653] leading-[1.16] text-[hsla(228,6%,17%,1)]">
        {name}
      </h1>
      <a
        href="/settings/account"
        className="mt-[4px] inline-flex items-center rounded-[8px] border border-[hsla(225.5,57%,10%,0.14)] px-[12px] py-[5px] text-[14px] font-medium leading-[1.57] text-[hsla(228,6%,17%,1)] transition-colors duration-[600ms] hover:bg-[hsla(209,75.6%,8%,0.08)]"
      >
        <span>Edit profile</span>
      </a>
    </div>
  );
}
