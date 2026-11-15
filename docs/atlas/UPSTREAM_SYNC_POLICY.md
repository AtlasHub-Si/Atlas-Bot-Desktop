# AtlasBot — controlled upstream update policy

**Original repository:** https://github.com/nightly-labs/openbot
**Atlas repository:** https://github.com/AtlasHub-Si/Atlas-Bot-Desktop
**Default branch:** `main`
**Mode:** read-only surveillance and manually reviewed integration. **No automatic merge, deployment, update, or upstream installer.**

The Atlas repository is an upstream-related GitHub fork. Preserving a Git ancestry relationship makes source comparisons straightforward. The AtlasBot brand, cloud account API, profiles and agent/memory integration are Atlas-owned overlays.

## Update flow

1. **Observe:** the scheduled GitHub Actions `AtlasBot upstream radar` fetches the public upstream `main` in a disposable GitHub runner. It computes the last common commit, lists upstream-only commits and changed files, and produces an audit report. It never installs or executes upstream code.
2. **Triage:** classify changes as security, critical bug fix, platform/runtime, UX, model provider, mobile, commercial-hosting, licensing, or branding. The update engineer checks new contributor rights for commits not covered by the original agreement. **Current relicensing does not automatically grant rights over later upstream contributions.**
3. **Integrate:** create an isolated `intake/upstream-YYYYMMDD` branch from current Atlas `main`. Cherry-pick or adapt selected commits; full merges only after full conflict analysis. Keep a reviewed baseline SHA in the PR description and commit history.
4. **Protect Atlas overlays:** never overwrite AtlasBot characters/avatars, approved logo, templates, UI tokens, Cloudflare D1/R2 environment, Resend OTP, `api-test.atlas-si.com`, profile isolation, updater disabled default, Atlas Harness/Agent/Hermes, Atlas privacy or release ownership.
5. **Test:** native desktop/renderer/API/brand typechecks, migrations with backups, external-egress checks, Windows installer and executable-runtime checks, remote Signal/host flow, launch/rollback and user data integrity.
6. **Approve:** human reviewer must validate a successful PR into `main`. Then create an Atlas-owned release through the Atlas release pipeline. No GitHub automatic fork-sync and no `git push --force`.

## Merge conflicts and data migration

Treat `LICENSE`, `NOTICE`, `AGENTS.md`, `README.md`, `.github/`, `src/main/application-services.ts`, `src/main/index.ts`, `src/backend/agent-store.ts`, `electron-builder.yml`, `build/installer.nsh`, `apps/auth-api/`, `packages/brand/`, `src/renderer/`, and `apps/mobile/` as sensitive. A conflict is not resolved by choosing `--theirs` across the tree.

Upstream migrations are not applied directly to Atlas's staging/production D1; adapt, back up, dry run, and smoke test. Maintain old IPC and SQLite schemas until compatible migration tests pass.

## Git commands for a developer's isolated clone

```bash
git remote add upstream https://github.com/nightly-labs/openbot.git
git fetch --no-tags upstream main
git merge-base main upstream/main
git rev-list --left-right --count main...upstream/main
git log --no-merges --oneline main..upstream/main
```

If `upstream` already exists, use `git remote set-url upstream https://github.com/nightly-labs/openbot.git`. These commands observe revisions only; do **not** run `git merge upstream/main` on a branded branch without the intake review.

## Enforcement

- Scheduled radar: Monday at 08:00 UTC, plus manual `workflow_dispatch`.
- GitHub Actions tokens: `contents: read` only.
- Output: summary, JSON inventory, changed file list, upstream commit list and optional flags.
- Automated upstream integration into Atlas `main`: **disabled**.
- Future direct upstream agent instructions are not trusted simply because they appear in a fetched repository.
