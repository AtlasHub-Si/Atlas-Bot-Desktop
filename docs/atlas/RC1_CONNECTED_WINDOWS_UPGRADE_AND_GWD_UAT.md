# AtlasBot RC1 Connected — Windows in-place upgrade + GWD Host UAT

**2026-11-16 · INTERNAL QA ONLY · no public installer or automatic updates.**

This runbook is for an AtlasBot **Canary** install already on Windows, NOT the historical OpenBot product. The candidate retains `si.atlashub.atlasbot.canary`, the `atlasbot-canary` invitation scheme and the per-user `AtlasBot Canary` user-data directory. It is built from `integration/atlasbot-rc1-20261116`; its installer and SHA manifests are available as short-lived GitHub Actions artifacts, not as public GitHub Releases.

**Separate original OpenBot:** never uninstall or migrate the independently installed OpenBot application, `%APPDATA%\OpenBot`, its agents, or its launch paths as part of this pilot.

## A. Preflight on the Windows user account (read-only)

1. Exit AtlasBot Canary fully (including tray/background instances). Do not exit or change OpenBot.
2. Confirm free C: space. Installer is hundreds of MB and upgrade + backups may require **at least 5 GiB free**. If less, use a different backup disk or free space before continuing.
3. Locate and inventory `%APPDATA%\AtlasBot Canary`, `%LOCALAPPDATA%\AtlasBot Canary`, the current AtlasBot installer directory, user-selected agent workspace paths and model/provider authentication state. **Do not assume** all workspaces reside in the app-data folder.
4. Confirm installed AtlasBot version, product name, executable path, application publisher and any existing update service/scheduled task. Refuse an in-place upgrade if the previous appId/profile differs or the current app is actually OpenBot.
5. Obtain the candidate via the official AtlasHub-Si GitHub Actions workflow **AtlasBot RC1 Connected Windows internal candidate** (NOT the old L0 workflow). Verify release manifest `sourceCommit`, file name, size and SHA-256/SHA-512 locally before running it. It is unsigned, so Windows SmartScreen may show a reputation warning; **do not disable or globally bypass SmartScreen**.

## B. Backup & install (requires operator confirmation on this PC)

1. Copy each discovered AtlasBot Canary profile and workspace to access-controlled, preferably encrypted backup storage while the app is closed. Include local agent database, provider/auth state and workspace files; never place secrets in GitHub, logs, or tickets. Record sizes, UTC time, version and checksums in a manifest separate from secrets.
2. Preserve original installed binary/installer for rollback if legally and technically permitted.
3. Install the **AtlasBot-0.70.0-x64.exe** RC1 Connected QA candidate in the same approved AtlasBot installation location **only after** comparing appId with the installed Canary. Do not perform an unattended `/S` install or remove the existing app. The installer currently shares version 0.70.0; use the SHA to distinguish builds.
4. Verify that `%APPDATA%\AtlasBot Canary` and the external agent workspace remain intact. Sign in via OTP with an authorized staging account. The connected identity may be different from the previous synthetic L0 identity; do **not** claim all previous agents/sessions are migrated without inspecting them.
5. Keep `ATLASBOT_ENABLE_UPDATES` unset or `0`; there is no approved Atlas stable auto-update feed. To run **isolated local-only L0 diagnostic mode**, start the app with `ATLASBOT_LOCAL_ONLY_L0=1` in that process's environment. Remove that override and relaunch for Connected mode. This fallback is not a data migration.
6. If agent/workspace ownership, existing sessions, credentials, provider isolation, first launch or the current profile changes unexpectedly, stop immediately and restore from backups before further operations.

## C. Acceptance tests (all needed for user GO)

- **Local:** existing agents, workspaces, file access, OpenCode/Hermes provider configuration and offline capabilities; no unexpected requests to original vendor domains.
- **Account:** real Atlas OTP + `GET /v1/me` + logout and restart/session recovery against `https://api-test.atlas-si.com`.
- **Remote:** register/claim disposable Linux GWD Host, fetch one-use ES256 ticket, connect `wss://signal.atlas-si.com/v1/signal`, establish *actual* WebRTC DataChannels `rpc`, `events`, `files`; perform one harmless read/write task in disposable workspace.
- **Security:** wrong tenant DENY, unapproved filesystem path DENY, logout/revoke disconnect, short-lived ticket and reconnection validation, TURN relay forced from another network. Do not mix GWD data into Atlas Cloud.
- **Recovery:** restart Desktop and Host, verify data persistence, test rollback to prior AtlasBot Canary with backed-up profile. Do not allow automatic migration or forced update of previous OpenBot app.

## D. GWD Host installation separate from the Web app

The GWD Host can be installed **without** `bot.atlas-si.com`: it uses the Atlas account Worker, Signal/TURN and a one-time claim or local CLI OTP. Either the user or a trusted operator/Antigravity can run the reviewed installation on an isolated VPS with its own credentials and backup. The Web app is a *second client* for that Host, not a prerequisite for installing it.

- Use only AtlasHub-Si build with pinned source SHA, checksums and authorized internal host install procedure. **Never run old `nightly-labs/openbot` scripts or images** on GWD.
- Do not use the existing `scripts/install-server.sh` without an approved tag: it is intentionally fail-closed. A GitHub Actions QA AppImage is **not yet** a signed or approved self-hosted distribution.
- GWD preflight: `/srv/gwd` services, separate host service user/namespace, allowlisted egress, persistence, disk/swap, backups, monitoring and isolation; preserve Cockpit, CRM, Postgres/Redis, Authelia, Hermes.

## E. Browser preview and production gate

`https://bot-preview.atlas-si.com/app` is bound to the staging Worker and protected by founder-only Cloudflare Access. It is suitable for interactive founder QA after the user signs into Access. It is not public.

`bot.atlas-si.com` is presently the **reserved future browser entrypoint**; its previous Caddy origin targets a removed container and returns 502. Do not restore the old Atlas Pilot bot. Switch this hostname to a validated Atlas browser Worker deployment only after WebApp UAT, branding/legal audit, cookie/API authorization and rollback proof.

**Release decision:** Until (A)-(E) pass, keep the RC1 branch as an integration candidate, not a public production claim. Merge to main can happen after static/CI gates, but is *not equivalent* to delivering validated packages, Web access, host isolation or production service.
