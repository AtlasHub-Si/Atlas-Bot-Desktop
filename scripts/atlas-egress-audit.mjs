/**
 * Source-only inventory: no requests or credentials. Does not certify runtime egress.
 * Scans the user-facing, main process, remote and mobile code for static URL literals,
 * then produces a bounded provenance report for the AtlasBot release audit.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";

const roots = [
  "src/main", "src/renderer/src", "packages/ui/src", "apps/mobile/src",
  "apps/auth-api/src", "remote/api",
];
const individual = ["apps/mobile/app.json", "electron-builder.yml", "package.json"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc", ".yml", ".yaml"]);
const files = [];
function walk(path) {
  if (!existsSync(path)) return;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const p = join(path, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", "dist", "out", "generated", "fixtures", "__snapshots__"].includes(entry.name)) walk(p);
    } else if (entry.isFile() && extensions.has(extname(entry.name)) &&
      !/(?:\.test|\.spec|\.stories)\.[jt]sx?$/.test(entry.name)) files.push(p);
  }
}
for (const root of roots) walk(root);
for (const p of individual) if (existsSync(p)) files.push(p);

const urlPattern = /\b(?:https?|wss?):\/\/[^\s\x22\x27\x60<>\\]+/g;
const originPattern = /\b(?:openbot\.run|updates\.openbot\.run|nightly-labs\/openbot|run\.openbot\.mobile)\b/g;
const entries = [];
let countByCategory = {};
const thirdPartySocial = /^(?:www\.)?(?:instagram\.com|facebook\.com|x\.com|twitter\.com|tiktok\.com|youtube\.com|discord\.gg|discord\.com|threads\.net|linkedin\.com)$/i;
function classify(raw) {
  const s = raw.toLowerCase();
  if (/openbot\.run|nightly-labs\/openbot|run\.openbot\.mobile/.test(s)) return "origin-legacy";
  if (/atlas-si\.com|atlashub\.si|atlashub\.digital|atlashub-si\/atlas-bot-desktop/.test(s)) return "atlas-owned";
  try {
    const u = new URL(raw);
    if (thirdPartySocial.test(u.hostname)) return "social-third-party";
    if (["localhost","127.0.0.1","0.0.0.0"].includes(u.hostname)) return "development";
    return "external-provider";
  } catch {
    return "literal-or-template";
  }
}
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const found = new Map();
    for (const match of line.matchAll(urlPattern)) {
      const token = match[0].replace(/[),.;]+$/g, "");
      let display = token.split(/[?#]/)[0].slice(0, 230);
      found.set(display, classify(token));
    }
    for (const match of line.matchAll(originPattern)) if (![...found.keys()].some(u => u.includes(match[0]))) found.set(match[0], classify(match[0]));
    for (const [destination, category] of found) {
      countByCategory[category] = (countByCategory[category] || 0) + 1;
      if (entries.length < 8000) entries.push({ file: file.split("\\").join("/"), line: i + 1, destination, category });
    }
  }
}
entries.sort((a,b) => a.category.localeCompare(b.category) || a.file.localeCompare(b.file) || a.line-b.line);
const output = ".openbot-build/atlas-egress-audit";
mkdirSync(output, { recursive: true });
const stats = { auditedFiles: files.length, matchedDestinations: Object.values(countByCategory).reduce((a,b)=>a+b,0), savedDestinations: entries.length, countByCategory };
writeFileSync(join(output,"report.json"), JSON.stringify({ ...stats, entries }, null, 2) + "\n");
let summary = "# AtlasBot static URL/egress inventory\n\n";
summary += "Static literals only; dynamic, runtime and network egress are NOT verified. Third-party provider URLs may be legitimate OAuth, model or documentation flows.\n\n";
summary += "Files scanned: " + stats.auditedFiles + "\n\n";
summary += "Matched destinations: " + stats.matchedDestinations + "\n\n";
for (const [k,v] of Object.entries(countByCategory).sort()) summary += "- " + k + ": " + v + "\n";
summary += "\n## Legacy and social references (triage; NOT automatically rewritten)\n\n";
for (const e of entries.filter(x=>["origin-legacy","social-third-party"].includes(x.category)).slice(0,450)) {
  summary += "- `" + e.file + ":" + e.line + "` — " + e.destination + " (" + e.category + ")\n";
}
writeFileSync(join(output,"report.md"),summary);
console.log(JSON.stringify(stats));
