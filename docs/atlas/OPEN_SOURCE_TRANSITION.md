# AtlasBot — Open-source transition gate (MIT proposal)

**Status:** Preparation only. This document does not replace `LICENSE`, `NOTICE`, or a signed agreement.
**Owner:** ATLAS GLOBAL TECH LTD.
**Decision recorded:** 2026-11-15 — project owner reports an agreement with the original developers and requests an AtlasBot open-source license.

## Proposed license

Use the **MIT License** for a future unified AtlasBot source distribution **only after the agreement is reviewed** and confirms the rights needed for this transition. See [MIT candidate](MIT_LICENSE_CANDIDATE.md).

An agreement that permits commercial use or modification does **not necessarily** authorize relicensing or sublicensing third-party code under MIT. A copyright holder may also require an attribution or copyright notice even when relicensing is permitted.

## Evidence to verify privately (not in the public repository)

1. The rights holder(s) that signed the agreement and whether they hold or can grant rights to the inherited code.
2. The agreement date, license or assignment identifier, signed copy and covered OpenBot versions/commits.
3. Permission to modify, reproduce, distribute, make derivative works, sell and offer hosted services.
4. **Explicit permission to relicense or sublicense the covered source under MIT** to third parties, including commercial use, redistribution and downstream sublicensing.
5. Whether the rights holder waives the original mandatory license text and notices, or requires specific acknowledgement in a `NOTICE` or `CREDITS` file.
6. Third-party components, contributed code, fonts, icon libraries, dependencies, patents, artwork, model/runtime provider licenses and registered trademarks outside the grant.
7. Whether the rights apply to ATLAS GLOBAL TECH LTD, the repository organization, distributors, and downstream open-source users.

Do not commit the agreement or personal signatures to this public project. Record its internal reference and a legal reviewer decision only.

## Required implementation after evidence is approved

- Create a verified rights and third-party attribution inventory. Keep third-party notices that are still required.
- Replace the root `LICENSE` with MIT (and align package manifests and machine-readable SPDX references) only for code within the verified rights scope.
- Update `NOTICE`, `LEGAL.md`, `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, docs, generated build notices and web copy as needed. Remove outdated PolyForm wording **only when the relevant source rights have been cleared**.
- Preserve accurate provenance and Git history. Do not claim the code was authored from scratch, even if a new license is permitted.
- Do not strip third-party notices from bundled files or binaries solely for branding.
- Run CI, license dependency scan, offline package inspection, installer notice check, and release review.
- Unblock a public MIT release only after legal, security, visual and API/egress gates pass.

## Release-state distinction

- **Internal Windows canary:** packaged for evaluation; build success is not an approved public/commercial release.
- **Atlas authentication stage:** source code builds, but live database, secrets, HTTP route and end-to-end sign-in are not confirmed.
- **MIT AtlasBot release:** proposed and not in effect for the inherited source at the time of this document.

The repository root's existing license remains authoritative for the inherited source until the transition is properly completed.
