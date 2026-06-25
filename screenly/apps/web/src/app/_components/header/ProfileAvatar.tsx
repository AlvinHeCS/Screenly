"use client";

import { useProfileMenu } from "../profile-menu/ProfileMenuContext";

interface ProfileAvatarProps {
  name?: string;
  src?: string;
}

const DEFAULT_AVATAR =
  "https://secure.gravatar.com/avatar/06fe4080490286b2489f1e2f8407224f?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAH-3.png";

/**
 * Round profile avatar. Wrapper from `.css-7zdb2g` (relative, rounded-full)
 * and `.css-nez7wg` (inline-block, align-middle); the circle from `.css-8tktga`
 * (36×36, blueDark text, white bg, rounded-full, overflow-hidden, weight 653,
 * 18px) and the image from `.css-bk5al3` (36×36, max-w-full). The original
 * `button.profile-bubble_avatarLink_yHP` base class was external (only its
 * inline `z-index: 3` was available), so the button is reconstructed as a
 * round, borderless, transparent clickable wrapper at `z-[3]`.
 *
 * Pressing it toggles the profile popover via `useProfileMenu()` (the
 * `ProfileMenuProvider` mounted on the `/videos` page).
 */
export function ProfileAvatar({
  name = "Alvin",
  src = DEFAULT_AVATAR,
}: ProfileAvatarProps) {
  const { isOpen, toggle } = useProfileMenu();

  return (
    <div id="intercom-destination-avatar" className="relative rounded-full">
      <div className="inline-block align-middle">
        <button
          aria-label={`Account menu for ${name}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={toggle}
          className="relative z-[3] block cursor-pointer rounded-full border-none bg-transparent p-0"
        >
          <span className="relative z-0 flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full bg-white text-[18px] font-[653] leading-none text-[hsla(216.3,69.2%,23%,1)]">
            <img
              alt={name}
              src={src}
              className="h-[36px] w-[36px] max-w-full text-[18px]"
            />
          </span>
        </button>
      </div>
    </div>
  );
}
