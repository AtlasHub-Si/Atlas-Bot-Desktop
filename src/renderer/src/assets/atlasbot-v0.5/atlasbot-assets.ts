/** AtlasBot V0.5 candidate visual asset registry. Import this file only from renderer prototypes. */
export type AtlasBotRole = "guide" | "creator" | "builder" | "analyst" | "flow" | "shield";
export type AtlasBotAssetSize = 128 | 256 | 512 | 1024;
export type AtlasBotMotionState = "idle" | "thinking" | "working" | "celebrating";

/** Six SVGs are included in the PR. The WebP files are installed from the verified ZIP. */
const roleIcons = import.meta.glob("./icons/role-*.svg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const mascotWebp = import.meta.glob("./mascots/*/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export function atlasBotRoleIconUrl(role: AtlasBotRole): string | undefined {
  return roleIcons[`./icons/role-${role}.svg`];
}

/** Returns undefined until the validated full-resolution asset package is installed. */
export function atlasBotMascotUrl(role: Exclude<AtlasBotRole, "guide">, size: AtlasBotAssetSize = 256): string | undefined {
  return mascotWebp[`./mascots/${role}/${role}-${size}.webp`];
}
