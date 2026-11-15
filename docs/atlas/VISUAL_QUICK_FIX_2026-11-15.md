# AtlasBot visual quick fix — 15 November 2026

Base: PR #8 commit 233b12c630c041d7621bbdd825ef2031d59cbb60. Keep the tested local L0 identity. This branch does not replace the installed application.

The owner-authenticated V0.7 archive was downloaded and its SHA-256 verified locally: f23e9807bb7051d1dcaa23e7e20846390f9b223b68b5e090ab8827500fb1ef43. The three exact approved derivatives are now committed. CI and runtime do not need access to private Drive files. No master or sharing setting was changed. See build/atlasbot-approved-icons.json for source paths, approval source and all target hashes.

Build: `python scripts/apply-atlasbot-approved-icons.py --verify-installed` then the existing `bun run dist:win`. An offline reapply supports `--archive <approved ZIP>`. The frozen pack repeats an identical README manifest record; verification accepts only that duplicate and checks every asset.

Surfaces: renderer favicon, Windows window/taskbar/tray PNG paths, executable/NSIS ICO, saved color PNG paths. Saved color identifiers remain intact; the internal build uses the approved A unchanged for each choice. macOS/Linux icon acceptance, shared animated UI logo and actual OS notification appearance remain outside this quick fix. Canary AUMID, profile and protocol stay unchanged.

CI verifies package resources and embedded PE icon pixels, then uploads extracted icon images and a comparison sheet. This is package validation, not complete GUI acceptance. The installer remains an internal Actions artifact; do not link it to public website downloads.

Earlier CI attempts stopped safely because Drive is private and returned an HTML sign-in page. No incorrect file passed the SHA check. The authenticated, hash-checked derivatives remove that build dependency.

Rollback: discard this isolated branch/build. No installed app, persisted data, production DNS, updater, connector credentials, licences or migrations were changed.
