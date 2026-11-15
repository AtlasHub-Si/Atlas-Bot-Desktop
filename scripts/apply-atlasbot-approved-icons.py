#!/usr/bin/env python3
"""Apply byte-identical approved AtlasBot V0.7 icons to an isolated Windows build."""
import argparse
import hashlib
import json
import stat
import urllib.request
import urllib.parse
import http.cookiejar
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

ARCHIVE_SHA256 = "f23e9807bb7051d1dcaa23e7e20846390f9b223b68b5e090ab8827500fb1ef43"
DRIVE_FILE_ID = "1vPg8qi02qOTU3UpUZut9PH0DEFcBse2c"
PNG = "03_icons_desktop/atlasbot-app-icon-512.png"
ICO = "03_icons_desktop/atlasbot-app.ico"
FAVICON = "02_favicons_web/atlasbot-favicon-32.png"
EXPECTED = {
    PNG: "f60d3a1c7f8ef33a480324dcbe89743e952d6819eaad3de83f258029ea31707b",
    ICO: "b3e5b42bc68fe6af3e8ca224738b66979d7b840fcc8c1c2b2ab773833720479a",
    FAVICON: "8c04d197d4e48f283a4698b808a455158664468ff7bd5824bfd519b8eb15839e",
}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def safe_target(root, relative):
    target = root / relative
    if not target.resolve().is_relative_to(root):
        raise ValueError("Target is outside this checkout")
    for item in [target, *target.parents]:
        if item == root:
            break
        if item.is_symlink():
            raise ValueError("Target must not use a symlink")
    return target

class DownloadForm(HTMLParser):
    def __init__(self):
        super().__init__()
        self.action = None
        self.fields = {}
        self.active = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "form" and attrs.get("id") == "download-form":
            self.active = True
            self.action = attrs.get("action")
        elif self.active and tag == "input" and attrs.get("name"):
            self.fields[attrs["name"]] = attrs.get("value", "")

    def handle_endtag(self, tag):
        if tag == "form":
            self.active = False

def download(destination):
    # Follow Google's public download confirmation form, then enforce the frozen archive hash.
    url = "https://drive.google.com/uc?export=download&id=" + DRIVE_FILE_ID
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    for attempt in range(2):
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 AtlasBot-Brand-CI/1.0"})
        with opener.open(request, timeout=90) as response:
            data = response.read(15_000_001)
            content_type = response.headers.get("Content-Type", "")
        if len(data) <= 15_000_000 and digest(data) == ARCHIVE_SHA256:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
            return
        print(json.dumps({"downloadAttempt": attempt + 1, "bytes": len(data),
                          "contentType": content_type, "sha256": digest(data)}))
        if attempt == 0 and "text/html" in content_type:
            form = DownloadForm()
            form.feed(data.decode("utf-8", errors="replace"))
            parsed = urllib.parse.urlparse(form.action or "")
            if (parsed.scheme == "https" and parsed.hostname == "drive.usercontent.google.com"
                    and parsed.path == "/download" and form.fields.get("id") == DRIVE_FILE_ID):
                url = form.action + "?" + urllib.parse.urlencode(form.fields)
                continue
        raise ValueError("Downloaded pack does not match the approved V0.7 SHA-256")
    raise ValueError("Download confirmation did not return the approved pack")

def run(root, archive):
    if digest(archive.read_bytes()) != ARCHIVE_SHA256:
        raise ValueError("Archive differs from approved V0.7")
    with ZipFile(archive) as pack:
        manifest = json.loads(pack.read("MANIFEST.json"))
        if manifest.get("version") != "0.7.0" or manifest.get("approval") != "DEV_APPROVED":
            raise ValueError("Unexpected approval or version")
        records = {}
        for record in manifest["files"]:
            raw = record["path"]
            part = PurePosixPath(raw)
            if part.is_absolute() or ".." in part.parts or "\\" in raw:
                raise ValueError("Unsafe source path")
            # The frozen pack repeats the identical README record. Do not alter the master pack.
            if raw in records:
                if raw != "README.md" or records[raw] != record:
                    raise ValueError("Unexpected duplicate manifest record")
                continue
            records[raw] = record
            entry = pack.getinfo(raw)
            if stat.S_ISLNK(entry.external_attr >> 16) or entry.file_size > 20_000_000:
                raise ValueError("Unsafe archive member")
            data = pack.read(raw)
            if len(data) != record["bytes"] or digest(data) != record["sha256"]:
                raise ValueError("Asset integrity check failed: " + raw)
        assets = {}
        for name, expected in EXPECTED.items():
            data = pack.read(name)
            if digest(data) != expected:
                raise ValueError("Approved icon hash mismatch: " + name)
            assets[name] = data

    destinations = {}
    for variant in ("production", "dev", "preview"):
        destinations["build/icon-" + variant + ".png"] = PNG
        destinations["build/icon-" + variant + ".ico"] = ICO
    destinations["build/icon.ico"] = ICO
    # Saved color identifiers remain valid. Each Windows choice uses the approved A unchanged.
    for color in ("rose", "terracotta", "gold", "green", "blue", "pink", "beige", "gray", "white"):
        destinations["build/logo-colors/icon-" + color + ".png"] = PNG
    destinations["src/renderer/public/atlasbot-favicon.ico"] = ICO
    destinations["src/renderer/public/atlasbot-favicon-32.png"] = FAVICON
    report = {
        "scope": "internal Windows L0 build only",
        "archiveSha256": ARCHIVE_SHA256,
        "source": "https://drive.google.com/file/d/" + DRIVE_FILE_ID + "/view",
        "assets": [],
        "guiAcceptance": "not established by asset integrity checks",
    }
    for target, source in destinations.items():
        destination = safe_target(root, target)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(assets[source])
        report["assets"].append({"path": target, "source": source, "sha256": digest(assets[source])})
    output = root / ".openbot-build/atlas-icons"
    output.mkdir(parents=True, exist_ok=True)
    (output / "asset-integrity.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"passed": True, "assets": len(destinations), "archiveSha256": ARCHIVE_SHA256}))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path)
    parser.add_argument("--download", action="store_true")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    archive = args.archive or root / ".openbot-build/atlas-icons/approved-v07.zip"
    if args.download:
        download(archive)
    run(root, archive)
