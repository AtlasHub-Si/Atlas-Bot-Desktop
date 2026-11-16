# AtlasBot — Public surface & egress hardening evidence (2026-11-16)

**Scope:** `AtlasHub-Si/Atlas-Bot-Desktop`.  
**Status:** Draft PR #18, pending acceptance; **not** a production- or runtime-egress signoff.  
**Dependencies:** PR #16 for Atlas installer/releases guard and all-locale server/island labels.  
**Change policy:** No AWS, VPS, Cloudflare, provider keys, release publication, merge or external service call.

## What the implementation changes

| Surface | Previous state | Safe state proposed in PR #18 |
| --- | --- | --- |
| Desktop CSP | Allowed `analytics.openbot.run`, `wss://*.openbot.run` and `https://*.openbot.run` frames | Removes inherited origins; keeps explicit self-hosted Signal and required local/protocol surfaces |
| Host analytics | Fallback endpoint `https://analytics.openbot.run/api` | No fallback: only explicit approved Atlas HTTPS origins or local diagnostic loopback |
| Account API inherited footer | Original OpenBot product label, social icons and original repo/license links | AtlasBot identity; Atlas-owned GitHub only; origin profiles not promoted as Atlas accounts |
| Original legal/footer documents | Source terms/licensing, DPA/CLA and status presented as if Atlas-owned | Website-scoped legal/reference pages linked; unapproved sales/legal links removed from footer pending original Atlas policies |
| Inherited mobile apps | App Store/Play links to original operator packages | Mobile store offers disabled until Atlas-signed iOS/Android artifacts; inherited mobile download pages fail closed |
| Inherited SEO | `openbot.run`, PolyForm pricing/license, other company social profiles, original structured product and image data | Atlas corporate source/license/OG references; inherited marketing marked `noindex`, unapproved FAQ/application structured data omitted |
| Atlas legal attribution | Source/third-party copyright retained | Remains in `LICENSE` / `NOTICE` |

## Evidence and tests

- CI: `scripts/check-atlas-public-surfaces.mjs` is a static regression test, **not** a network firewall or runtime packet trace.
- Focused tests: `src/main/content-security-policy.test.ts` and `src/main/atlas-telemetry-url.test.ts` cover permitted self-hosted Signal, refusal of inherited domains and credential-bearing/invalid telemetry destinations.
- `scripts/atlas-legacy-sweep.mjs` from PR #16 inventories all tracked text and distinguishes URLs, public brand strings, provenance and compatibility names.
- General Desktop/Worker build and typechecks must pass on the final PR head. An earlier green run is **not evidence for later changes**.
- The institutional site `atlas-si-website` remains the authoritative Atlas public marketing and installer gate; this PR does not deploy or modify it.

## Explicitly unresolved / deliberately untouched

1. **Legacy marketing content:** `packages/i18n/src/messages/<locale>/sitePage.ts` still contains original operator copy, including older **noncommercial/PolyForm** language and promises for marketplace verification or hosted services. Do **not** globally replace names and republish those assertions. Restrict this inherited site to internal QA until editorial/legal rewrite or replace it with a redirect to the institutional Atlas-SI website.
2. **Hosted checkout:** `src/renderer/src/features/servers/AddServerOverlay.tsx` still references original operator terms in a historical billing flow. Its billing/service flags and the separate Atlas terms of service must be audited together. Do not activate hosted billing based on website privacy or the original operator’s terms.
3. **Other runtime telemetry:** the inherited browser, mobile, API, marketplace and provider adapters still contain old identifiers and endpoints; each must be analyzed with network capture and permission/tenant tests. The mobile app package `apps/mobile/app.json` is **not** an Atlas-signed store identity.
4. **Compat dependencies:** `@openbot/*`, `OPENBOT_*`, `openbot-*` URI schemes, Linux daemons, persisted paths and database migrations are *contracts*. Rename only through versioned migration + tests + rollback.
5. **Brand assets:** previous operator marketing imagery, icons and share cards still exist in source folders and must not be presented as final Atlas masters. The public Atlas-SI OG asset is referenced for inherited site metadata; graphic QA is still required.
6. **Actual remote service:** Account API, Signal/TURN, server claim, Hermes, Web/Desktop/mobile pairing and tenant isolation are not certified by the static changes.
7. **GitHub distribution:** PR #16 pins Atlas-only installers, but no approved signed Linux host build or public commercial installer exists yet. Website download must remain fail closed.

## Release gates

- [ ] CI green on the **final** commit of PR #18 (including protected staging checks).
- [ ] Review the visual behavior of the inherited API pages as **internal only**; verify no misleading availability/CTA.
- [ ] Run actual runtime egress capture by surface (Desktop, browser, API Worker, mobile) and classify any remaining vendor/integration destinations.
- [ ] Approve Atlas account Privacy Policy, Terms, telemetry retention and hosted/payout conditions before opening signup or checkout publicly.
- [ ] Verify a first-party signed installer and update chain on disposable Windows/Linux/macOS devices; protect customer data and original notices.
- [ ] Confirm environment tenant and IAM boundaries without relying on an unverified AWS connection.
- [ ] Owner GO for any merge/deploy/public release after evidence review.

**This audit is not an authorization to deploy or commercialize anything.**
