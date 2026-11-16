# AtlasBot — Renderer CSP and origin egress contract

**Date:** 2026-11-16  
**Status:** Code review / draft PR, not runtime certification.

## Risk addressed

The renderer Content Security Policy previously allowed:

- `https://analytics.openbot.run` in `connect-src`;
- `wss://*.openbot.run` in `connect-src`;
- `https://*.openbot.run` in `frame-src`.

These were direct original-operator origins, not product requirements for the new AtlasBot identity. The AtlasBot desktop should not permit them **by default**. Their removal does not rename internal compatibility protocols (`openbot-attachment:`, remote avatar/video schemes), which are local application contracts.

## New policy

- Renderer connections: local app + compatibility attachment schemes, loopback WebSocket, explicitly configured self-hosted Signal origin, and explicitly configured local development origins only.
- Renderer frames: local app / attachment and visual schemes plus local loopback viewer only.
- `readSelfHostedSignalOrigin()`: retains its existing strict `wss:` origin parsing and requires a configured auth API.
- No new Signal, TURN, Cloudflare, AWS, DNS or account service is provisioned by this change.
- No production deploy or public installer is authorized by this change.

## Validation

- `bunx vitest run src/main/content-security-policy.test.ts`: must verify denial of original operator origins for packaged and development modes, local loopback, self-hosted Signal and invalid URLs.
- Existing renderer/node checks, build and Atlas identity checks remain mandatory.
- Current tests are static/unit level. **Do not claim complete network isolation.** Process-level HTTP, providers, OAuth redirects, browser views, `img-src https:`, mobile and backend/Worker egress are outside this CSP.
- Confirm via a disposable canary network capture that an Atlas-only account/host can connect while unapproved original-operator requests are rejected. Preserve third-party provider OAuth/SDK flows.

## Follow-up blockers

1. Identify actual `https://analytics.openbot.run/api` references in `src/main/analytics.ts` and `src/renderer/src/analytics.ts`. Desktop production instrumentation is disabled by current gates, but the original fallback constants remain: replace or remove only after every invocation/consent path has an evidence-based audit.
2. Review `apps/auth-api/src/lib/landing-links.ts` and public social, documentation and release links. Do not repoint a third-party profile to an unverified Atlas account; hide unowned links.
3. Validate remote WebRTC host/Signal/TURN with Atlas-owned endpoints and ticket revocation. The CSP alone does not make remote access functional.
4. Do not re-enable hosted checkout until Atlas account terms/privacy and payment processing are approved.
