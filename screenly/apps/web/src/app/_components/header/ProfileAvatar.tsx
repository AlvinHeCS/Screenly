"use client";

import { useProfileMenu } from "../profile-menu/ProfileMenuContext";

interface ProfileAvatarProps {
  name?: string;
}

/**
 * Round profile avatar. Wrapper from `.css-7zdb2g` (relative, rounded-full)
 * and `.css-nez7wg` (inline-block, align-middle). The original
 * `button.profile-bubble_avatarLink_yHP` base class was external, so the
 * button is reconstructed as a round, borderless, transparent clickable wrapper
 * at `z-[3]`.
 *
 * Pressing it toggles the profile popover via `useProfileMenu()` (the
 * `ProfileMenuProvider` mounted on the `/videos` page).
 */
export function ProfileAvatar({ name = "User" }: ProfileAvatarProps) {
  const { isOpen, toggle } = useProfileMenu();
  const initials = initialsOf(name);

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
          <span className="relative z-0 flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full bg-[hsla(215.9,79.9%,41%,1)] text-[14px] font-medium leading-none text-white">
            {initials}
          </span>
        </button>
      </div>
    </div>
  );
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "?";
  return `${parts[0]?.[0] ?? ""}${
    parts[parts.length - 1]?.[0] ?? ""
  }`.toUpperCase();
}
