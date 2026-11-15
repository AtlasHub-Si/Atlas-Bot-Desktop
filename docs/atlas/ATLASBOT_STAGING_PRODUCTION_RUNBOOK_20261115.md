# AtlasBot — staged production activation runbook (2026-11-15)

## Current verified state

- GitHub main includes PR #7 (Windows local-only Canary), PR #10 (Atlas API source and CI), and PR #11 (REA evidence).
- API local Worker CI passed 32/32 checks and all 56 SQL migrations on disposable D1; this is not live-API acceptance.
- Cloudflare AtlasHub account: `51b1aab5e657d8822c8c882c026b879c`.
- D1 `atlasbot-auth-staging`: `321fd070-533d-4708-b108-af97f809e8d8`.
- At inspection, remote D1 contained only Cloudflare's `_cf_KV` table, no application or `d1_migrations` tables.
- A remote SQL export of this empty baseline was generated on 2026-11-15; confirm a recoverable, durable backup and restore rehearsal before data-bearing migrations.
- R2: `atlasbot-avatars-staging`, `atlasbot-skills-staging`, `atlasbot-sites-staging`.
- No Atlas auth Worker appeared in Cloudflare's Worker list at inspection.
- Resend sending domain `atlas-si.com` verified in `sa-east-1`; this does not prove a scoped Resend API key has been provisioned.
- Website V2 already serves production while public AtlasBot downloads deliberately return HTTP 503, pending signed release approval.

## Release model

Use only `.github/workflows/atlasbot-auth-staging.yml` for this Atlas environment. Do not invoke inherited generic production scripts `api:deploy`, `api:deploy:test`, `api:migrate:remote`, or upstream `preview/test` environments.

Run `workflow_dispatch` with `execution=plan` first. It has no remote credentials and executes isolated staging source checks, build and local workerd session/device lifecycle. The `execution=apply` job requires the `main` branch, green preflight, GitHub environment `atlasbot-auth-staging` and `ATLASBOT_CF_STAGING_DEPLOY_TOKEN` stored as a protected Actions secret. The scoped token needs only the correct Atlas account's Worker Scripts and D1 deployment/migration rights. Do not paste it in issues, logs or this document.

Before `apply`, the operator must verify exact Cloudflare account ownership, database snapshot and restoration, existing schema and migration history, and whether `d1_migrations` is absent or already populated. All 56 migrations must be applied in filename order; note both files prefixed `0034`. Wrangler remote migrations create a backup; use that workflow instead of ad hoc SQL scripts that bypass migration tracking.

Verify the Worker can hold the following own, persistent secrets, scoped to staging only:
- `RESEND_API_KEY` (domain-scoped, sending-only if supported by provider)
- `REMOTE_TICKET_PRIVATE_JWK`, `REMOTE_TICKET_PUBLIC_JWKS` (independent ES256 pair)
- `REMOTE_AUTH_WEBHOOK_SECRET`
- `SKILLS_ADMIN_TOKEN`
- `SITE_REPORT_HASH_SECRET`

`REMOTE_TICKET_KEY_ID` must match the active public JWKS key; no private JWK belongs in git. The Worker must have `AUTH_EXPOSE_DEVELOPMENT_CODE=false`, `HOSTED_SERVERS_ENABLED=false`, empty schedules, no inherited SMTP services, no routes, and `workers_dev=false` during isolated stage bootstrapping.

## Mandatory staged acceptance

1. Verify Cloudflare environment names and D1/R2 IDs, and obtain a durable backup with a tested restore route.
2. Run preflight; reject any failed source, identity or local-Worker check.
3. Provision independent long-lived staging secrets without exposing values to build jobs or reports. Use official Resend sender `no-reply@atlas-si.com` after confirming sending permissions.
4. Run isolated database migrations with Wrangler, record pending/applied filenames and count, and inspect table/index integrity.
5. Deploy Worker with no public routing. Read back Worker name, binding metadata, version and account identity; avoid exposing secrets.
6. Configure a restricted, owned test endpoint **only after** Access/client authorization policies are validated; native desktop clients must not be broken by browser-only redirects. Do not publish a public login endpoint simply to make QA easier.
7. Perform real email OTP, rate-limit, account isolation, restart persistence, device register/revoke, ticket expiry/replay, signed host ticket and logout tests using disposable Atlas accounts. No development-code response remotely.
8. Inventory a separate VPS, preserve Hermes/GBrain and existing containers, and provision isolated Atlas Signal/TURN only after HTTPS/WSS/TURN and revocation tests.
9. Test a separate Atlas Desktop profile with signed-in account and Android pairing. A Play Store installation QR is not a pairing QR. The original released Android app is not a licensed Atlas mobile release.
10. Capture startup/provider/catalog/update/remote egress; complete security/privacy and legal signoff, Windows UI persistence and permission tests.
11. Generate stable signed Windows installer(s) and a vetted release manifest: tag, asset ID, filename, SHA-256, signing identity, updater policy and rollback; only then enable approved-only website download routes.
12. Run multi-platform QA and publish Android/iOS via independently controlled app store accounts and licensed assets; current Google Play upstream app is not an Atlas release.

## Stop / rollback

- Failing preflight, wrong account, unapproved migration, unexpected external origins, missing owned credentials, or unverified client authorization all stop deployment.
- Stage deploy is deliberately unrouted; remove its routes/disable endpoints if client/access policy fails.
- Never drop remote tables to roll back migrations. Restore a verified backup.
- Preserve functional Windows L0 profile, original external-app profiles, the Atlas-SI website and existing third-party connectors.
- No claim of "production complete" until all required signed desktop, API live auth, remote and mobile tests have actual recorded evidence.
