import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const app = readFileSync(new URL("../src/main/application-services.ts", import.meta.url), "utf8");
const builder = readFileSync(new URL("../electron-builder.yml", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/main/index.ts", import.meta.url), "utf8");
const store = readFileSync(new URL("../src/backend/agent-store.ts", import.meta.url), "utf8");
const nsis = readFileSync(new URL("../build/installer.nsh", import.meta.url), "utf8");

assert.ok(
  app.includes('app.isPackaged ? "https://api-test.atlas-si.com" : "http://127.0.0.1:3100"'),
  "The packaged AtlasBot canary must default to Atlas-owned auth staging, not OpenBot.",
);
assert.ok(
  !app.includes('app.isPackaged ? "https://api.openbot.run"'),
  "Original OpenBot account origin must never be the canary packaged fallback.",
);
assert.match(builder, /^productName:\s*AtlasBot$/m, "App display name must be AtlasBot.");
assert.match(builder, /^\s*owner:\s*AtlasHub-Si$/m, "Update owner must not be upstream.");
assert.match(builder, /^\s*repo:\s*Atlas-Bot-Desktop$/m, "Update repo must not be upstream.");

assert.ok(builder.includes("appId: si.atlashub.atlasbot.canary"));
assert.ok(builder.includes("- atlasbot-canary"));
assert.ok(runtime.includes('app.setPath("userData", join(app.getPath("appData"), "AtlasBot Canary"))'));
assert.ok(runtime.includes('app.setAppUserModelId("si.atlashub.atlasbot.canary")'));
assert.ok(runtime.includes('app.setAsDefaultProtocolClient("atlasbot-canary")'));
assert.ok(!runtime.includes('app.setAsDefaultProtocolClient("openbot")'));
assert.ok(store.includes('basename(userDataPath) === "AtlasBot Canary"'));
const slash = String.fromCharCode(92);
assert.ok(!nsis.includes("Classes" + slash + "openbot"), "Installer must not register upstream protocol.");
assert.ok(!nsis.includes("$APPDATA" + slash + "OpenBot"), "Installer must not manage upstream user data.");
assert.ok(!nsis.includes("$PROFILE" + slash + "OpenBot"), "Installer must not manage upstream workspace directory.");
console.log("AtlasBot canary checks: separate installer identity, local profile, workspace and release metadata PASS.");
console.log("NOTE: This is a static guard, not a full egress audit or runtime test.");
