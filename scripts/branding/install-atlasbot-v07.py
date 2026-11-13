#!/usr/bin/env python3
"""Pin and install approved-for-dev AtlasBot V0.7 visuals in the renderer.

No replacement of Electron release icons, runtime assets, settings or user data.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import stat
from zipfile import ZipFile

ARCHIVE_SHA256 = "f23e9807bb7051d1dcaa23e7e20846390f9b223b68b5e090ab8827500fb1ef43"
TARGET_DIR = Path("src/renderer/src/assets/atlasbot-v0.7")
ALLOWED_PREFIXES = {"01_logo_approved", "02_favicons_web", "03_icons_desktop", "04_motion", "05_previews", "06_docs"}

def checksum(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def run(archive: Path, repo: Path, apply: bool) -> tuple[int,int]:
    if checksum(archive.read_bytes()) != ARCHIVE_SHA256:
        raise ValueError("V0.7 ZIP differs from owner-approved archive")
    targets=[]
    with ZipFile(archive) as z:
        m = json.loads(z.read("MANIFEST.json"))
        if m.get("version")!="0.7.0" or m.get("approval")!="DEV_APPROVED":
            raise ValueError("Version/approval does not match")
        seen=set()
        for entry in m["files"]:
            src=entry["path"]; p=PurePosixPath(src)
            if p.is_absolute() or ".." in p.parts or src in seen or src not in z.namelist():
                raise ValueError(f"Unsafe or duplicate path: {src}")
            seen.add(src)
            if p.parts[0] not in ALLOWED_PREFIXES and src!="README.md":
                raise ValueError("Unsupported asset location")
            info=z.getinfo(src)
            if stat.S_ISLNK(info.external_attr >> 16) or info.file_size > 20_000_000:
                raise ValueError("Unsafe archive entry")
            data=z.read(src)
            if checksum(data)!=entry["sha256"] or len(data)!=entry["bytes"]:
                raise ValueError("Asset checksum/size mismatch: "+src)
            dst=repo/TARGET_DIR/Path(*p.parts)
            if dst.is_symlink():
                raise ValueError("Target cannot be symbolic link")
            if dst.exists() and checksum(dst.read_bytes())!=checksum(data):
                raise FileExistsError("Existing file differs: "+str(dst))
            targets.append((dst,data))
    if apply:
        for dst,data in targets:
            dst.parent.mkdir(parents=True,exist_ok=True)
            if not dst.exists(): dst.write_bytes(data)
    return len(targets),sum(len(d) for _,d in targets)

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive",type=Path,required=True)
    parser.add_argument("--repo",type=Path,default=Path.cwd())
    parser.add_argument("--apply",action="store_true")
    args=parser.parse_args()
    count, size=run(args.archive,args.repo,args.apply)
    print(f'{"INSTALLED" if args.apply else "VERIFIED"} {count} files, {size} bytes')
