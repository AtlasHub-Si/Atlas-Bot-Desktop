import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
// Read JSONC without a dependency on TypeScript's changing config parser exports.
// A comment marker inside a quoted URL is content, not a comment.
function stripComments(input) {
  let out = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"' && (i === 0 || input[i - 1] !== "\\")) quoted = !quoted;
    if (!quoted && ch === "/" && input[i + 1] === "/") {
      while (i < input.length && input[i] !== "\n") i++;
      out += "\n";
      continue;
    }
    if (!quoted && ch === "/" && input[i + 1] === "*") {
      i += 2;
      while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
      i++;
      continue;
    }
    out += ch;
  }
  return out;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const path = resolve(root, "apps/auth-api/wrangler.jsonc");
const source = readFileSync(path, "utf8");
const config = JSON.parse(stripComments(source).replace(/,\s*([}\]])/g, "$1"));
const stage = config?.env?.["atlas-staging"];
assert.ok(stage, "Missing atlas-staging environment");
assert.equal(stage.name, "atlasbot-auth-staging");
assert.equal(stage.workers_dev, false, "Staging must not expose a public workers.dev URL");
assert.equal(stage.preview_urls, false);
assert.deepEqual(stage.routes, []);
assert.deepEqual(stage.triggers?.crons, []);
assert.equal(stage.vars?.HOSTED_SERVERS_ENABLED, "false");
assert.equal(stage.vars?.AUTH_EXPOSE_DEVELOPMENT_CODE, "false");
assert.equal(stage.vars?.SITE_PUBLISH_ENABLED, "false");
assert.equal(stage.vars?.SIGNAL_ENTRY_ZONE_ID, "");
assert.equal(stage.vars?.EMAIL_FROM, "");
assert.equal(stage.vars?.GITHUB_APP_CLIENT_ID, "");
assert.equal(stage.d1_databases?.length, 1);
assert.equal(stage.d1_databases[0].database_name, "atlasbot-auth-staging");
assert.equal(stage.d1_databases[0].database_id, "321fd070-533d-4708-b108-af97f809e8d8");
assert.deepEqual(
  Object.fromEntries(stage.r2_buckets.map(({ binding, bucket_name }) => [binding, bucket_name])),
  {
    AVATARS: "atlasbot-avatars-staging",
    SKILLS: "atlasbot-skills-staging",
    SITES: "atlasbot-sites-staging",
  },
);
assert.deepEqual(
  stage.secrets.required.slice().sort(),
  [
    "REMOTE_TICKET_PRIVATE_JWK",
    "REMOTE_TICKET_PUBLIC_JWKS",
    "REMOTE_AUTH_WEBHOOK_SECRET",
    "SITE_REPORT_HASH_SECRET",
    "SKILLS_ADMIN_TOKEN",
  ].sort(),
);
assert.ok(
  !/openbot\.run|nightly-labs|stripe|boat\.run/i.test(JSON.stringify(stage)),
  "Atlas staging must not reference inherited upstream services",
);
console.log("AtlasBot staging configuration: PASS (static checks; no deployment)");
