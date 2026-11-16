// AtlasBot public-surface regression gate. Deliberately does not rewrite compatibility protocols or legal attribution.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const text = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const csp = text("src/main/content-security-policy.ts");
const footer = text("apps/auth-api/src/components/landing/LandingFooter.tsx");
const links = text("apps/auth-api/src/lib/landing-links.ts");
const mobile = text("apps/auth-api/src/lib/mobile-apps.ts");
const hero = text("apps/auth-api/src/components/landing/HeroDownloadSelector.tsx");
const download = text("apps/auth-api/src/routes/download/$platform.tsx");
const installed = text("scripts/install-server.sh");
const credits = text("NOTICE");

assert.ok(!/analytics\.openbot\.run|wss:\/\/\*\.openbot\.run|https:\/\/\*\.openbot\.run/.test(csp),
  "Atlas renderer CSP must not grant origin cloud network access");
assert.ok(csp.includes("selfHostedSignalSource"), "Authorized self-hosted Signal must remain supported");
assert.ok(footer.includes("<span>AtlasBot</span>"), "Origin name remains visible on the landing footer");
assert.ok(!/OPENBOT_LINKS\.(?:x|discord|threads|linkedin|reddit|instagram|tiktok|facebook)/.test(footer),
  "Unverified social pages must not be advertised as Atlas channels");
assert.ok(links.includes("https://github.com/AtlasHub-Si/Atlas-Bot-Desktop"), "Atlas repository missing");
assert.ok(!/nightly-labs\/openbot/.test(links), "Operator footer may not link source releases");
assert.ok(!/OPENBOT_LINKS\.(?:discord|status)/.test(links.slice(links.indexOf("export const FOOTER_COLUMNS"))),
  "Legacy social or status page still in the product footer");
assert.ok(mobile.includes("ATLASBOT_MOBILE_DISTRIBUTION_ENABLED = false"),
  "Origin mobile apps must not be offered as approved Atlas releases");
assert.ok(hero.includes("ATLASBOT_MOBILE_DISTRIBUTION_ENABLED"),
  "Platform detection must not revive inherited mobile store links");
assert.ok(download.includes('platform === "ios" || platform === "android"'),
  "Unapproved mobile download guide must fail closed");
assert.ok(!/nightly-labs\/openbot/.test(installed), "Installer must use Atlas-owned artifacts");
assert.ok(credits.includes("Synthetify Labs"), "Required provenance notice missing");
console.log("AtlasBot public branding, distribution, mobile and CSP static gates: PASS");
