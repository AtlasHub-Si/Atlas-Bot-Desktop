# REA-001 — Architecture and dependencies

**Date:** 2026-11-15 (America/Sao_Paulo). **Method:** GitHub source, PR, workflow, artifact and configuration reads. **Desktop baseline:** `c8c2510ccc3ae85786792c27b24b658630e21c4f`. This is an incremental evidence report. It does not certify a full runtime audit, network capture, mobile compatibility or production readiness.

## Runtime ownership

| Layer | Existing source | State and boundary |
|---|---|---|
| Local app/agents/data | `src/main`, `src/backend`, `src/preload`, `src/renderer` | Desktop and local SQLite/workspaces stay on the computer. L0 Canary is not a cloud identity. |
| Account control plane | `apps/auth-api` | Existing account, OTP, session, device and membership implementation. Atlas stage requires schema, owned secrets and live validation. Do not rebuild it from scratch. |
| Remote signalling | `remote/api`, `remote/coturn` | Signal/TURN are required for remote connectivity. Existing source does not prove Atlas-hosted services are installed. |
| Shared wire contracts | `packages/contracts`, `packages/team-client` | Preserve shipped protocols, capability gates and internal identifiers. |
| Model runtime | `src/backend/provider-drivers.ts` | Provider CLI and model processing are distinct from Atlas account service. |
| Brand catalog | PR #2 and approved V0.7 pack | Development-approved assets, separate from persistent agent/user avatars. |

## Mobile authentication diagnosis

1. [CentralAuthManager line 403](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/central-auth-manager.ts#L403) creates a temporary connection through `POST /v1/mobile-auth/ticket`; line 462 creates a persistent link through `POST /v1/mobile-auth/link`.
2. [Authorized-request guard line 2294](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/central-auth-manager.ts#L2294) checks `#sessionToken` and returns `error.auth.signInRequired` when absent, before transport. This explains why an L0 local identity can show the workspace but cannot create pairing credentials. Do not remove this authorization gate.
3. The Canary L0 branch deliberately creates a local identity without a remote bearer token. [PR #7](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/pull/7) is explicit that it must not authorize cloud/Signal operations.
4. Main [application services line 1225](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/application-services.ts#L1225) has the inherited default account API. L0 changes the Canary fallback to Atlas stage `api-test.atlas-si.com`, whose live service is not established. The first-blocking condition is absent session, not proof of a DNS or Signal failure.
5. [Mobile redemption line 73](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/apps/mobile/src/features/auth/api/mobile-auth.ts#L73) reads the API URL from the parsed connection payload and calls `/v1/mobile-auth/redeem`. [Email login line 125](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/apps/mobile/src/features/auth/api/mobile-auth.ts#L125) permits an API override only in a development build; released email login uses the inherited control plane. A custom QR API is source-compatible in this path, but the installed Android app has not been tested against Atlas.
6. [Session policy](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/apps/auth-api/src/server/session-policy.ts) keeps account/device/logical remote sessions until logout/revocation; numeric expiry is a compatibility value. One-use tickets have finite expiry. Engineering source review found OTP 10 minutes and pairing tickets 2 minutes in `auth-service.ts`; do not infer these are live Atlas settings.

The QR for installation and the ticket/link for pairing are different artifacts. No Android redistribution, identity change or sign-in to the original service is part of this work.

## Marketplace and egress evidence

| Trigger | Source | Dependency | Classification / action |
|---|---|---|---|
| Browse plugin connectors | `src/renderer/src/features/settings/marketplace-plugin-catalog.ts` | 252 static plugin entries at engineering inspection; provider MCP/OAuth | EXTERNAL_PROVIDER. Preserve valid provider endpoints and working connectors. Entry count is not 252 tested integrations. |
| List/download shared skills | [skill-marketplace-service.ts line 116](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/skill-marketplace-service.ts#L116) | Authorized `/v1/skills/` and related API routes | ATLAS target; session and stage catalog required. Direct public GitHub skill reads are a separate path. |
| List shared agents | [agent-marketplace-service.ts line 108](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/agent-marketplace-service.ts#L108) | Authorized `/v1/marketplace/agents/` | ATLAS target; local L0 identity alone is insufficient. |
| GitHub/social promotion | [app-handlers.ts line 66](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/main/ipc/app-handlers.ts#L66) | Upstream promotional repository/social/person URLs | BLOCK/REPLACE branding destinations. Visual PR #9 replaces these with Atlas home/repository; provider docs are separate. |
| Account login/pairing | `central-auth-manager.ts`, `application-services.ts` | Account API, owned mail, D1 session and signing keys | ATLAS. Preserve authorization; do not reuse original secrets. |
| Remote access | `remote/api`, `remote/coturn` | Signal, TURN, host identity and short-lived tickets | ATLAS target, not installed evidence. |
| Analytics | `application-services.ts:3695`, `packages/telemetry` | Packaged desktop gate disabled by existing Atlas logic | Source gate only; startup traffic capture still needed. Do not remove legitimate analytics product connectors merely by name. |
| App updates | `application-services.ts:4195`, `src/main/update-service.ts` | Requires `ATLASBOT_ENABLE_UPDATES=1` in existing Atlas gate | OPTIONAL; no approved public update feed. Provider CLI update endpoints are separate. |
| Model runtime/downloads | `src/backend/provider-drivers.ts`, provider release modules | OpenCode, Claude, Hermes and other selected providers | EXTERNAL_PROVIDER. Retain legitimate runtime/auth/download destinations pending evidence review. |

This table is a targeted source inventory, not the required full domain-by-domain egress capture. The older [SURFACE_AUDIT.md](../SURFACE_AUDIT.md) is a text-search index; a matched name alone is not a removal decision.

## OpenCode finding

[Provider driver line 1095](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/backend/provider-drivers.ts#L1095) explicitly supports free model discovery without a user credential. [OpenCode config line 148](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/c8c2510ccc3ae85786792c27b24b658630e21c4f/src/backend/opencode-config.ts#L148) keeps a stored paid key under `opencode-go`, leaving the free `opencode` provider without that stored key. This supports an intentional anonymous free-provider path in source. It does not prove that this user's PC has no saved session, that all listed models remain free, or that processing occurs locally. The clean-HOME benchmark script exists but was not run in this audit. Current provider limits, availability, actual endpoint/model and user-side credential isolation remain unverified.

## Official REA scope

Reviewed official repository: [morluto/rea](https://github.com/morluto/rea). Initial head was `f916b3ecf5455ffc80e300d8cf7eea144d02d61c`; execution is pinned instead to the published 6.9.0 tag commit `d74549e495c58eb4a560279fd9f05508401ea0a0`, confirmed through Git refs and release metadata. Reviewed dispatcher, package metadata, static application service, prepare behavior and [static workflow guide](https://github.com/morluto/rea/blob/d74549e495c58eb4a560279fd9f05508401ea0a0/docs/guides/javascript/javascript-artifact-reconstruction.md).

The audit lane requires npm `gitHead` to match that commit, disables lifecycle scripts and optional native dependencies, never installs target dependencies, clears the analysis environment and disables network access in a Linux namespace. It uses explicit paths from [REA-001-SOURCE-SELECTION.json](REA-001-SOURCE-SELECTION.json) against pinned main. Analysis is static and deliberately partial. All target source remains unchanged. Output, errors, package metadata and hashes are uploaded even on failure; [run status](REA-001-RUN-STATUS.json) records the observed outcome. No LLM/API credential is required for this static command. A provenance or runtime failure blocks execution and must be reported as such.
