# AtlasBot Windows Canary 0.1 — internal evaluation only

This is **not** the AtlasBot product release, not a licence grant and not a complete rebranding. It is the shortest path to testing the Electron Desktop on Windows without installing the multi-platform monorepo dependencies on the user's almost-full computer.

## What changed

- Packaged desktop authentication fallback: `https://api-test.atlas-si.com` instead of `https://api.openbot.run`. This Atlas target is NOT YET LIVE: expect remote sign-in to fail until Atlas API stage is configured. Runtime override `OPENBOT_AUTH_API_URL` remains supported.
- Current `main` textual Atlas branding and existing default renderer; **approved V0.7 visual assets and six characters are not yet integrated**. They remain with GPTWORK in PR #2 and the brand library.
- New Windows-only GitHub Actions canary build, excluding `@openbot/mobile` and its Expo/Skia packages. The GitHub runner, rather than the Windows end user's disk, installs build dependencies.
- Packaged Windows canary uses its own application ID (`si.atlashub.atlasbot.canary`), Windows userData directory (`%APPDATA%\\AtlasBot Canary`), agent workspaces (`%USERPROFILE%\\AtlasBot Canary`) and URL scheme (`atlasbot-canary`) rather than the original OpenBot directories/registration. The deep-link protocol is deliberately not fully migrated; do not test invite/OAuth callbacks in this canary.
- No API deploy, cloud migration, release publication, update activation, production DNS or VPS changes.
- Native CUA/voice/runtime downloads and package tests can fail on hosted runner. **A CI build must pass before an installer is claimed.**

## Execute & inspect

1. Review and merge only after testing as appropriate; Actions on the internal canary branch run the Windows workflow on push.
2. Inspect `Actions → AtlasBot Windows internal canary` for all step results; require an NSIS `*x64.exe` and `sha256.txt`.
3. If CI passes, the artifact is held for 2 days under the workflow run. It is an **evaluation build**, not a GitHub Release.
4. Run the package only in a disposable Windows test profile, ideally a clean VM. The new canary profile and installer are isolated from the original OpenBot, but a full review of all inherited paths and other network integrations is **not complete**. No OpenBot login; do not reuse an existing OpenBot profile or tokens.
5. Keep automatic updates off. Compare the SHA-256 and verify network egress before accepting the app as independent.
6. After rights, signing, visual and network QA, prepare an authorized installer/release. Do not publish or redistribute on a commercial site just because the canary compiled.

## Important gates

- The original code licence is **PolyForm Noncommercial 1.0.0**. Commercial business use and redistribution need rights analysis and, if necessary, an additional grant. Preserve `LICENSE`, `NOTICE`, legal attribution and code provenance.
- Internal IDs and protocol schemes are intentionally unchanged to avoid corrupting state.
- This guard only checks the default account API origin. Other OpenBot endpoints/providers must be addressed in GPTWORK's REA-001 and in end-to-end egress tests.
- Do not claim the account API, OTP, remote Signal or Hermes are live based on this build.

## Website relation

The website repo `AtlasHub-Si/atlas-si-website` previously sent users to `nightly-labs/openbot` releases. The correction is in its separate PR #7, not merged. **Do not link the AtlasBot website to this canary artifact.**
