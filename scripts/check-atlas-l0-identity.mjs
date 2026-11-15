// Source-level regression gate for internal AtlasBot Canary branding and legal links.
// This does not prove complete network isolation or runtime instruction behavior.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const prompt = source("src/backend/agent/developer-instructions.ts");
const flow = source("src/renderer/src/features/onboarding/FirstRunFlow.tsx");
const choice = source("src/renderer/src/features/onboarding/FirstRunChoice.tsx");
const en = source("packages/i18n/src/messages/en/onboarding.ts");
const pt = source("packages/i18n/src/messages/pt/onboarding.ts");

assert.ok(prompt.includes("ATLASBOT_PLATFORM_CONTEXT"));
assert.ok(prompt.includes("You are a persistent local AtlasBot teammate."));
assert.ok(prompt.includes("originally developed for OpenBot by Synthetify Labs"));
assert.ok(!prompt.includes("You are a persistent local OpenBot teammate."));
assert.ok(prompt.includes("openbot.tool_call"), "Internal compatibility tools were renamed unexpectedly.");
assert.ok(!prompt.includes("call openbot.send_feedback unasked"), "Unsolicited feedback must be disabled.");
assert.ok(prompt.includes("do not automatically send feedback or logs"), "Atlas L0 must require consent before feedback.");

assert.ok(flow.includes("evaluationOnly"));
assert.ok(choice.includes("onboarding.consent.evaluationOnly"));
for (const [path, content] of [
  ["FirstRunFlow", flow],
  ["FirstRunChoice", choice],
  ["English onboarding", en],
  ["Portuguese onboarding", pt],
]) {
  assert.ok(!/https:\/\/openbot\.run\/(?:terms|privacy|join)/iu.test(content), `${path}: upstream legal or invitation URL`);
}
for (const [path, content] of [["EN", en], ["PT", pt]]) {
  assert.ok(content.includes('"onboarding.consent.evaluationOnly"'), `${path}: evaluation notice missing`);
}
console.log("AtlasBot L0 public identity + non-upstream legal entrypoints static checks: PASS.");
console.log("NOTE: agent network egress, model self-identification and legal content require runtime tests.");
