/**
 * Skip-to-content link. The original `top-navigation_skipNavigation_CQy` class
 * lived in an external Loom stylesheet that could not be read, so the
 * visually-hidden-until-focus behaviour is reconstructed with `sr-only` +
 * `focus:not-sr-only`. The visible (focused) styling comes from the resolved
 * `.css-1cb07gh` button rule (height 36px, rounded 8px, 14px/medium, white
 * text, focus-ring outline). The button's background gradient resolved to
 * empty in the stylesheet, so the brand colour (`--lns-color-primary`,
 * blurple) is used for the focused state.
 */
export function SkipNavigation() {
  return (
    <a
      href="#mainContent"
      className="sr-only focus:not-sr-only focus:absolute focus:left-[16px] focus:top-[8px] focus:z-50 focus:inline-flex focus:h-[36px] focus:min-w-[36px] focus:cursor-pointer focus:items-center focus:justify-center focus:whitespace-nowrap focus:rounded-[8px] focus:bg-[hsla(215.4,80%,47.65%,1)] focus:px-[12px] focus:align-middle focus:text-[14px] focus:font-medium focus:leading-[1.57] focus:text-white focus:no-underline focus:outline-[2px] focus:outline-offset-[1px] focus:outline-[hsla(216.1,81.4%,60%,1)]"
    >
      <span>Skip to content</span>
    </a>
  );
}
