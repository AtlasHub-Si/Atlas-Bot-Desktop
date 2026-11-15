// Local workerd HTTP checks. Never deploy this generated configuration.
// Run after CLOUDFLARE_ENV=atlas-staging bun run --cwd apps/auth-api build.
// CI=true GITHUB_ACTIONS=true bun scripts/atlas-auth-worker-e2e.mjs
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, generateKeyPairSync, randomBytes, randomUUID, verify } from "node:crypto";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

if (process.env.CI !== "true" || process.env.GITHUB_ACTIONS !== "true") {
  throw new Error("This local-only Worker check runs only in a disposable GitHub Actions job.");
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "apps/auth-api");
const output = join(root, ".openbot-build/atlas-auth-worker-e2e");
const scratch = await mkdtemp(join(tmpdir(), "atlas-auth-worker-"));
const state = join(scratch, "state");
const configPath = join(app, "dist/server/wrangler.atlas-ci.json");
const entryPath = join(app, "dist/server/worker.atlas-ci.mjs");
const checks = [];
const diagnostics = [];
let diagnosticTail = "";
let worker;
let failure;
let migrations = [];
const childEnv = {
  PATH: process.env.PATH,
  HOME: process.env.HOME,
  TMPDIR: scratch,
  CI: "true",
  GITHUB_ACTIONS: "true",
  NO_COLOR: "1",
  WRANGLER_SEND_METRICS: "false",
  CLOUDFLARE_SEND_METRICS: "false",
  CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false",
  CLOUDFLARE_INCLUDE_PROCESS_ENV: "true",
};

