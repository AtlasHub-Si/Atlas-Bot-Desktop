# AtlasBot — source licensing decision and upstream governance

**Source license:** MIT, see [root LICENSE](../../LICENSE).
**Decision:** 15 November 2026.
**Owner:** ATLAS GLOBAL TECH LTD (AtlasHub.SI).

## Legal authorization record

The project owner confirmed that the agreement with the original developers was **validated by the Atlas legal team**, and expressly authorized replacement of the product's inherited source license with MIT. This statement is recorded here as an owner decision; the private agreement and its signatories are not published in this repository.

The root source `LICENSE` is now MIT; root and workspace package license identifiers were updated. The original commercial-licence contact notice is no longer used to describe the AtlasBot product.

## What is still attributed

- OpenBot / Synthetify Labs retains its place in the technical source lineage and author-credit notice: [NOTICE](../../NOTICE).
- Third-party libraries, fonts, bundled components, artwork, models, and externally downloaded vendor runtimes retain their separate license notices where applicable. They are not automatically MIT because the root AtlasBot source is.
- The source Git history and original authorship are preserved, not rewritten.
- Product brand and design assets may carry separate intellectual-property permissions.

## Mandatory checks for future upstream updates

The owner's validation of the existing source transition does not, by itself, establish whether **future upstream commits from other contributors** fall within that agreement. Any upstream update needs a rights check of added files, new dependencies, artwork and authorship, as well as technical review.

Upstream intake must not auto-merge or deploy:
1. Identify exact upstream SHA and changes after the last reviewed baseline.
2. Review third-party rights, existing copyright and notices, package additions, and any sensitive files.
3. Exclude/translate original branded assets, analytics/telemetry, origin URLs, upstream API, licensing markers and auto-updater changes.
4. Preserve Atlas-specific API, D1/R2 bindings, Resend, local user profiles, protocols, brand imports, avatars and characters.
5. Run core and API typechecks, egress checks, Windows package tests, data migration backups and regression tests.
6. Integrate via a human-reviewed PR, never an automatic merge into production.

See [UPSTREAM_SYNC_POLICY.md](UPSTREAM_SYNC_POLICY.md) for the implementation plan and audit automation.

## Public release controls

An MIT source licence is **not** equivalent to a production-ready binary. Internal Windows canary artifacts are unsigned and require validation. The Atlas API staging is not yet a live audited login service. Final visual integration, security tests, attribution packaging, signing and release approval are independent gates.
