# AtlasBot — L0 Windows operator field test (2026-11-15)

**Evidence type:** operator-reported manual observations. CI results are separate. Do not classify all L0 criteria as PASS based on a single agent reply.

## Environment and build

- Windows x64; AtlasBot Windows L0 evaluation installer from GitHub Actions run `43686039374`, artifact `atlasbot-windows-l0-operational-15`
- Installer SHA-256 as published by CI: `587f3d8427ce9b8079a88d39f2655d88296ab1f4a652221a5b881c108a267a05` (operator-side hash match not independently confirmed)
- Installer unsigned; Windows displayed a warning and operator proceeded
- Installed GUI launched after setup

## Operator-observed results

| Check | Operator report | Finding |
| --- | --- | --- |
| Windows installer launches | Yes | **PASS reported** |
| First launch without Atlas cloud account | Yes | **PASS reported**: no longer blocked by `auth/network/ENOTFOUND` |
| First-run choices appear | Yes | **PASS reported**: start free or connect a provider |
| OpenCode free model choices appear | Yes | **PASS reported** |
| Create local named agent | Yes, agent `Big Boss` | **PASS reported** |
| Real model reply | Yes, model reportedly GLM/Z.ai | **PASS reported**: agent/provider path responds |
| Upstream legal links | `https://openbot.run/terms` and `https://openbot.run/privacy` | **FAIL**: inherited redirect on first-run screen |
| Agent product identity | Agent answered `Sou o Big Boss, um agente do OpenBot` | **FAIL**: inherited developer prompt identifies app incorrectly |
| Temporary workspace file creation | Not yet observed | **PENDING** |
| Agent data survives application restart | Not yet observed | **PENDING** |
| Filesystem permission boundaries and approval gates | Not yet observed | **PENDING** |
| Network egress inventory / no unexpected upstream connection | Not yet observed | **PENDING** |
| Atlas cloud login / Signal / Hermes | Not configured | **OUT OF L0 SCOPE** |

## Verified source causes

- `src/renderer/src/features/onboarding/FirstRunFlow.tsx` defined `TERMS_URL = "https://openbot.run/terms"` and `PRIVACY_URL = "https://openbot.run/privacy"`.
- `src/backend/agent/developer-instructions.ts` began both response-style prompts with `You are a persistent local OpenBot teammate.`. This was injected into the agent prompt, making the OpenBot self-description a code-level cause rather than merely the LLM's guess.
- Technical tool namespaces such as `openbot.*` remain in use and **must not be blindly renamed** before an IPC/MCP contract migration.
- The `Atlas-SI.com` website's existing locale privacy page describes its website, not the Desktop runtime; it must not be presented as the Desktop's verified privacy policy.

## Immediate regression fix branch

`fix/atlasbot-l0-identity-legal-20261115` is based on `test/atlasbot-local-operational-l0-20261115`:
- Inject the AtlasBot product/software-lineage/model-provider distinctions into developer instructions.
- Replace the two inherited response-style self-identification sentences.
- For the internal Canary, replace the original legal acceptance links with an explicit nonbinding evaluation disclosure.
- Revise Portuguese and English provider descriptions to distinguish a free model choice from offline inference.
- Add a static regression check. The changes are **not yet installed** on the user's machine.

## Next L0 operator acceptance (test data only)

1. **Save and restart:** quit AtlasBot entirely, relaunch, verify `Big Boss` and its conversation remain without signing into any external account.
2. **Scoped file task:** create `%USERPROFILE%\AtlasBot-L0-Test` and attach only that folder to the agent. Ask it to write `prova-l0.txt` containing only `AtlasBot L0 OK`. Verify content and timestamp manually. No real customer files or secrets.
3. **Least privilege:** attempt an action *outside* the permitted test workspace and verify it is blocked or requires approval. Do not approve system-wide access for this exercise.
4. **Provider transparency:** record chosen provider/model shown in Settings and distinguish local OpenCode runtime from model processing at Z.ai or another configured endpoint.
5. **Network and audit:** capture domain destinations in a controlled test. Allowed model-provider endpoints are separate from unexpected `*.openbot.run` calls. Review updates, telemetry, remote endpoints, consent and legal links before public release.

## Operational outcome

**Windows L0 — BASIC UI + FIRST AGENT RESPONSE: operator-reported PASS.**
**Windows L0 — FULL ACCEPTANCE: PENDING** restart/persistence, file task, permissions, egress, privacy/legal text and new identity regression validation.

No public AtlasBot release or website download should be activated on this evidence alone.
