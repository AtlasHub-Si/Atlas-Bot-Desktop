// AtlasBot RC1 Connected release gate. The local-only L0 mode is opt-in,
// not the default for an installed Windows canary profile.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const app = load("src/main/application-services.ts");
const main = load("src/main/index.ts");
const build = load("electron-builder.yml");
const docs = load("docs/atlas/SELF_HOSTED_ATLAS_READINESS.md");
const web = load("apps/auth-api/src/routes/app.tsx");

assert.match(app, /const localOnlyL0 =\s*app\.isPackaged[\s\S]*?process\.env\.ATLASBOT_LOCAL_ONLY_L0 === "1";/);
assert.match(app, /const centralAuth = new CentralAuthManager\(\{\s*localOnlyL0,/);
assert.match(app, /app\.isPackaged \? "https:\/\/api-test\.atlas-si\.com"/);
assert.ok(!app.includes('app.isPackaged ? "https://api.openbot.run"'));
assert.match(main, /app\.setPath\("userData", join\(app\.getPath\("appData"\), "AtlasBot Canary"\)\)/);
assert.match(build, /^appId: si\.atlashub\.atlasbot\.canary$/m);
assert.match(build, /^productName: AtlasBot$/m);
assert.match(build, /^  owner: AtlasHub-Si$/m);
assert.match(build, /^  repo: Atlas-Bot-Desktop$/m);
assert.match(docs, /no publication or infrastructure GO/);
assert.match(web, /createFileRoute\("\/app"\)/);
console.log("RC1 Connected code gates PASS: cloud account default, explicit local-only L0 switch, preserved Canary identity/profile, Atlas update source, Web route present.");
console.log("NOTE: static check; real OTP, migration and remote data channels still require Windows/GWD UAT.");
