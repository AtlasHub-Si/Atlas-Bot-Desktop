/** Explicit Atlas-owned capture endpoint; diagnostics may use loopback only. */
export function atlasTelemetryEndpoint(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const firstParty =
      url.hostname === "atlas-si.com" || url.hostname.endsWith(".atlas-si.com") ||
      url.hostname === "atlashub.si" || url.hostname.endsWith(".atlashub.si");
    const localTest = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.username || url.password || url.hash) return null;
    if ((url.protocol === "https:" && firstParty) || (url.protocol === "http:" && localTest)) {
      return url.toString();
    }
  } catch { /* malformed configuration: fail closed */ }
  return null;
}
