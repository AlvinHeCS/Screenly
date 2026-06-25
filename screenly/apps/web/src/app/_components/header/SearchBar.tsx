import { SearchIcon } from "./icons/SearchIcon";

/**
 * Search field. Styling resolved from `.css-16bety0` (relative, max-width
 * 780px, centred), `.css-1xm32e0` (relative, full width), `.css-44whkg`
 * (absolute icon box, 48px wide) and `.css-111iojy` (the input). Redundant
 * emotion wrapper spans (`.css-gn0a2q` focus-within and the nested
 * colour-only spans) were collapsed — the input carries the visible focus
 * shadow, and the icon colour comes straight from `.css-kho3w` (grey6).
 */
export function SearchBar() {
  return (
    <div className="relative mx-auto w-full max-w-[780px]">
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-[48px] items-center justify-center">
          <span className="block h-[24px] w-[24px] text-[hsla(224,5%,44%,1)]">
            <SearchIcon className="block h-full w-full p-[8%]" />
          </span>
        </div>
        <input
          type="text"
          placeholder="Search for people, tags, folders, Spaces, and Looms"
          aria-label="Search for people, tags, folders, Spaces, and Looms"
          className="h-[36px] w-full appearance-none rounded-[8px] border-none bg-white py-0 pl-[44px] pr-[12px] font-[inherit] text-[14px] leading-[1.57] tracking-normal text-inherit shadow-[inset_0_0_0_1px_hsla(223.6,5%,57%,1)] transition-shadow duration-300 placeholder:text-[hsla(224,5%,44%,1)] hover:shadow-[inset_0_0_0_2px_hsla(215.4,80%,47.65%,1)] focus:shadow-[inset_0_0_0_2px_hsla(215.4,80%,47.65%,1),0_0_0_2px_hsla(216.1,81.4%,60%,1)] focus:outline-none"
        />
      </div>
    </div>
  );
}
