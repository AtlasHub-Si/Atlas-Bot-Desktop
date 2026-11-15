#!/usr/bin/env bash
# Read-only upstream intake report. No merge, cherry-pick, build or code execution.
set -euo pipefail

mkdir -p upstream-report
OUT="upstream-report"
SOURCE="https://github.com/nightly-labs/openbot.git"
if git remote get-url atlas-upstream >/dev/null 2>&1; then
  git remote set-url atlas-upstream "$SOURCE"
else
  git remote add atlas-upstream "$SOURCE"
fi

git -c protocol.version=2 fetch --no-tags --filter=blob:none atlas-upstream main
ATLAS_SHA="$(git rev-parse HEAD)"
UPSTREAM_SHA="$(git rev-parse atlas-upstream/main)"
COMMON="$(git merge-base HEAD atlas-upstream/main || true)"
if [ -z "$COMMON" ]; then
  echo "ERROR: No common ancestor; refuse to infer a safe integration." >&2
  exit 1
fi

read -r ATLAS_ONLY UPSTREAM_ONLY < <(git rev-list --left-right --count HEAD...atlas-upstream/main)
git diff --name-only "$COMMON" atlas-upstream/main > "$OUT/upstream-files.txt"
git log --format='%h %as %s' "$COMMON"..atlas-upstream/main > "$OUT/upstream-commits.txt"

ATLAS_SHA="$ATLAS_SHA" UPSTREAM_SHA="$UPSTREAM_SHA" COMMON="$COMMON" ATLAS_ONLY="$ATLAS_ONLY" UPSTREAM_ONLY="$UPSTREAM_ONLY" node -e '
const fs = require("fs");
const files = fs.readFileSync("upstream-report/upstream-files.txt","utf8").split("\n").filter(Boolean);
const commits = fs.readFileSync("upstream-report/upstream-commits.txt","utf8").split("\n").filter(Boolean);
const sensitive = [
  /(^|\/)LICENSE$/i,/^NOTICE$/i,/^AGENTS\.md$/i,/^\.github\//,
  /(^|\/)package\.json$/,/^bun\.lock$/,
  /^apps\/auth-api\//,/^src\/main\//,/^src\/backend\//,
  /^build\//,/^electron-builder\.yml$/,
  /^packages\/brand\//,/^src\/renderer\//,/^apps\/mobile\//
];
const riskFiles = files.filter(file => sensitive.some(regex => regex.test(file)));
const report = {
  reported_at: new Date().toISOString(),
  atlas_sha: process.env.ATLAS_SHA,
  upstream_sha: process.env.UPSTREAM_SHA,
  common_ancestor: process.env.COMMON,
  atlas_only_commits: Number(process.env.ATLAS_ONLY),
  upstream_only_commits: Number(process.env.UPSTREAM_ONLY),
  upstream_changed_files: files.length,
  sensitive_files: riskFiles,
  update_available: Number(process.env.UPSTREAM_ONLY) > 0,
  mode: "READ_ONLY_NO_AUTO_MERGE",
  required_checks: ["legal_rights","third_party_notices","branding","network_egress","API_D1_R2_OTP","Windows_compatibility"]
};
fs.writeFileSync("upstream-report/summary.json", JSON.stringify(report,null,2)+"\n");
const doc = [
 "# AtlasBot upstream radar",
 "",
 "| Property | Value |",
 "| --- | --- |",
 `| Atlas SHA | \`${report.atlas_sha}\` |`,
 `| Upstream SHA | \`${report.upstream_sha}\` |`,
 `| Common ancestor | \`${report.common_ancestor}\` |`,
 `| Atlas-only commits | ${report.atlas_only_commits} |`,
 `| Upstream-only commits | ${report.upstream_only_commits} |`,
 `| Upstream changed files | ${report.upstream_changed_files} |`,
 `| Sensitive files | ${riskFiles.length} |`,
 "",
 "**Status:** Read-only; no upstream code was integrated. All changes require legal and engineering review.",
 "",
 "### Potentially sensitive paths (first 60)",
 "",
 ...riskFiles.slice(0,60).map(file => "- \`"+file.replace(/\`/g, "")+"\`"),
 "",
 "Full commit list, file list and JSON audit are in the build artifact."
].join("\n");
fs.writeFileSync("upstream-report/SUMMARY.md",doc+"\n");
';
cat "$OUT/SUMMARY.md"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  cat "$OUT/SUMMARY.md" >> "$GITHUB_STEP_SUMMARY"
fi
