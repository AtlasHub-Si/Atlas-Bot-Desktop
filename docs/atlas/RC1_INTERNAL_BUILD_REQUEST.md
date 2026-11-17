# AtlasBot RC1 Connected — internal main build request

**Authorization:** 2026-11-16. **Class:** INTERNAL MVP QA only, no public download, no production installer, no auto-update. This file acts as the explicit release-candidate build marker on `main`.

- Windows RC1 Connected x64: `.github/workflows/atlasbot-windows-rc1-connected.yml`.
- Linux Self-Hosted x64 + local OCI build verification: `.github/workflows/atlasbot-linux-host-rc1-internal.yml`.
- Artifacts must include exact workflow `GITHUB_SHA`, source repository and SHA256/SHA512 checksums. These are not publisher signatures.
- The AppImage is not authorized for global systemd installation on a shared VPS; use the Docker/isolated canary protocol from `docs/atlas/RC1_CONNECTED_WINDOWS_UPGRADE_AND_GWD_UAT.md`.
- No GitHub Releases publication, GHCR distribution, Cloudflare Worker deployment, website redirect or alteration to the GWD business environment from these workflows.
- The owner may install the Windows candidate manually **after backing up** the existing AtlasBot Canary profile and checking available disk. Do not uninstall the separate original OpenBot app.
- Browser QA remains under founder-only Cloudflare Access at `https://bot-preview.atlas-si.com/app`; `bot.atlas-si.com` remains unreleased.
- The Cloudflare `REMOTE_AUTH_WEBHOOK_SECRET` was synchronized by the OpenBot VPS operator; no secret is in this file.

**Exit:** record Windows in-place upgrade PASS/FAIL, real GWD Host WebRTC `rpc/events/files` PASS/FAIL, tenant isolation and rollback. Only then authorize a stable release/distribution channel.
