// AtlasBot RC1 manual preinstalled Host pairing regression test.
// Automatic downloads must remain fail-closed. Never publish a claim value.
import assert from "node:assert/strict";
import {
  ATLASBOT_MANUAL_HOST_ENROLLMENT_ENABLED,
  ATLASBOT_SERVER_INSTALL_ENABLED,
  enrollExistingAtlasHostCommand,
  installServerCommand,
} from "../packages/contracts/src/hosted-servers";

assert.equal(ATLASBOT_SERVER_INSTALL_ENABLED, false, "Unapproved automatic install must remain off");
assert.equal(ATLASBOT_MANUAL_HOST_ENROLLMENT_ENABLED, true, "RC1 manual claim must be available");
const claim = "A".repeat(43);
const denied = installServerCommand(claim);
assert.ok(denied.includes("unavailable until a signed AtlasBot release"));
assert.ok(!denied.includes(claim), "Failed installer must never leak a claim");

const command = enrollExistingAtlasHostCommand(claim);
assert.ok(command.includes("preinstall the verified first-party Host"));
assert.ok(command.includes("openbot login --claim"), "Host compatibility CLI required");
assert.ok(command.includes(claim));
assert.ok(!/curl|wget|nightly-labs|api\.openbot\.run|sudo|install-server\.sh/.test(command),
  "Manual pairing must have no downloads, third-party origins or privileged installer");
assert.equal(command.split("\n").length, 4, "Instructions must be readable and newline separated");
assert.ok(enrollExistingAtlasHostCommand("'; rm -rf /").includes("Invalid AtlasBot one-time host claim"));
console.log("AtlasBot RC1 manual preinstalled Host pairing PASS; automatic installer remains disabled.");
