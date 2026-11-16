// Atlas staging/public web identity regression guard; source-only checks.
// These checks do not certify runtime egress or validate legal service terms.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../"+path, import.meta.url), "utf8");
const footer = read("apps/auth-api/src/components/landing/LandingFooter.tsx");
const links = read("apps/auth-api/src/lib/landing-links.ts");
assert.ok(footer.includes("<span>AtlasBot</span>"), "Legacy footer display name remains");
assert.ok(!footer.includes("<span>OpenBot</span>"), "Original operator remains displayed");
assert.ok(footer.includes('column.id !== "compare"'), "Unreviewed original comparison catalogue should not be promoted");
assert.ok(footer.includes("PUBLIC_FOOTER_COLUMNS"), "Footer must filter unowned destinations");
assert.ok(footer.includes("isOriginalOperatorLink"), "Footer must refuse original operator domains");
assert.ok(!footer.includes("OPENBOT_LINKS.x"), "Unowned X profile must not be shown");
assert.ok(!footer.includes("OPENBOT_LINKS.discord"), "Unowned Discord profile must not be shown");
assert.ok(!footer.includes("OTHER_NETWORKS"), "Other unapproved social profiles must be hidden");
for (const k of ["repository", "releases", "license", "documentation", "selfHostedServer"]) {
  assert.ok(links.includes('  '+k+': "https://github.com/AtlasHub-Si/Atlas-Bot-Desktop'), k + ": Atlas canonical destination missing");
}
assert.ok(!links.includes("https://github.com/nightly-labs/openbot"), "Original operator GitHub links remain in the public link contract");
assert.ok(links.includes("https://www.atlas-si.com/pt/privacy"), "Institutional website privacy scope is missing");
assert.ok(links.includes("https://www.atlas-si.com/pt/terms"), "Atlas legal disclosure link is missing");
console.log("AtlasBot public footer identity and owned-link source guard: PASS");
