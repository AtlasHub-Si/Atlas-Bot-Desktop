// RC1: fail closed if inherited public footer destinations are reintroduced.
// This static guard does not replace browser QA, account terms, or packet capture.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const footer = read("apps/auth-api/src/components/landing/LandingFooter.tsx");
const links = read("apps/auth-api/src/lib/landing-links.ts");
const csp = read("src/main/content-security-policy.ts");
assert.match(footer, /<span>AtlasBot<\/span>/, "AtlasBot identity missing");
assert.doesNotMatch(footer, /<span>OpenBot<\/span>/, "Inherited brand shown");
const socials = footer.match(/const SOCIALS:[\s\S]*?\n\];/)?.[0] ?? "";
assert.match(socials, /OPENBOT_LINKS\.repository/, "Atlas GitHub profile missing");
assert.doesNotMatch(socials, /OPENBOT_LINKS\.(x|discord|threads|linkedin|reddit|instagram|facebook|tiktok)/, "Unowned social shown");
const columns = links.split("export const FOOTER_COLUMNS:")[1] ?? "";
assert.ok(columns.includes("OPENBOT_LINKS.repository"), "Atlas code link missing");
assert.doesNotMatch(columns, /openbot\.run|nightly-labs\/openbot|\/commercial-license|\/dpa|\/cla|\/compare/, "Inherited public link exposed in footer");
for (const name of ["repository", "releases", "license", "documentation", "selfHostedServer"]) {
  assert.ok(links.includes(name + ': "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop'), "Unexpected Atlas link: " + name);
}
assert.match(links, /https:\/\/www\.atlas-si\.com\/pt\/privacy/, "Scoped privacy link missing");
assert.match(links, /https:\/\/www\.atlas-si\.com\/pt\/terms/, "Scoped terms link missing");
assert.doesNotMatch(csp, /connect-src[^\n]*analytics\.openbot\.run|connect-src[^\n]*wss:\/\/\*\.openbot\.run|frame-src[^\n]*https:\/\/\*\.openbot\.run/, "Inherited CSP egress allowed");
console.log("AtlasBot RC1 public surface/links source gate: PASS");
