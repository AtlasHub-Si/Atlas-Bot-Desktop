# AtlasBot Account API — public landing origin links and footer

**Date:** 2026-11-16  
**Status:** draft, source/CI only; not deployed.  
**Affected:** `apps/auth-api/src/lib/landing-links.ts` and `apps/auth-api/src/components/landing/LandingFooter.tsx`.

## Problem found

The inherited SolidStart account-service landing source displayed the original product name, linked to original operator social accounts (X, Discord, Threads, etc.) and promoted the origin's repository, source releases, manuals and service status. The staging Account API is not the institutional Atlas-SI V2 website, but its pages may still be reachable through routes, previews or internal builds.

## Source-level changes

- Visible footer wordmark now reads **AtlasBot**.
- The footer social collection displays only the **Atlas-owned GitHub repository**, not unverified social accounts. Do not assign ownership to another company's X/Discord profiles or redirect social icons to unrelated pages.
- The original comparison catalogue is hidden from the footer while its original-operator editorial copy is reviewed. Routes and historical pages are **not** deleted by this PR.
- Footer external links pointing to `*.openbot.run`, `*.openbot.site` and the original `nightly-labs/openbot` repository are filtered out. Missing links remain hidden until ownership is documented.
- Canonical code, docs, licences, release source, self-hosting, Docker and troubleshooting URLs now resolve to `AtlasHub-Si/Atlas-Bot-Desktop`.
- Footer terms and privacy are linked to the scoped Atlas-SI website disclosures. **Those documents do not substitute for production AtlasBot account/service Terms, Privacy or DPA.**
- Unreviewed inherited DPA, CLA and commercial licence menu entries are hidden pending owner/legal decisions. The root AtlasBot code licence is MIT and upstream attribution remains in NOTICE.

## Deliberate non-changes

- The `OPENBOT_LINKS` variable identifier, internal `@openbot/*` package imports, provider callback URLs and protocol keys remain for compatibility.
- The original social constants may still be present for legacy code paths; this PR gates the **footer**, not every navigation component or route.
- Service status, production analytics, external link egress, marketplace and mobile pairing remain unverified.
- No staging/production Worker deployment, secrets, DNS, AWS, release or app-store changes.

## Acceptance

- [x] Source-level test `node scripts/check-atlas-public-links.mjs` added to AtlasBot check workflow.
- [ ] GitHub Actions success on this PR.
- [ ] Rendered browser accessibility/interaction QA for Footer and all supported locales.
- [ ] Static and runtime checks of other public/hosted auth-service surfaces.
- [ ] Atlas privacy/account terms and social ownership review before broad public access.

The public Atlas-SI website V2 is a separate release-gated project; do not use inherited Account API landing pages as replacement institutional content.
