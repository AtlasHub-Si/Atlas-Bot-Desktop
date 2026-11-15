# AtlasBot — Release & ownership gates (2026-11-15)

**Status: internal L0 only.** This checklist is based on source in `main` at `162fe8e` and the incrementally proposed desktop changes in PR #14. It is not a production signoff. Every completed claim must carry a specific PR, CI run, SHA-256, signed asset, live test or external provider resource.

## User-facing references

- PR #12 integrated the approved AtlasBot V0.7 Windows icons, renderer/favicon, official logo, and disabled the automatic GitHub-star/social-follow prompts.
- PR #14 shows legal sources inside the first-run evaluation notice and Settings > General, with a separate label for original operator terms/privacy. It does not imply acceptance of original terms by Atlas users.
- PR #14 directs the changelog CTA and startup recovery links to Atlas-owned destinations and disables unresolved social/community targets in the browser client.
- Original license and component attribution remain in `LICENSE`, `NOTICE`, and `docs/atlas/INSPIRATIONS_AND_CREDITS.md`.
- The Atlas institutional website now has `/pt/terms` (and EN/FR/ES) for *references*, while `/pt/privacy` governs the *website only*. Atlas-hosted accounts require independent operating terms and a separate privacy policy before production signups, including retention and incident response terms.

## Static egress audit (first completed baseline)

Workflow `AtlasBot external destinations audit` [#43763688976](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/runs/43763688976) scanned 3,288 source/configuration files and recorded 5,132 occurrences:

- `origin-legacy`: **425** (many generated plugin-catalog URLs)
- `social-third-party`: **25** (includes legitimate provider/social sharing endpoints)
- `external-provider`: **4,608** (many provider catalog/SDK/OAuth links)
- `atlas-owned`: **17**
- `development`: **28**
- `literal-or-template`: **29**

These are **literal occurrence counts**, not unique live destinations, network requests or proof of runtime traffic. Read the versioned workflow artifact `atlasbot-static-external-destinations`. Re-run after PR merge and inventory egress at runtime separately.

High-priority unresolved origins: `analytics.openbot.run` in desktop/renderer/mobile; `src/renderer/src/features/servers/AddServerOverlay.tsx` referencing original terms for hosted-server flows; `src/main/content-security-policy.ts` permitting `*.openbot.run`; `apps/auth-api/src/lib/landing-links.ts` and content/landing metadata still containing original operator destinations; generated plugin catalog URLs; `apps/mobile/app.json` still using original store IDs/OTA/update domains. Never blanket rewrite provider OAuth callbacks, sources, immutable plugin metadata, or historical attribution.

## Desktop commercial release blockers

1. Latest desktop code CI: `main` [#43759872552](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/runs/43759872552) **success**. PR #14 requires a fresh successful check after all changes. CI is not platform acceptance.
2. Current Windows build [#43759340960](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/runs/43759340960) produces an **internal-only unsigned** NSIS installer. It explicitly sets `CSC_IDENTITY_AUTO_DISCOVERY=false`; its presence in Actions artifacts does not make it a public release.
3. `electron-builder.yml` uses `si.atlashub.atlasbot.canary`, `atlasbot-canary`, and `package.json` still has `desktopName: openbot.desktop`. Do not change these in the internal canary: a new production app ID, URL handler, installer install path, data/profile migration plan and compatibility gate are required.
4. Windows needs a trusted Authenticode code-signing identity controlled by Atlas, an independent signed-build workflow and signature verification on the final installer and program.
5. macOS needs Atlas-owned Apple Developer Team ID, signing/provisioning, notarization/stapling, associated domains and a native GUI acceptance run. The current configuration contains inherited `ElectronTeamID` and must not use it as Atlas authority.
6. Native production builds need validation of screen-control permissions, process execution permissions, update-channel endpoint, integrity rollback, persistence across version upgrades, antivirus/SmartScreen behaviour, plus compatible `latest.yml` and release notes.
7. No GitHub Releases currently exist on the canonical repository. After passing all gates: choose a clean version/tag, build signed stable assets, verify SHA-256/digest/signatures/update, publish the official non-prerelease GitHub Release, and pin it with the website's `ATLASBOT_RELEASE_APPROVAL` variable. Do not override the website's approval enforcement.

## API, Marketplace and remote blockers

1. Atlas Cloudflare zone/account and D1/R2 staging resources exist; at the last verification, no Atlas auth Worker had been deployed and the remote D1 had no application schema.
2. A protected GitHub environment `atlasbot-auth-staging` and scoped `ATLASBOT_CF_STAGING_DEPLOY_TOKEN` are required to execute the reviewed PR #13 staging workflow. The GitHub connector available in this session cannot create repository secrets or protected deployment environments. No provider keys may enter source, CI reports or chat messages.
3. Resend domain `atlas-si.com` is verified. A sender-scoped Resend API key must be generated in the user's Resend account, stored directly as a Worker secret, and proven with live email OTP. The connected Resend account had no API keys at the last inspection.
4. Generate and persist distinct private/public ES256 ticket key material in a proper secrets store, plus `REMOTE_AUTH_WEBHOOK_SECRET`, `SKILLS_ADMIN_TOKEN`, `SITE_REPORT_HASH_SECRET`.
5. Before remote D1 migrations, establish durable backup, test a restoration procedure and run Wrangler's ordered remote migration tracking, never replay the scripts ad hoc.
6. Signal/TURN must be installed on an isolated owned VPS with WSS/TLS, TURN credentials, token verification and revocation tests, preserving existing Hermes/GBrain workloads. No SSH/VPS action was available from this chat.
7. Remote desktop, browser and Android pairing require live signed-in end-to-end acceptance. The Google Play original application is not an AtlasBot mobile release.
8. Marketplace agents/skills must use an Atlas-owned catalog and permission model before commercial availability. Preserve verified connector OAuth flows.

## Original generic release pipeline must not be used as an Atlas publisher

`scripts/release-preflight.ts` still expects inherited OpenBot Discord announcements, `cloudflare-production` secrets, vendor hosted-server credentials, and a legacy release environment. Do not satisfy it blindly. Create a separate, Atlas-only signed release workflow and publish only after ownership and security gates above.

## Exact outside actions needed

- **GitHub administration:** provision/protect the `atlasbot-auth-staging` environment and a least-privilege deploy token as `ATLASBOT_CF_STAGING_DEPLOY_TOKEN` (credentials stored within GitHub, never in chat).
- **Resend + Cloudflare:** create a send-only key and store it directly in Atlas's Worker secrets; provision other independent signing secrets.
- **Signing and app distribution:** Atlas-owned Windows Authenticode certificate / signing provider, Apple Developer Team credentials and (for mobile) Google Play Console/Apple distribution permissions.
- **VPS:** an approved SSH/computer-use connection or engineer executing reviewed commands, with isolation from production Hermes services.
- **Legal signoff:** operator identity, account processing/retention/privacy jurisdiction, third-party policies, support contact and final Atlas-only terms. Original software documents are linked as sources, not substituted as Atlas operating agreements.

**Stop condition:** no public installer, real users, account or mobile rollout until the corresponding live evidence exists; preserve fail-closed downloads and internal L0 profile.
