# AtlasBot internal API staging — 2026-11-14

**Status:** source configuration and static CI checks prepared; no Atlas API Worker or public installer deployed by this change.

**Scope:** `AtlasHub-Si/Atlas-Bot-Desktop` only. This is a test environment, not a production migration or a grant of commercial source rights. Keep `LICENSE` and `NOTICE`.

## Verified Cloudflare resources

Cloudflare account: AtlasHub.SI (the `atlashub.digital@gmail.com` connection). Read-only inventory on 2026-11-14:

| Binding | Resource | Current state |
| --- | --- | --- |
| `DB` | D1 `atlasbot-auth-staging` (`321fd070-533d-4708-b108-af97f809e8d8`) | Exists; only internal `_cf_KV` table visible |
| `AVATARS` | R2 `atlasbot-avatars-staging` | Exists |
| `SKILLS` | R2 `atlasbot-skills-staging` | Exists |
| `SITES` | R2 `atlasbot-sites-staging` | Exists |

No AtlasBot Worker was returned by the Worker script list query. This is not proof that any API endpoint is live.

## Source configuration

`apps/auth-api/wrangler.jsonc` now has an independent `env.atlas-staging` with the resource names above. It intentionally has:

- No Cloudflare routes, workers.dev URL, or cron triggers.
- No billing, server provisioning, marketplace publishing, GitHub App, APNS or SMTP delivery.
- Loopback placeholders for the Signal and auth-events destinations, with no upstream OpenBot hosts.
- Its own ratelimit namespace IDs, isolated D1 and R2 bindings, and a named list of required secrets.

Run `node scripts/check-atlas-staging.mjs` for static safety assertions. The existing `atlasbot-check.yml` runs this check before its desktop build. This is **not** a live API test.

**Do not use** `bun run api:deploy` or `bun run api:deploy:test` for Atlas staging. They use inherited OpenBot production/test configurations, including encrypted environment files and upstream external services.

## Controlled activation sequence

1. Review the current source SHA, license, and all outstanding PRs. Preserve main, external channels, production secrets and the Helena perimeter.
2. Complete the source checks: `bun install --frozen-lockfile`, `node scripts/check-atlas-staging.mjs`, and the checks in `atlasbot-check.yml`.
3. Check the API build with `cd apps/auth-api && bun run build`. Verify the built Worker uses `atlas-staging` instead of a production or upstream configuration before deployment.
4. Review all D1 migrations in `apps/auth-api/migrations/` (55 numbered migrations at inspection time). Export a staging backup and obtain the migration/rollback plan. Review the output of `bunx wrangler d1 migrations list atlasbot-auth-staging --env atlas-staging --remote` before executing any migration. Apply only to `atlasbot-auth-staging`.
5. Provision the required Atlas-only secret values in Cloudflare. Never reuse the upstream OpenBot signing keys, webhook secrets, app identifiers, mail account or production credentials. Do not commit secret values.
6. Select and verify an Atlas-owned email transport. The inherited API uses SMTP/relay; a verified Resend domain alone does not mean OTP email delivery is configured.
7. Review workers.dev/route exposure and put authentication in front of test access (for example, Cloudflare Access). Only then enable a reachable staging endpoint. Do not make an anonymous public release of an inherited PolyForm Noncommercial build.
8. Check protected, isolated endpoints and egress with **test identities and test data only**; never enable real payments, paid-host creation, messaging integrations or customer data in this phase.

## Release test gates

- API schema migrations applied and verified; no production D1 or R2 resource is touched.
- Login OTP works with Atlas-owned delivery; session expiry and invalid-token rejection work; access is restricted.
- User and tenant isolation, rate limiting, secrets redaction, and route refusal tested.
- Desktop Windows to isolated Atlas VPS host; two test agents; delegation, restart and persistence; Hermes ACP integration.
- Original channels and standby services remain unchanged.
- Source license reviewed; no public/commercial installer until the distribution and commercial rights are resolved.

## Outstanding dependencies

The original `remote/compose.yaml` still describes upstream Signal/TURN services and host-level port bindings. Helena must qualify a separate, nonconflicting Atlas-LAB layout before remote deployment. Keep legacy runtime IDs, SQLite database names and IPC schemes stable until a deliberate, reversible migration has been tested.

The final brand icons and the open design PR are independent of this staging change. Do not ship inherited temporary icons as approved Atlas artwork.
