#!/usr/bin/env python3
"""Verify and install AtlasBot candidate assets. Does not change existing app icons."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
from tempfile import NamedTemporaryFile
from zipfile import ZipFile

TARGET = Path("src/renderer/src/assets/atlasbot-v0.5")
PREFIX = PurePosixPath("renderer-assets/atlasbot-v0.5")
EXPECTED_ARCHIVE_SHA256 = "68a7cb7ebf42de2ff7384f439acb9ce8e081d6261ef3003720daaf880928bd99"

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def install(archive: Path, repo: Path, apply: bool) -> tuple[int, int]:
    if digest(archive.read_bytes()) != EXPECTED_ARCHIVE_SHA256:
        raise ValueError("Archive checksum differs from the reviewed V0.5 pack")
    with ZipFile(archive) as z:
        names = set(z.namelist())
        if "MANIFEST.json" not in names:
            raise ValueError("Missing MANIFEST.json")
        manifest = json.loads(z.read("MANIFEST.json"))
        if manifest.get("version") != "0.5.0" or manifest.get("state") != "CANDIDATE_NOT_APPROVED":
            raise ValueError("Unsupported package or approval state")
        if manifest.get("baseline", {}).get("includedInPack") is not False:
            raise ValueError("The frozen master must not be included")
        verified = []
        for asset in manifest["files"]:
            source = asset["path"]
            part = PurePosixPath(source)
            if part.is_absolute() or ".." in part.parts or not part.is_relative_to(PREFIX) or source not in names:
                raise ValueError(f"Unsafe or missing asset: {source}")
            payload = z.read(source)
            if digest(payload) != asset["sha256"] or len(payload) != asset["bytes"]:
                raise ValueError(f"Asset hash/size mismatch: {source}")
            relative = part.relative_to(PREFIX)
            dest = repo / TARGET / Path(*relative.parts)
            verified.append((dest, payload))
        if len(verified) != len({p for p,_ in verified}):
            raise ValueError("Duplicate file path")
        conflicts = [str(p) for p,data in verified if p.exists() and digest(p.read_bytes()) != digest(data)]
        if conflicts:
            raise FileExistsError("Conflicting existing asset: " + ", ".join(conflicts[:8]))
        if apply:
            for dest,data in verified:
                if dest.exists():
                    continue
                dest.parent.mkdir(parents=True,exist_ok=True)
                with NamedTemporaryFile(dir=dest.parent,prefix=".atlasbot-",delete=False) as tmp:
                    tmp.write(data)
                    staged = Path(tmp.name)
                staged.replace(dest)
    return len(verified), sum(len(data) for _,data in verified)

if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive",type=Path,required=True)
    parser.add_argument("--repo",type=Path,default=Path.cwd())
    parser.add_argument("--apply",action="store_true")
    args=parser.parse_args()
    count,size=install(args.archive,args.repo,args.apply)
    print(f'{"INSTALLED" if args.apply else "VALIDATED"}: {count} assets ({size} bytes)')
