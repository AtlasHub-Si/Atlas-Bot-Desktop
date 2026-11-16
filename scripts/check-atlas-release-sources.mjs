// AtlasBot owned release source contract. Does not change internal compatibility names.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const installer = source("scripts/install-server.sh");
const hostRelease = source("src/main/host-release-service.ts");
const notice = source("NOTICE");
assert.ok(installer.includes("https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/releases"), "Installer should use Atlas-only releases");
assert.ok(!/nightly-labs\/openbot/i.test(installer), "Installer still contains origin executable source");
assert.ok(installer.includes('approved_tag=""'), "Installer must default to deny");
assert.ok(installer.includes("--approved-tag"), "Installer must require pinned release");
assert.ok(installer.includes("AtlasBot-$version-$architecture.AppImage"), "Installer still expects an OpenBot AppImage");
assert.ok(hostRelease.includes("AtlasBot-" + "$" + "{version}"), "Host release service must verify AtlasBot asset basename");
assert.ok(!/OpenBot-\$\{version\}/.test(hostRelease), "Host release service still validates OpenBot artifacts");
assert.ok(notice.includes("Synthetify Labs"), "Original authorship notice must remain");
console.log("AtlasBot release source + attribution regression gate: PASS");
