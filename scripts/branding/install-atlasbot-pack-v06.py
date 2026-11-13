#!/usr/bin/env python3
"""Verify and optionally install the reviewed AtlasBot V0.6 asset archive.

No files outside src/renderer/src/assets/atlasbot-v0.6 may be written.
"""
import argparse
import hashlib
import json
import stat
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

EXPECTED_SHA256 = "54996b346f9c2da7b99979566755deb950b070fc04d66143c66eea39f7ac330a"
DEST_ROOT = Path("src/renderer/src/assets/atlasbot-v0.6")
SOURCE_ROOT = PurePosixPath("renderer-assets/atlasbot-v0.6")

def hash_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()

def run(archive: Path, repo: Path, apply: bool) -> tuple[int, int]:
    archive = archive.resolve()
    if hash_bytes(archive.read_bytes()) != EXPECTED_SHA256:
        raise ValueError("Archive SHA-256 is not the reviewed V0.6 version")
    count, bytes_count = 0, 0
    pending = []
    with ZipFile(archive) as z:
        manifest = json.loads(z.read("MANIFEST.json"))
        if manifest["version"] != "0.6.0" or manifest["state"] != "CANDIDATE_NOT_APPROVED":
            raise ValueError("Unexpected pack version or approval status")
        if manifest["baseline"]["includedInPack"] is not False:
            raise ValueError("Frozen brand master must remain external")
        unique = set()
        for record in manifest["files"]:
            raw = record["path"]
            p = PurePosixPath(raw)
            if p.is_absolute() or ".." in p.parts or raw in unique:
                raise ValueError("Invalid/duplicate path: " + raw)
            unique.add(raw)
            info = z.getinfo(raw)
            if stat.S_ISLNK(info.external_attr >> 16):
                raise ValueError("Symlink in ZIP: " + raw)
            if info.file_size != record["bytes"] or info.file_size > 20_000_000:
                raise ValueError("Unexpected file size: " + raw)
            data = z.read(info)
            if hash_bytes(data) != record["sha256"]:
                raise ValueError("Invalid file SHA-256: " + raw)
            if not p.is_relative_to(SOURCE_ROOT):
                continue
            relative = p.relative_to(SOURCE_ROOT)
            destination = repo / DEST_ROOT / Path(*relative.parts)
            if destination.exists() and hash_bytes(destination.read_bytes()) != record["sha256"]:
                raise FileExistsError("Refusing overwrite: " + str(destination))
            pending.append((destination, data))
            count += 1
            bytes_count += len(data)
    if apply:
        for destination, data in pending:
            if not destination.exists():
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(data)
    return count, bytes_count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    count, total = run(args.archive, args.repo, args.apply)
    print(f'{"INSTALLED" if args.apply else "VALIDATED"}: {count} application assets ({total} bytes)')
