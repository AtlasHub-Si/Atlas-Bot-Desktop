# AtlasBot L0 — Windows local operational acceptance

**Date:** 2026-11-15
**Scope:** one isolated Windows test profile with `AtlasBot` local workspace. No hosted account, Atlas cloud login, remote Signal/TURN, WebRTC or unattended task execution.
**Build source:** `test/atlasbot-local-operational-l0-20261115` based on AtlasBot `main` (MIT).
**State:** GitHub CI and manual Windows acceptance are separate gates. This test does not certify full cloud independence or end-to-end identity/provisioning.

## Automated build gates

The workflow `.github/workflows/atlasbot-windows-l0.yml` uses a Windows GitHub runner to:
1. Install desktop dependencies without the Expo/React Native mobile workspace.
2. Assert MIT source metadata and Atlas default auth / Windows userData / workspace / protocol isolation.
3. Run Desktop and renderer typechecks.
4. Run offline local agent/workspace E2E with a fake ACP provider and offline provider-discovery E2E.
5. Build the NSIS `AtlasBot-*-x64.exe` and check the packaged files.
6. Publish a short-lived **private Actions artifact**, with SHA-256, not a public release.

A successful build and fake-agent E2E do **not** prove that the installed GUI or an actual model works on the end user's PC. Do not mark L0 accepted until manual results are recorded.

## Manual acceptance — Windows canary

**Preconditions:** Windows 10/11 x64, an isolated test user/Windows VM, at least 3–5 GB free for installation and runtime data. Do not use any previous OpenBot profile, existing workspace, real customer records or private keys. The NSIS installer is unsigned and should not be published as a production binary.

1. Open the [Windows L0 workflow run](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/workflows/atlasbot-windows-l0.yml), select the successful run on the L0 test branch and download its internal artifact ZIP. Extract the `.exe` and `sha256.txt`.
2. Verify file integrity with PowerShell: `Get-FileHash '.\AtlasBot-0.70.0-x64.exe' -Algorithm SHA256`; compare to `sha256.txt`.
3. Disconnect the test VM from the network for first launch. **Do not sign in with OpenBot or reuse an old identity.**
4. Install for the current user, selecting a dedicated empty installation folder, e.g. `%LOCALAPPDATA%\Programs\AtlasBot Canary`; launch `AtlasBot`.
5. Confirm one main window opens, it says AtlasBot, navigation works, and settings load, all without a cloud sign-in.
6. Confirm `%APPDATA%\AtlasBot Canary` and `%USERPROFILE%\AtlasBot Canary` were created. Confirm the previous `%APPDATA%\OpenBot` and `%USERPROFILE%\OpenBot` are unaffected (if present).
7. Create an agent named `ATLAS-L0-TEST`, with only a disposable test folder; inspect the agent and chat composer. If the UI requires external account before creating a local agent, record the exact screen and do **not** bypass the gate with OpenBot login.
8. If a **separately configured test provider** is available (e.g. an isolated local Ollama/OpenCode model, with no personal tokens), configure it. Ask the agent to write `AtlasBot L0 OK` to a file in the disposable test folder. Do not grant full-computer access or use secret folders.
9. Restart AtlasBot; verify the test agent and workspace remain and the created file is unchanged.
10. With connectivity enabled only in a controlled environment, capture DNS/HTTP activity during startup and the local task. Investigate any `*.openbot.run` egress; do not configure accounts, Signal or cloud features until validated. A native provider is permitted to contact its own endpoint only when explicitly selected.
11. Close AtlasBot, then inspect startup errors under `%APPDATA%\AtlasBot Canary\logs`. Record screenshots, the SHA-256, Windows version, result per gate and any unexpected process/permission prompts.

## PASS criteria

- [ ] CI `L0`: typecheck + offline agent tests + Windows installer + package inspection all green
- [ ] Installed Windows GUI actually opens without a cloud account
- [ ] Standalone canary profile/workspaces, original OpenBot not altered
- [ ] Create one local agent and complete one disposable task using a known-safe provider
- [ ] Persistence after restart
- [ ] Network capture reviewed; no unexpected OpenBot service dependencies for the tested workflow

## L1 — separate cloud login gate

The Atlas Cloudflare API staging branch is `feat/atlasbot-api-staging-isolation-20261114`. Its API source and Resend OTP adapter have passed CI, **but its D1 migration, Worker deployment, DNS/Access/secret configuration and live OTP smoke tests are not yet verified**.

Do not conflate L0 success with L1. The website release should stay `Em breve` until a stable, signed and audited AtlasBot installer is approved.

## Exit / rollback

Do not modify the existing OpenBot installation. Uninstall only AtlasBot Canary after saving the disposable acceptance report. Removing `%APPDATA%\AtlasBot Canary` or `%USERPROFILE%\AtlasBot Canary` deletes test data; do this only if intentionally discarding the test workspace. Never delete any OpenBot directories to clean up the AtlasBot canary.