function check(name, condition, detail) {
  checks.push({ name, passed: Boolean(condition), ...(detail ? { detail } : {}) });
  assert.ok(condition, name);
}
async function command(args) {
  const child = spawn(process.execPath, ["x", "wrangler", ...args], {
    cwd: app, env: childEnv, stdio: ["ignore", "pipe", "pipe"],
  });
  // Wrangler can print generated credentials. Do not forward or retain its output.
  child.stdout.resume();
  child.stderr.resume();
  const [code] = await once(child, "exit");
  assert.equal(code, 0, "A local Wrangler command failed");
}
async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((done) => server.close(done));
  return port;
}
const port = await freePort();
const origin = "http://127.0.0.1:" + port;
async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(new URL(path, origin), {
    method, redirect: "manual", signal: AbortSignal.timeout(10_000),
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}
function captureDiagnostic(chunk) {
  diagnosticTail = (diagnosticTail + chunk.toString()).replace(/\u001b\[[0-9;]*m/g, "");
  const lines = diagnosticTail.split("\n");
  diagnosticTail = lines.pop().slice(-2000);
  for (const line of lines) {
    const d1 = /D1 call failed: (overloaded|constraint|network|other) (first|all|raw|run|batch|exec) retry=(none|succeeded|failed)/.exec(line);
    if (d1) diagnostics.push({ subsystem: "D1", failure: d1[1], operation: d1[2], retry: d1[3] });
    const account = /Account service request failed: auth\/[a-f0-9]+ ([A-Za-z][A-Za-z0-9]*)/.exec(line);
    if (account) diagnostics.push({ subsystem: "account", tag: account[1] });
    if (line.includes("Remote ticket signing is not configured")) diagnostics.push({ subsystem: "signer", tag: "missing_binding" });
    if (line.includes("REMOTE_TICKET_PRIVATE_JWK is invalid")) diagnostics.push({ subsystem: "signer", tag: "invalid_private" });
    if (line.includes("REMOTE_TICKET_PUBLIC_JWKS is invalid")) diagnostics.push({ subsystem: "signer", tag: "invalid_public" });
    if (line.includes("The public JWKS does not contain the active key")) diagnostics.push({ subsystem: "signer", tag: "missing_active_key" });
  }
}
async function startWorker() {
  worker = spawn(process.execPath, ["x", "wrangler", "dev", "--local", "--config", configPath,
    "--persist-to", state, "--ip", "127.0.0.1", "--port", String(port)], {
    cwd: app, env: childEnv, stdio: ["ignore", "pipe", "pipe"], detached: true,
  });
  worker.stdout.on("data", captureDiagnostic);
  worker.stderr.on("data", captureDiagnostic);
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    assert.equal(worker.exitCode, null, "The local Worker stopped before readiness");
    try {
      if ((await request("/health/live")).status === 200) return;
    } catch {}
    // Poll observable health; do not infer readiness from elapsed time.
    await delay(100);
  }
  throw new Error("The local Worker did not become healthy");
}
async function stopWorker() {
  if (!worker || worker.exitCode !== null) return;
  const started = worker;
  const exited = once(started, "exit");
  process.kill(-started.pid, "SIGTERM");
  await Promise.race([exited, delay(10_000)]);
  if (started.exitCode === null) {
    process.kill(-started.pid, "SIGKILL");
    await exited;
  }
  worker = undefined;
}
async function login(email) {
  const start = await request("/v1/auth/email/start", { method: "POST", body: { email } });
  assert.equal(start.status, 200, "The local-only sign-in challenge failed");
  assert.equal(typeof start.body.developmentCode, "string", "The local-only code was absent");
  const signed = await request("/v1/auth/email/verify", {
    method: "POST", body: { challengeId: start.body.challengeId, code: start.body.developmentCode },
  });
  assert.equal(signed.status, 200, "The local-only sign-in verification failed");
  assert.equal(typeof signed.body.sessionToken, "string");
  return signed.body.sessionToken;
}
async function redeem(ticket, id = randomUUID()) {
  return request("/v1/mobile-auth/redeem", {
    method: "POST", body: { ticket, deviceId: id, deviceName: "Atlas CI Android", platform: "android" },
  });
}

try {
  const built = JSON.parse(await readFile(join(app, "dist/server/wrangler.json"), "utf8"));
  check("the built Worker uses the Atlas staging name", built.name === "atlasbot-auth-staging");
  check("the built staging code does not expose development codes",
    built.vars.AUTH_EXPOSE_DEVELOPMENT_CODE === "false");
  check("the built Worker has no public routes", !built.routes?.length && built.workers_dev === false);
  check("the built Worker uses the isolated Atlas D1", built.d1_databases?.length === 1 &&
    built.d1_databases[0].database_id === "321fd070-533d-4708-b108-af97f809e8d8");
  check("the built Worker has no inherited mail services",
    !built.services?.length && !built.send_email?.length);
  check("staging configuration has no upstream control-plane destinations",
    !/openbot\.run|nightly-labs|stripe|boat\.run/i.test(JSON.stringify({
      vars: built.vars, routes: built.routes, databases: built.d1_databases, buckets: built.r2_buckets,
    })));
  migrations = (await readdir(join(app, "migrations"))).filter((name) => name.endsWith(".sql")).sort();

  // Override only a disposable, local generated file. No stored environment, secret, or remote DB
  // is read or changed. No mail transport is configured; local OTP responses are test data.
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const keyId = "atlas-ci-local";
  const testSecrets = {
    REMOTE_TICKET_PRIVATE_JWK: JSON.stringify({ ...privateKey.export({ format: "jwk" }), kid: keyId }),
    REMOTE_TICKET_PUBLIC_JWKS: JSON.stringify({ keys: [{ ...publicKey.export({ format: "jwk" }), kid: keyId }] }),
    SKILLS_ADMIN_TOKEN: randomBytes(32).toString("base64url"),
    SITE_REPORT_HASH_SECRET: randomBytes(32).toString("base64url"),
  };
  Object.assign(childEnv, testSecrets);
  const local = {
    ...built,
    name: "atlasbot-auth-ci-local",
    main: basename(entryPath),
    account_id: undefined,
    routes: [],
    workers_dev: false,
    preview_urls: false,
    services: [],
    send_email: [],
    secrets: { required: Object.keys(testSecrets) },
    triggers: { crons: [] },
    vars: {
      AUTH_EXPOSE_DEVELOPMENT_CODE: "true",
      EMAIL_SMTP_HOST: "", EMAIL_SMTP_PORT: "", EMAIL_SMTP_USERNAME: "", EMAIL_FROM: "",
      EMAIL_LICENSE_FROM: "", RESEND_API_KEY: "",
      SITE_PUBLISH_ENABLED: "false", SITE_COOKIE_ISOLATION_READY: "false",
      HOSTED_SERVERS_ENABLED: "false", HOSTED_SERVERS_ALLOWED_USER_IDS: "",
      REMOTE_TICKET_KEY_ID: keyId,
      REMOTE_SIGNAL_URL: "ws://127.0.0.1:1/v1/signal",
      REMOTE_SIGNAL_HOMES: "", REMOTE_AUTH_WEBHOOK_URL: "", REMOTE_AUTH_WEBHOOK_URLS: "",
      SIGNAL_ENTRY_ZONE_ID: "", GITHUB_APP_CLIENT_ID: "",
    },
    d1_databases: built.d1_databases.map((db) => ({ ...db, migrations_dir: join(app, "migrations") })),
  };
  const entry = "import worker from " + JSON.stringify("./" + basename(built.main)) + ";\n" +
    'export default { ...worker, async fetch(request, env, context) {\n' +
    'if (new URL(request.url).pathname === "/__atlas_ci_bindings") return Response.json({\n' +
    'privateKeyPresent: Boolean(env.REMOTE_TICKET_PRIVATE_JWK), publicKeyPresent: Boolean(env.REMOTE_TICKET_PUBLIC_JWKS),\n' +
    'keyIdPresent: Boolean(env.REMOTE_TICKET_KEY_ID), privateKeyEnumerable: Object.keys(env).includes("REMOTE_TICKET_PRIVATE_JWK") });\n' +
    'return worker.fetch(request, env, context); } };\n';
  await writeFile(entryPath, entry);
  await writeFile(configPath, JSON.stringify(local), { mode: 0o600 });
  await command(["d1", "migrations", "apply", "DB", "--local", "--config", configPath, "--persist-to", state]);
  check("all source migrations apply to disposable local D1", migrations.length === 56);
  await startWorker();
  const bindings = await request("/__atlas_ci_bindings");
  check("the local Worker receives its generated signing bindings", bindings.status === 200 &&
    bindings.body.privateKeyPresent && bindings.body.publicKeyPresent && bindings.body.keyIdPresent, bindings.body);
  check("anonymous device access is refused", (await request("/v1/mobile-auth/devices")).status === 401);
  check("anonymous pairing is refused", (await request("/v1/mobile-auth/ticket", {
    method: "POST", body: {},
  })).status === 401);
  const owner = await login("atlas-ci-owner@example.test");
  check("email challenge verifies to an account session", (await request("/v1/me", { token: owner })).status === 200);
  const devicePublicKey = randomBytes(32).toString("base64url");
  const host = { hostId: randomUUID(), fingerprint: createHash("sha256").update(devicePublicKey).digest("base64url") };
  const jwks = await request("/.well-known/jwks.json");
  check("JWKS publishes only the generated public key", jwks.status === 200 &&
    jwks.body.keys.length === 1 && jwks.body.keys[0].kid === keyId && !("d" in jwks.body.keys[0]), { status: jwks.status, hasKeys: Array.isArray(jwks.body?.keys) });
  const registered = await request("/v2/remote/hosts/register", {
    method: "POST", token: owner, body: {
      hostId: host.hostId, ownerMembershipId: randomUUID(), name: "Atlas CI host", devicePublicKey,
    },
  });
  check("the account registers its own host through the real route", registered.status === 201,
    { status: registered.status, code: /^[a-z0-9_]+$/.test(registered.body?.error?.code ?? "") ? registered.body.error.code : null });
  const hostTicket = await request("/v2/remote/hosts/" + host.hostId + "/ticket", {
    method: "POST", body: { machineToken: registered.body.machineToken },
  });
  check("the registered host receives a remote connection ticket", hostTicket.status === 200 &&
    hostTicket.body.signalUrl === "ws://127.0.0.1:1/v1/signal");
  const [header, claims, signature] = hostTicket.body.ticket.split(".");
  const ticketHeader = JSON.parse(Buffer.from(header, "base64url"));
  const ticketClaims = JSON.parse(Buffer.from(claims, "base64url"));
  check("the host ticket has a valid ES256 signature and host binding", ticketHeader.alg === "ES256" &&
    ticketHeader.kid === keyId && ticketClaims.hostId === host.hostId && ticketClaims.role === "host" &&
    ticketClaims.exp > Date.now() / 1000 && verify("sha256", Buffer.from(header + "." + claims),
      { key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url")));
  const badHost = await request("/v1/mobile-auth/ticket", {
    method: "POST", token: owner, body: { host: { ...host, fingerprint: "x".repeat(43) } },
  });
  check("pairing refuses another host fingerprint", badHost.status === 409 || badHost.status === 400);
  const issued = await request("/v1/mobile-auth/ticket", { method: "POST", token: owner, body: { host } });
  check("the desktop gets a short-lived host-bound pairing code", issued.status === 200 &&
    issued.body.expiresAt > Date.now() && issued.body.expiresAt <= Date.now() + 120_000);
  const paired = await redeem(issued.body.ticket);
  check("a phone redeems the pairing code", paired.status === 200 &&
    paired.body.host.hostId === host.hostId && paired.body.host.fingerprint === host.fingerprint);
  check("the pairing code cannot be replayed", (await redeem(issued.body.ticket)).status === 401);
  const phone = paired.body.sessionToken;
  const listing = await request("/v1/mobile-auth/devices?host=" + host.hostId, { token: owner });
  const device = listing.body.devices[0];
  check("the host lists the Android device", listing.status === 200 &&
    listing.body.devices.length === 1 && device.platform === "android");
  const stranger = await login("atlas-ci-stranger@example.test");
  const denied = await request("/v1/mobile-auth/ticket", { method: "POST", token: stranger, body: { host } });
  check("another account cannot issue pairing for this host", denied.status === 409 && denied.body.error.code === "mobile_host_mismatch");
  await stopWorker();
  await startWorker();
  check("the desktop session survives a Worker restart", (await request("/v1/me", { token: owner })).status === 200);
  check("the phone session survives a Worker restart",
    (await request("/v1/mobile-auth/session", { token: phone })).status === 200);
  check("the desktop revokes the phone",
    (await request("/v1/mobile-auth/devices/" + device.sessionId, { method: "DELETE", token: owner })).status === 204);
  check("a revoked phone session is refused",
    (await request("/v1/mobile-auth/session", { token: phone })).status === 401);
  const link = await request("/v1/mobile-auth/link", { method: "POST", token: owner, body: { host } });
  check("the desktop creates a persistent link", link.status === 200 && typeof link.body.link === "string");
  const linked = await redeem(link.body.link);
  check("the persistent link signs in a phone", linked.status === 200);
  check("the desktop revokes its persistent link",
    (await request("/v1/mobile-auth/link?host=" + host.hostId, { method: "DELETE", token: owner })).status === 204);
  check("the revoked persistent link is refused", (await redeem(link.body.link)).status === 401);
  check("revoking the persistent link ends the linked phone session",
    (await request("/v1/mobile-auth/session", { token: linked.body.sessionToken })).status === 401);
  check("logout ends the desktop session",
    (await request("/v1/auth/logout", { method: "POST", token: owner })).status === 204);
  check("a logged-out desktop session is refused", (await request("/v1/me", { token: owner })).status === 401);
} catch (error) {
  // Assertion messages contain only fixed check names and HTTP status codes.
  failure = error instanceof Error ? error.message : "Worker check failed";
  const detail = checks.find((item) => !item.passed)?.detail;
  if (detail) failure += " " + JSON.stringify(detail);
  if (diagnostics.length) failure += " " + JSON.stringify(diagnostics);
} finally {
  await stopWorker();
  await rm(configPath, { force: true });
  await rm(entryPath, { force: true });
  await rm(scratch, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const passed = !failure && checks.length > 0 && checks.every((item) => item.passed);
  await writeFile(join(output, "report.json"), JSON.stringify({
    passed, runtime: "local workerd through wrangler dev --local", remoteDeployment: false,
    mailDelivery: "none; disposable local development-code responses only",
    sourceSha: process.env.GITHUB_SHA ?? null,
    limitations: ["No live Resend", "No Signal/TURN", "No Android app/device", "No desktop Electron UI"],
    migrations, checks, diagnostics, ...(failure ? { failure } : {}),
  }, null, 2) + "\n");
  for (const item of checks) process.stdout.write((item.passed ? "PASS " : "FAIL ") + item.name + "\n");
  if (!passed) {
    process.stderr.write("FAIL Atlas local Worker check: " + (failure ?? "a check failed") + "\n");
    process.exitCode = 1;
  }
}
