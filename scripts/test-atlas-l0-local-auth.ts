// L0 canary-only proof: a local identity opens without cloud auth and never calls its account API.
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Effect } from "effect";
import { CentralAuthManager } from "../src/main/central-auth-manager";

let externalRequests = 0;
const transport = async (): Promise<Response> => {
  externalRequests += 1;
  throw new Error("The local-only L0 initialization called an external account service.");
};
const manager = new CentralAuthManager({
  apiUrl: "https://api-test.atlas-si.com",
  storagePath: join(tmpdir(), "atlasbot-L0-test-profile", "session.json"),
  encrypt: (value) => Buffer.from(value, "utf8"),
  decrypt: (value) => value.toString("utf8"),
  localOnlyL0: true,
  canPersist: () => false,
  fetch: transport,
});
try {
  const state = await Effect.runPromise(manager.initialize());
  assert.equal(state.status, "signed_in", "L0 canary must enter the local UI.");
  if (state.status !== "signed_in") throw new Error("Local L0 did not initialize.");
  assert.equal(state.user.email, "local@atlasbot.invalid");
  assert.match(state.user.name ?? "", /Apenas local/);
  assert.match(state.user.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(externalRequests, 0, "L0 initialization must not contact account API.");
  assert.deepEqual(manager.getState(), state);
  const again = await Effect.runPromise(manager.initialize());
  assert.deepEqual(again, state, "Local identity must be stable within one profile.");
  assert.equal(externalRequests, 0);
  console.log("AtlasBot L0 local-only identity initialization PASS. Cloud credentials were not issued.");
} finally {
  await Effect.runPromise(manager.dispose());
}
