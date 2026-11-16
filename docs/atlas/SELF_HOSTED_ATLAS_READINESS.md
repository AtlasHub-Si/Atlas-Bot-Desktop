# AtlasBot — Self-Hosted Release & Onboarding Readiness

**Date:** 2026-11-16  
**Status:** Engineering preparation / no publication or infrastructure GO.

## Distribution constraints

1. Only `AtlasHub-Si/Atlas-Bot-Desktop` releases may supply AtlasBot executables. No `nightly-labs/openbot` fallback.
2. `scripts/install-server.sh` now requires an explicit `--approved-tag vX.Y.Z`; it refuses unpinned automatic installation.
3. Tag must match the version in the YAML manifest. AppImage name must be `AtlasBot-VERSION-x86_64.AppImage` or `AtlasBot-VERSION-arm64.AppImage`.
4. SHA-512 checked against the release manifest is a **file integrity check**, not separate publisher authenticity. Require signatures / trusted release provenance at the publication gate.
5. Preserve internal compatibility names (`openbot` CLI, `OPENBOT_*`, database, URI schemes, daemons, existing home dirs) until a tested migration is available.
6. The current Atlas-SI website release resolver must remain **fail closed** until binaries and update manifests have independent approval evidence.

## Required validation

- [ ] Exact source LICENSE=MIT and NOTICE attribution included in artifact; verify bundled dependencies separately.
- [ ] Pinned, reproducible Linux x86_64 / ARM64 builds, checksums, signatures and release metadata.
- [ ] `bash -n`, shellcheck, and negative tests for missing, malformed, swapped and unapproved release tags.
- [ ] Disposable Ubuntu 24.04 VM test: installation, service restart, version upgrade, persistence and rollback.
- [ ] Server claim single-use, time-to-live, no log leakage, authorization to target host and claim revocation.
- [ ] Atlas Account API + Signal/TURN end-to-end from Desktop and Web, including reconnect, mobile and revoke.
- [ ] Dedicated Hermes service user and separated Atlas/GWD data, secrets, storage and role/BU permissions.
- [ ] Explicit product owner authorization **before** public installer distribution or installing on a GWD/AtlasHub VPS.

## Separate engineering units

- **Release automation:** signed AtlasBot host packages; self-hosted installer provenance and update channel.
- **GWD onboarding:** SSH scope, inventory, dry-run, human approval, install and rollback evidence.
- **Remote control plane:** Atlas Account API claim protocol, Signal and TURN, independent tenant host.
- **Compatibility migration:** stage `openbot` internal identifiers behind shims; avoid renaming paths or IPC keys in place.

Historical OpenBot documentation remains for attribution and compatibility reference; it is not the Atlas product contract.
