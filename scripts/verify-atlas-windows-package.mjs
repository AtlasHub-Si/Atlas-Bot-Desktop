import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

assert.equal(process.platform, "win32", "This verification runs on Windows only.");
const out = resolve("dist", "win-unpacked");
const exe = resolve(out, "AtlasBot.exe");
const originalExe = resolve(out, "OpenBot.exe");
assert.ok(existsSync(exe), "Missing AtlasBot.exe.");
assert.ok(!existsSync(originalExe), "The AtlasBot package must not be named OpenBot.exe.");
for (const path of [
  "resources/app.asar",
  "resources/app.asar.unpacked/node_modules/effect/package.json",
  "resources/remote-desktop-runtime/win32/x64/sunshine.exe",
  "resources/cua-driver/win32/x64/cua-driver.exe",
]) assert.ok(existsSync(resolve(out, path)), `Missing Windows package resource: ${path}`);

const pe = readFileSync(exe);
assert.equal(pe.toString("ascii", 0, 2), "MZ", "Invalid Windows PE header");
const peOffset = pe.readUInt32LE(0x3c);
assert.equal(pe.toString("ascii", peOffset, peOffset + 4), "PE\0\0", "Invalid Windows PE signature");
assert.equal(pe.readUInt16LE(peOffset + 4), 0x8664, "AtlasBot.exe must target x64");

const metaScript =
  `$v = (Get-Item -LiteralPath '${exe.replaceAll("'", "''")}').VersionInfo; ` +
  "[pscustomobject]@{ProductName=$v.ProductName; FileDescription=$v.FileDescription} | ConvertTo-Json -Compress";
const meta = JSON.parse(execFileSync("pwsh", ["-NoProfile", "-NonInteractive", "-Command", metaScript], {encoding: "utf8"}));
assert.equal(meta.ProductName, "AtlasBot", "Windows product version metadata must be AtlasBot");
// FileDescription can vary by Electron Builder build and is recorded rather than normalized.
const installer = resolve("dist", "AtlasBot-0.70.0-x64.exe");
assert.ok(existsSync(installer), "Missing AtlasBot Windows NSIS installer");
assert.ok(statSync(installer).size > 50_000_000, "Unexpectedly small NSIS installer");
console.log(JSON.stringify({passed:true,product:meta.ProductName,fileDescription:meta.FileDescription,installerBytes:statSync(installer).size},null,2));
console.log("NOTE: package verification does not replace GUI/manual network runtime acceptance.");
