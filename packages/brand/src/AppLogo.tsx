import { APP_LOGO_SIZE } from "./app-logo-shape";

export type AppLogoAnimation = "none" | "blink" | "look-around" | "surprised";
export type AppLogoVariant = "production" | "dev" | "preview";

export interface AppLogoProps {
  variant: AppLogoVariant;
  /** Retained for callers. The approved raster is static in this internal build. */
  animation?: AppLogoAnimation;
  interactive?: boolean;
  pointerArea?: HTMLElement | undefined;
  class?: string;
}

const APPROVED_ATLAS_LOGO = new URL("./atlasbot-approved-logo.png", import.meta.url).href;

/** Use the approved Atlas A unchanged. No eye animation or approximate vector artwork. */
export function AppLogo(props: AppLogoProps) {
  return (
    <svg
      class={["app-logo", props.class].filter(Boolean).join(" ")}
      data-variant={props.variant}
      viewBox={`0 0 ${APP_LOGO_SIZE} ${APP_LOGO_SIZE}`}
      aria-hidden="true"
    >
      <image
        href={APPROVED_ATLAS_LOGO}
        width={APP_LOGO_SIZE}
        height={APP_LOGO_SIZE}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
