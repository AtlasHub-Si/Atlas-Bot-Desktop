# AtlasBot visual quick fix — 15 November 2026

Base: PR #8 commit 233b12c630c041d7621bbdd825ef2031d59cbb60. This branch preserves the tested local L0 identity. It does not merge earlier drafts or replace an installed application.

The Windows workflow downloads the exact owner-shared V0.7 archive and checks SHA-256 f23e9807bb7051d1dcaa23e7e20846390f9b223b68b5e090ab8827500fb1ef43 before use. Each asset also has a pinned hash. There is no runtime download. Sources: https://drive.google.com/drive/folders/1r9ihauU30Y176cEDdYBpphj0X2m6lYVd and the approval record in AtlasHub-Si/atlas-brand-system, studio/approved-dev/ATLASBOT_V0.7_APPROVAL.json.

Build: `python scripts/apply-atlasbot-approved-icons.py --download` followed by the existing `bun run dist:win`. The script supports `--archive <approved ZIP>` for offline use. No master is changed. The pinned archive has an identical duplicate README manifest record; verification accepts only that frozen duplicate.

Surfaces: renderer favicon, native Windows window/taskbar/tray PNG paths, executable and NSIS icon, and saved color PNG paths. Saved color identifiers remain intact; this internal build uses the approved A unchanged for each choice. macOS/Linux artwork, shared animated UI logo and real OS notification visual acceptance remain outside this quick fix. Existing Canary AUMID and profile stay unchanged.

CI checks native package resources and extracts application and installer icons into image evidence. These checks do not establish a real Windows taskbar/tray/notification visual acceptance or full runtime regression coverage. The installer remains an internal Actions artifact. Do not connect it to website downloads.

Rollback: discard this isolated branch/build. The current local installation and its data have not been changed. No production DNS, updater, session, connector credentials, licences or migrations are changed.
