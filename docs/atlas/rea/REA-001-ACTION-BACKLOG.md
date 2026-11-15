# REA-001 — Action backlog

**Date:** 2026-11-15 (America/Sao_Paulo). **Baseline:** `c8c2510ccc3ae85786792c27b24b658630e21c4f`. Source inventory only unless another evidence type is named. No screen capture or installed-app test was performed by this report.

## Ordered work

| Priority | Action | Owner | State and acceptance |
|---|---|---|---|
| P0 | Finish approved icon quick fix and internal artifact | Desktop / brand engineering | PR #9 isolated; require verified asset hashes, focused checks, Windows package build and real visual acceptance. Preserve functional install and identifiers. |
| P0 | Record official REA static run | Audit engineering | This branch provides pinned read-only lane. Require provenance check, exit status, output/error artifact and limitations. Static partial output does not close full REA mission. |
| P0 | Resolve API source conflict incrementally | API engineering | PR #3 draft; revalidate against current MIT main without upstream auto-merge. Run stage config and API tests before any merge. |
| P0 | Initialize isolated stage control plane | API / infra | D1/R2 exist; no live Worker proven. Review migrations, stage backup/rollback, own signing and webhook secrets, owned OTP mail adapter and restricted test exposure. Do not use inherited production deploy scripts. |
| P0 | Prove real Atlas sessions | API / QA | OTP send/verify, restart persistence, logout/revoke, invalid/expired token, rate limit and tenant/device isolation through actual API. Local Canary identity is not acceptance. |
| P0 | Preserve working connectors | Desktop / marketplace | Keep provider MCP/OAuth, GitHub, runtime downloads and selected model endpoints. Replace only verified promotional branding destinations. |
| P1 | Device and pairing E2E | API / mobile / desktop | Temporary ticket single-use/expiry, persistent-link rotation/revoke, device list/revoke, unauthorized denial. QR API path source-compatible; installed Android release test still required. |
| P1 | Isolate Atlas Signal/TURN | Infra / remote | Inventory VPS resources/ports/containers first; own secrets, health/TLS/WSS, TURN routing and rollback. Preserve Helena/Hermes and existing services. |
| P1 | Full Windows L0 acceptance | Desktop QA | Installer hash, actual icon screens, provider identity, scoped task, restart/persistence, permissions and traffic capture. Reuse existing build evidence; do not recreate unneeded base app. |
| P1 | Complete visual state inventory | Desktop / design QA | Enumerate each screen and empty/loading/error/success state; map approved assets, dark/light, dimensions, alt text, reduced motion and screenshot. Preserve custom avatars. |
| P1 | Atlas marketplace initial catalog | Marketplace / API | Use existing contracts/routes and separate curated read-only seed content first. Review contributor rights, asset hashes, versions and R2 objects. Test browsing/install/update/uninstall without altering working connectors. No public publishing enabled by this audit. |
| P1 | Full egress audit | Security / runtime QA | Capture first boot, login, provider turn, catalog, update, links and remote flows. Record domain, source line, trigger, data, auth and classification; unknown remains unknown. |
| P1 | Clean OpenCode credential test | Provider engineering | Review existing clean-HOME benchmark, then one bounded test in a disposable profile if needed. Record selected model/provider/endpoint, key/session absence and returned limits. No broad paid benchmark or claim that free means offline. |
| P2 | Web pilot at bot.atlas-si.com | Product / infra | Inventory existing deployment and ownership first. Prove restricted new environment before cutover; no production DNS or service migration in this branch. |
| P2 | Hermes/Atlas-Agent/Workforce links | Runtime engineering | Validate scoped ACP integration on isolated host after L0/L1; no copied credentials or legacy mounts. Keep GBrain/memory ownership intact. |
| P2 | Public release homologation | Release / QA | Stable artifact, signatures, rights/attributions, package QA, egress, update/rollback and explicit approved-release record. Internal Canary must remain excluded from website downloads. |

## API / local / VPS matrix

| Feature | Works locally | Needs account API | Needs remote host / Signal / TURN |
|---|---|---|---|
| Canary workspace and local agent | Operator reports basic success | No cloud token for L0 | No for same-computer operation |
| Selected model turn | Provider-dependent | No Atlas account necessarily; provider auth may apply | Provider endpoint/runtime may be external |
| Plugin connectors | Connector-dependent; GitHub reported working | Not equivalent to shared catalog auth | Provider MCP/OAuth varies |
| Shared agent/skill catalog | API-backed list unavailable without session | Yes under existing routes | No Signal needed for catalog list |
| Generate mobile pairing credentials | No valid cloud credential in L0 | Yes | Host binding required; later connection needs remote services |
| Remote mobile session | Not verified | Yes | Yes; topology-dependent relay |
| Hermes/Workforce integration | Planned/independent development | Scope-dependent | Isolated runtime required for the proposed VPS pilot |

## Closure rules

Complete only items with direct evidence. A successful build is not a running service. A local agent reply is not full L0 acceptance. A static REA graph is not runtime traffic proof. A Google Play listing is not Atlas redistribution permission. The website's existing production authorization does not authorize API/DNS changes outside its own scope.
