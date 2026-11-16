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
assert.ok(installer.includes('echo "AtlasBot is connected to your account."'), "Installer success text must agree with AtlasBot UI");
for (const locale of ["ar","de","en","es","fr","he","it","ja","ko","nl","pl","pt","ru","tr","zh"]) {
  for (const name of ["server", "island"]) {
    const strings = source("packages/i18n/src/messages/" + locale + "/" + name + ".ts");
    assert.ok(!new RegExp("(^|[^A-Za-z])OpenBot($|[^A-Za-z])").test(strings), locale + "/" + name + ": inherited brand remains visible");
    assert.ok(!strings.includes("nightly-labs/openbot"), locale + "/" + name + ": source release URL remains");
  }
}
const hosted = source("packages/contracts/src/hosted-servers.ts");
assert.ok(hosted.includes("mailto:sergiomonteiro@atlashub.si"), "Hosted contact must belong to Atlas");
assert.ok(!hosted.includes("mailto:hello@openbot.run"), "Hosted contact still routes to origin operator");
console.log("AtlasBot release source + UI identity + contact attribution regression gate: PASS");
