import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const app = readFileSync(new URL("../src/main/application-services.ts", import.meta.url), "utf8");
const builder = readFileSync(new URL("../electron-builder.yml", import.meta.url), "utf8");

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

console.log("AtlasBot canary checks: packaged auth fallback and release metadata PASS.");
console.log("NOTE: This is a static guard, not a full egress audit or runtime test.");
