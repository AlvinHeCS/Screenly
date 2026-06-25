import { ProfileMenuItem } from "./ProfileMenuItem";

/** The five navigation rows in the bubble menu (`css-11lgf0l` → `ul.css-10rrimm`). */
const ITEMS: { label: string; href?: string }[] = [
  { label: "View profile", href: "/profile" },
  { label: "Keyboard shortcuts" },
  {
    label: "Install Chrome extension",
    href: "https://chrome.google.com/webstore/detail/liecbddmkiiihnedobmlmillhodjkdmb",
  },
  { label: "Download desktop app", href: "/desktop" },
  { label: "Download mobile app", href: "https://www.loom.com/mobile" },
];

export function ProfileMenuList() {
  return (
    <ul className="flex flex-col">
      {ITEMS.map((item) => (
        <li key={item.label}>
          <ProfileMenuItem label={item.label} href={item.href} />
        </li>
      ))}
    </ul>
  );
}
