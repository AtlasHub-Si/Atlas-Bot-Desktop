# AtlasBot API Fast-Track — 2026-11-15

Status: source integration and CI implementation. No live API, mail, Signal, TURN, Android, or desktop remote test is claimed.

## Source and scope

Base: main c8c2510ccc3ae85786792c27b24b658630e21c4f. This branch ports only API staging files from PR #3 (1e735964697966e881469844ea3a9812a3138309), retains the current MIT license, NOTICE, and MIT CI guard, and adds local workerd HTTP checks. It does not merge an external source branch or change PR #2.

Surfaces: apps/auth-api, a local-only CI script, CI configuration, and this report. No Electron storage, mobile contracts, connector OAuth, or runtime identifiers change. The packaged default still uses api.openbot.run unless OPENBOT_AUTH_API_URL is set in an isolated test launch. Do not change the functional local instance.

## Authentication finding

The exact Portuguese message “É necessário entrar.” is error.auth.signInRequired. CentralAuthManager's authorized-request guard raises it when its session token is absent, before HTTP. It does not by itself prove an API outage.

Existing code already provides email OTP, persistent sessions, registered hosts, mobile devices, temporary pairing, permanent links, ES256 remote tickets and revocation. Reuse these services. Account/device sessions deliberately persist until logout or revocation; OTP is 10 minutes and pairing is 2 minutes.

The mobile QR is openbot://mobile-connect with api, ticket, host and fingerprint. It differs from a Play Store installation QR. Mobile QR redemption uses its API field, while the released mobile email-sign-in default stays pinned to the original account origin. Preserve the released protocol. A real Android test and a separate Atlas mobile identity/release review remain required.

## Isolated source configuration

atlas-staging binds only D1 atlasbot-auth-staging (321fd070-533d-4708-b108-af97f809e8d8) and R2 atlasbot-{avatars,skills,sites}-staging. Public routes, workers.dev, cron, inherited mail service bindings, hosted provisioning, site publishing, GitHub App and push are disabled. Signal and auth-event destinations remain loopback placeholders. No production DNS change is included.

Resend OTP is selected only when RESEND_API_KEY exists and EMAIL_FROM belongs to atlas-si.com. No SMTP credential is copied. Required keys must be stored in the Atlas staging secret store, never source or logs. The current Resend adapter preserves code validation, maps rate limits, bounds delivery time and does not log response bodies.

## Local Worker evidence

CI builds with CLOUDFLARE_ENV=atlas-staging, checks the generated binding destinations, then uses wrangler dev --local over a fresh temporary D1 state. All 56 source SQL migrations are applied through Wrangler. The local-only runner cannot run outside a disposable GitHub Actions job. It creates no cloud resource, takes no production credentials and changes no saved environment.

Remote staging AUTH_EXPOSE_DEVELOPMENT_CODE remains false. Only the disposable local generated config enables development-code responses, with no mail transport, so the test sends no email. Generated codes, tokens, private state and Worker output are not retained in the report or forwarded to CI logs. The generated config and database are removed after the run.

The HTTP flow checks anonymous denial, OTP verification, host registration, wrong fingerprint refusal, pairing, replay refusal, account isolation, device listing, Worker restart persistence, phone revocation, persistent link creation/revocation, and logout. The report names each assertion and its result. A successful local Worker check is not a live Resend, Signal/TURN, Electron or Android acceptance test.

## Migration review and remote gate

There are 56 SQL files, not 55: two use the 0034 prefix. Apply the full ordered filename list. Do not renumber or skip the account-attribution or server-claims migration.

All files were read for this change. The chain includes rename/drop-and-copy steps in 0003, 0008, 0035 and 0054, index/trigger replacement in 0006 and 0018, and updates to existing membership, invitation and billing records. This is safe to rehearse only against a fresh disposable database. It is not permission to apply the chain to a database with unknown history.

Before remote migration: confirm the Atlas account and exact staging database ID, export a recoverable backup, inspect sqlite_master and d1_migrations, compare the full filename list and schema, and rehearse restore. Apply only pending migrations to that verified staging database. Never run inherited api:deploy, api:deploy:test, or root remote migrations against the original account.

As reported by the root task's fresh Cloudflare inventory: AtlasHub account 51b1aab5e657d8822c8c882c026b879c has the staging D1, three Atlas R2 buckets and no deployed Workers. Remote schema migration, mail and signing secrets, endpoint access policy, Signal/TURN and VPS inventory are outstanding; this source change does not claim to resolve them.

## Activation prerequisites

1. Pass API typecheck, isolated build and local HTTP checks on this exact head.
2. Verify remote migration backup, pending list, restore and isolated database bindings.
3. Provision scoped RESEND_API_KEY, independent ES256 signing keys/JWKS, remote auth webhook secret, skill admin token and site report hash secret. Do not reuse upstream credentials.
4. Use a restricted Atlas staging endpoint whose ownership and access policy are verified. Browser-only Access redirects must not silently break native API clients; do not embed service tokens in distributed clients.
5. Test real Atlas OTP and session/device revocation with disposable identities. Keep development-code exposure disabled.
6. Inventory the VPS before isolated Signal/TURN activation; preserve Hermes, GBrain and existing services. Verify WSS, JWKS, signed auth-event revocation and TURN allocations.
7. Launch a separate desktop test profile against the verified API, then test Android QR pairing, restart and revocation.
8. Keep public installer/download publication and updater enablement outside this PR.

## Rollback

Before activation, revert this source commit/close this PR; the current app and cloud services are unchanged. After any future staging migration, do not infer rollback by deleting tables: use the verified backup/restore procedure. Keep the functional local profile intact.
