import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const license = read("LICENSE");
const notice = read("NOTICE");
const packages = ["package.json", "packages/ui/package.json", "packages/telemetry/package.json"];

assert.ok(license.startsWith("MIT License\n"), "AtlasBot root LICENSE must be MIT");
assert.ok(license.includes("Copyright (c) 2026 ATLAS GLOBAL TECH LTD"));
assert.ok(!/polyform|noncommercial/i.test(license), "Old root license is still present");
for (const path of packages) {
  assert.equal(JSON.parse(read(path)).license, "MIT", `${path} SPDX must be MIT`);
}
assert.ok(notice.includes("Synthetify Labs"), "Source provenance attribution must be retained");
assert.ok(notice.includes("Blobatar 0.2.0"), "Third-party notices must be retained");
assert.ok(notice.includes("solid-recharts 1.0.1"), "Third-party MIT attribution must be retained");
assert.ok(!/For a commercial license, contact licenses@openbot\.run/i.test(notice));
const docs = [
  "README.md", "AGENTS.md", "LEGAL.md", "docs/atlas/AUTHORIZATION.md",
  "docs/atlas/BRANDING.md", "docs/atlas/OPEN_SOURCE_TRANSITION.md",
  "docs/atlas/INSPIRATIONS_AND_CREDITS.md",
];
for (const path of docs) {
  assert.ok(!/PolyForm(?:-Noncommercial)?/i.test(read(path)), `${path} still describes the old root license`);
}
console.log("AtlasBot MIT license, package metadata and third-party notice checks PASS.");
