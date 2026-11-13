/** AtlasBot V0.6 design candidate. Files are opt-in and not bundled until installed. */
export const atlasBotRoles = ["guide", "creator", "builder", "analyst", "flow", "shield"] as const;
export type AtlasBotRole = (typeof atlasBotRoles)[number];
export type AtlasBotImageSize = 64 | 128 | 256 | 512 | 1024;
export type AtlasBotMotionState = "idle" | "thinking" | "working" | "celebrating";

const icons = import.meta.glob("./icons/role-*.svg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const images = import.meta.glob("./mascots/*/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

/** Returns undefined when the corresponding binary has not been installed. */
export function atlasBotMascotUrl(role: AtlasBotRole, size: AtlasBotImageSize = 256): string | undefined {
  return images[`./mascots/${role}/${role}-${size}.webp`];
}

export function atlasBotRoleIconUrl(role: AtlasBotRole): string | undefined {
  return icons[`./icons/role-${role}.svg`];
}
