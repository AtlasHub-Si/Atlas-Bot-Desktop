import { Effect } from "effect";

export type AvailableDownloadPlatform = "linux" | "macos" | "windows";
export type DownloadArchitecture = "arm64" | "x64";

const DOWNLOAD_PLATFORMS = ["linux", "macos", "windows"] as const satisfies readonly AvailableDownloadPlatform[];
const ATLAS_DOWNLOADS = "https://www.atlas-si.com/download/";

export function isAvailableDownloadPlatform(value: string): value is AvailableDownloadPlatform {
  return DOWNLOAD_PLATFORMS.some(platform => platform === value);
}

export function downloadArchitecture(platform: AvailableDownloadPlatform, arch: string | null): DownloadArchitecture {
  if (platform === "macos") return arch === "x64" ? "x64" : "arm64";
  if (platform === "linux") return arch === "arm64" ? "arm64" : "x64";
  return "x64";
}

/** No Atlas-owned Android APK has passed mobile distribution gates. */
export function androidApkResponse(): Response {
  return new Response("AtlasBot Android installer is not yet available.", {
    status: 503,
    headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
  });
}

/**
 * Legacy Account API download route delegates exclusively to the Atlas-SI website.
 * That site validates an explicitly approved release, asset ID, digest and signing
 * evidence, and otherwise responds fail-closed. Never fetch original OpenBot releases.
 */
export function latestDownloadResponse(
  platform: AvailableDownloadPlatform,
  _fetcher: typeof fetch = fetch,
  _architecture: DownloadArchitecture = downloadArchitecture(platform, null),
) {
  return Effect.succeed(new Response(null, {
    status: 302,
    headers: {
      "cache-control": "no-store",
      location: ATLAS_DOWNLOADS + platform,
    },
  }));
}
