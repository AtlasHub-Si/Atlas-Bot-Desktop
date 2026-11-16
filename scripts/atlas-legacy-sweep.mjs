// Source-only AtlasBot legacy inventory; no network, installs, credentials or source mutations.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const OUT = ".openbot-build/atlas-legacy-sweep";
const MAX_BYTES = 3000000;
const MAX_ENTRIES = 50000;
const binary = new Set([".png",".jpg",".jpeg",".webp",".gif",".ico",".icns",".pdf",".zip",".gz",".mp4",".mov",".mp3",".wav",".woff",".woff2",".ttf",".otf",".dmg",".exe",".dll",".so",".a",".appimage",".jar",".wasm",".bin",".sqlite",".db"]);
const patterns = [
  ["origin-repo", /nightly-labs\/openbot/gi],
  ["origin-cloud", /\b(?:[a-z0-9-]+\.)*openbot\.run\b/gi],
  ["origin-site", /\bopenbot\.site\b/gi],
  ["origin-app", /\b(?:app|run)\.openbot(?:\.[a-z0-9-]+)*\b/gi],
  ["package-import", /@openbot\//g],
  ["environment", /\bOPENBOT_[A-Z0-9_]+\b/g],
  ["url-scheme", /\bopenbot(?:-[a-z0-9-]+)*:\/\//gi],
  ["public-copy", /\bOpenBot\b/g],
];
const groups = [
  ["attribution-preserve", /^NOTICE$|^LICENSE$|^LEGAL\.md$|^docs\/atlas\/(?:OPEN_SOURCE_TRANSITION|INSPIRATIONS_AND_CREDITS)\.md$/],
  ["third-party", /(?:^|\/)(?:vendor|third-party|third_party)\//],
  ["tests", /(?:^|\/)(?:test|tests|fixtures|__snapshots__)\//],
  ["historical-docs", /^CHANGELOG\.md$|^ANALYTICS\.md$|^PRIVACY\.md$|^docs\/|^plans\//],
  ["distribution", /^scripts\/(?:install|hosting\/|release)|^build\/|^electron-builder|^apps\/mobile\/app\.json$|^apps\/auth-api\/src\/server\/latest-download\.ts$|^src\/main\/(?:update|host-release)/],
  ["user-facing", /^packages\/i18n\/src\/messages\/|^packages\/ui\/src\/|^packages\/brand\/src\/|^src\/renderer\/src\/|^apps\/mobile\/src\/|^apps\/auth-api\/src\/(?:content\/|components\/|lib\/landing)/],
  ["runtime", /^apps\/auth-api\/|^src\/main\/|^src\/backend\/|^remote\//],
];
const classify = path => groups.find(([,re])=>re.test(path))?.[0] ?? "compatibility-or-other";
const count = (o,k) => { o[k]=(o[k]??0)+1; };
const paths = execFileSync("git",["ls-files","-z"],{encoding:"utf8",maxBuffer:33554432}).split("\0").filter(Boolean).sort();
const records=[],byGroup={},byKind={};const matched = new Set();
let scanned=0,skippedBinary=0,skippedLarge=0,occurrences=0;
for(const path of paths) {
  let fileStat;try{fileStat=statSync(path);}catch{continue;}
  if(!fileStat.isFile()) continue;
  const size=fileStat.size;
  if(size>MAX_BYTES){skippedLarge++;continue;}
  if(binary.has(extname(path).toLowerCase())){skippedBinary++;continue;}
  const buffer=readFileSync(path);
  if(buffer.subarray(0,4096).includes(0)){skippedBinary++;continue;}
  scanned++;
  const group=classify(path);
  for(const [index,line] of buffer.toString("utf8").split("\n").entries()){
    for(const [kind,re] of patterns){
      re.lastIndex=0;
      for(const match of line.matchAll(re)){
        occurrences++;matched.add(path);count(byGroup,group);count(byKind,kind);
        if(records.length<MAX_ENTRIES)records.push({path,line:index+1,group,kind,token:match[0].slice(0,120)});
      }
    }
  }
}
const priority={"distribution":0,"user-facing":1,"runtime":2,"compatibility-or-other":3,"historical-docs":4,"tests":5,"attribution-preserve":6,"third-party":7};
records.sort((a,b)=>(priority[a.group]??8)-(priority[b.group]??8)||a.path.localeCompare(b.path)||a.line-b.line);
const summary={tracked:paths.length,textFiles:scanned,skippedBinary,skippedLarge,matchedFiles:matched.size,occurrences,
  saved:records.length,truncated:occurrences>records.length,byGroup,byKind,
  limits:["Static references only: runtime traffic not tested","Preserve attribution","Internal IDs/protocols need migration tests"]};
mkdirSync(OUT,{recursive:true});
writeFileSync(join(OUT,"report.json"),JSON.stringify({...summary,records},null,2)+"\n");
const text=[
  "# AtlasBot — whole-tree legacy source sweep","",
  "Read-only Git-tracked scan. Findings are not evidence of runtime traffic or license status.","",
  "Tracked: "+summary.tracked+" | text scanned: "+scanned+" | matched files: "+matched.size+" | occurrences: "+occurrences+" | records saved: "+records.length,"",
  "## Area counts","",...Object.entries(byGroup).sort().map(([k,v])=>"- "+k+": "+v),"",
  "## Pattern counts","",...Object.entries(byKind).sort().map(([k,v])=>"- "+k+": "+v),"",
  "## Priority triage (first 200 references)","",
  ...records.filter(r=>["distribution","user-facing","runtime"].includes(r.group)).slice(0,200)
    .map(r=>"- "+r.path+":"+r.line+" ["+r.group+"/"+r.kind+"] "+r.token),"",
  "Full bounded JSON report is in the CI artifact. Do not use find/replace across internal contracts."
].join("\n");
writeFileSync(join(OUT,"report.md"),text+"\n");
console.log(JSON.stringify(summary));
