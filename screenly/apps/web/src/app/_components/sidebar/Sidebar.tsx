"use client";

import { RecordButton } from "./RecordButton";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { WorkspaceSelector } from "./WorkspaceSelector";

interface SidebarProps {
  onCollapse?: () => void;
}

/**
 * Loom's left navigation sidebar, reconstructed as a self-contained component.
 *
 * The root `css-xz9xp9` rule (height 100%, padding-top 16px, padding-left/right
 * 8px, flex column) and the `css-202ccx` spacer (padding-bottom 24px) were
 * resolved from `loom_style_guide.css`. The source markup sets no explicit
 * sidebar *width* (it was governed by an outer `navigation_sideNav_bJd`
 * container that was not in scope), so a 240px width — Loom's standard expanded
 * width — is applied here as a sensible default. A right border
 * (`--lns-color-border`) is added to separate it from the page content. Render
 * it inside a full-height parent; the `RecordButton` uses `flex-grow` to pin
 * itself to the bottom.
 *
 * Composition: SidebarHeader → spacer → WorkspaceSelector → SidebarNav →
 * RecordButton, matching the source child order.
 */
export function Sidebar({ onCollapse }: SidebarProps) {
  return (
    <div className="flex h-full w-[240px] flex-col border-r border-[hsla(225.5,57%,10%,0.14)] px-[8px] pt-[16px] text-[hsla(228,6%,17%,1)]">
      <SidebarHeader onCollapse={onCollapse} />
      {/* css-202ccx */}
      <div aria-hidden className="block pb-[24px] align-middle" />
      <WorkspaceSelector />
      <SidebarNav />
      <RecordButton />
    </div>
  );
}
