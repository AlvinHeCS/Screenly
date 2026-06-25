/**
 * Loom's circular webcam bubble (`loom-camera-layer`). The real bubble streams
 * the camera through an extension iframe and is drag-repositionable
 * (react-draggable); here it's a styled placeholder. Drag was not reproduced
 * (it would require runtime inline transforms), matching how earlier ports
 * omitted behaviour that couldn't be expressed in static Tailwind — the
 * `cursor-grab` affordance is kept. Dark fill uses the `grey8` token
 * (`hsla(228,6%,17%,1)`).
 */
export function CameraBubble() {
  return (
    <div
      role="img"
      aria-label="Camera preview"
      className="pointer-events-auto flex h-[240px] w-[240px] shrink-0 cursor-grab items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[hsla(228,6%,17%,1)] shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
    >
      <span className="text-[12px] font-medium text-[hsla(0,0%,100%,0.7)]">
        Camera
      </span>
    </div>
  );
}
