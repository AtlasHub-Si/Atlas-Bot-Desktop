# AtlasBot V0.1 — Deployment topology and test release plan

**Decision — 2026-11-14:** Keep the existing Electron / SolidJS project and its current runtime. Do not rebase onto another desktop project. Prepare Atlas-owned staging services without touching the legacy Hermes, customer systems, or production DNS. This document describes a **target** deployment; it is not a claim of live service.

## Source of truth

- Repository: `AtlasHub-Si/Atlas-Bot-Desktop` (desktop, local host, remote services, auth API, build configuration).
- Architecture and governance: `AtlasHub-Si/Atlas-Harness`.
- Brand: `AtlasHub-Si/atlas-brand-system` (approved masters only).
- Development branch for staging: `feat/atlasbot-api-staging-isolation-20261114`; do not merge without checks and review.
- Keep existing `LICENSE`, `NOTICE`, wire protocols, local database and updater compatibility. **A new name is not a commercial licence.**

## Runtime placement

| Responsibility | Current source | Phase 01 host | Important constraints |
|---|---|---|---|
| Windows/macOS/Linux Desktop | `src/renderer`, `src/main`, `electron-builder.yml` | User computer | Installer is rebuilt from this fork; existing upstream binary is not an Atlas release |
| Local persistent agent host | `src/main`, runtime resources | User computer or AtlasHub lab host | Agent workspace and SQLite stay with the host, not in Cloudflare D1 |
| Identity and account control plane | `apps/auth-api` | Cloudflare Workers + Atlas D1/R2 | OTP, signed session/tickets, memberships; Atlas-owned secrets only |
| Remote signalling | `remote/api` | Isolated AtlasHub VPS Docker stack | Signal handles connection setup; no business data DB in Signal |
| TURN/WebRTC relay | `remote/coturn`, `remote/compose.yaml` | Isolated AtlasHub VPS | UDP/TCP/TLS network design; do not assume Caddy handles TURN |
| Hermes execution | `AtlasHub-Si/Atlas-Agent` | Separate new Hermes runtime in AtlasHub LAB | ACP profile, scoped access, no legacy secrets/mounts |
| Business system connectors | Atlas Harness contracts | Only after scoped integration tests | CRM, ARO, ClubOS and GWD remain preserved |
| Corporate website and product page | Independently maintained Atlas web surfaces | Existing site host | `bot.atlas-si.com` is product website/download **target**, not the agent backend |
| Future scale-out | deployment/IaC TBD | AWS EC2/ECS etc. after budget and licence approval | AWS is optional for first LAB pilot, not a prerequisite |

### Candidate DNS names — proposals, not provisioned

- `bot.atlas-si.com`: product information and, **once rights permit**, authorized downloads.
- `api-test.atlas-si.com`: Atlas authentication API with access policy, after schema/secret/OTP tests.
- `signal-test.atlas-si.com`: WSS signaling endpoint on Atlas-LAB VPS.
- `turn-test.atlas-si.com`: coturn endpoint, with appropriate UDP/TCP routing and certificates.

Do not attach a public DNS route before the corresponding service passes security and health checks. Do not embed long-lived Cloudflare Access service tokens in a distributed desktop client.

## Activation order — do not skip gates

### A. Preserve and prepare — Helena

1. Record VPS memory/disk/swap, open ports, active containers, DNS ownership and volumes; capture recoverable backups.
2. Isolate a new AtlasBot host, a distinct Hermes instance, network, volumes and credentials. Keep original Hermes/Helena and all customer systems untouched.
3. Review `remote/compose.yaml` rather than running its current upstream-oriented `remote:up` command against the live host. Plan Signal, coturn, TLS, egress, health checks and rollback.
4. Reserve resources for Electron Linux host and its graphics/computer-use requirements; test the host's actual runtime conditions before capacity promises.

### B. Auth API — API engineering

1. Review PR #3 and its successful CI. Use the `atlas-staging` Wrangler environment, **never** `api:deploy` or `api:deploy:test` for Atlas staging.
2. Existing Cloudflare assets from inspection: D1 `atlasbot-auth-staging` and R2 `atlasbot-{avatars,skills,sites}-staging`.
3. Review all SQL migrations, stage a backup and a rollback rehearsal. The inspected D1 had only the internal `_cf_KV` table; schema initialization remains outstanding.
4. Generate independent signing keys and webhook secrets. Configure Atlas mail for OTP (Resend `atlas-si.com` is verified, but API transport integration is not yet established).
5. Inspect the Worker build with `CLOUDFLARE_ENV=atlas-staging`; allowlist and protect the test endpoint, verify sign-in, session expiry, tickets, role denial, rate limits and egress.
6. Only when API and remote connectivity are both ready, replace loopback placeholder Signal URL and webhook URL with Atlas-owned stage hosts. Confirm WSS/JWKS round trip.

### C. Branding and desktop — GPTWORK

1. Finish design PR #2 with approved assets and inspect `electron-builder.yml` for legacy appId, icons, desktop IDs, installer metadata, protocol name, vendor signature and updater paths.
2. Preserve local storage paths and protocol identifiers until a tested migration is available. Do not mass-rename `@openbot/*` packages or SQLite databases merely for branding.
3. Execute CI typecheck/build and relevant Electron security tests. Verify the actual installer against a clean Windows VM.
4. Native installer generation exists: `bun run dist:win`, `bun run dist:mac`, `bun run dist:linux`; these require platform-specific bundled runtimes, icons, signing and QA. A Vite/Electron build alone is not an installer.
5. Keep update publishing disabled until signed Atlas release manifests, rollback and legal distribution rights are approved.

### D. End-to-end acceptance

- Authorized user accesses isolated Atlas API and signs in through Atlas-owned OTP.
- Desktop Windows connects to Atlas-owned VPS host through Signal/TURN as needed.
- Two disposable test agents work with separate profiles; one delegates a read-only task to another through the approved Hermes runtime.
- A restart preserves sessions, workspaces and task continuity.
- Scope denial, attempted external action, secrets handling, logs and rollback are tested.
- Protected Helena/Hermes legacy services are health-checked and unchanged.
- No Atlas installer is distributed to third parties or used commercially without the applicable rights.

## Current blockers and ownership

| Blocker | Owner | Evidence needed |
|---|---|---|
| Final visual assets and installer identity | GPTWORK / brand | Approved asset masters and clean Windows package screenshots |
| API schema, session secrets and OTP transport | API engineering | D1 migration report and protected OTP/login E2E |
| VPS isolation, Signal/TURN and Hermes ACP | Helena + runtime engineering | Resource inventory, container smoke tests, read-only delegation |
| Commercial-source usage and distribution | Legal/product owner | Written rights analysis/licence grant if required |
| AWS choice | Infra/finance | Budget, IAM, baseline benchmark and approved cutover decision |

**Operational principle:** GitHub stores versioned source and release metadata. Cloudflare stores account control-plane state. The Desktop/Linux host stores actual agent workspaces and SQLite. The VPS (or later AWS) keeps persistent runtime and remote signalling. None of these alone is the entire backend.
