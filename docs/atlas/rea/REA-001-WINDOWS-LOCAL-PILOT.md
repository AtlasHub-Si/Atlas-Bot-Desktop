# REA-001 — Windows local pilot

**Date:** 2026-11-15 (America/Sao_Paulo). **Baseline:** `c8c2510ccc3ae85786792c27b24b658630e21c4f`. Source inventory only unless another evidence type is named. No screen capture or installed-app test was performed by this report.

## Existing evidence to reuse

[Windows L0 workflow 43686039374](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/actions/runs/43686039374) completed successfully at `52857b231ecbde2cd2863a26c8ddc20e55f328f9`. The workflow has separate Windows packaging and Linux fake-agent jobs. Read the [acceptance protocol](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/52857b231ecbde2cd2863a26c8ddc20e55f328f9/docs/atlas/L0_WINDOWS_ACCEPTANCE.md) and [operator field report](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/blob/233b12c630c041d7621bbdd825ef2031d59cbb60/docs/atlas/L0_WINDOWS_FIELD_REPORT_2026-11-15.md).

| Evidence | Result | Limit |
|---|---|---|
| Windows typecheck, local-only auth guard, NSIS and unpacked-package inspection | CI PASS | Does not prove installed GUI, runtime permissions or real model reply. |
| Linux fake ACP/provider tests | CI PASS | Unix fake executables, not Windows native/provider/model tests. |
| Installed GUI and local first agent/model reply | Operator-reported PASS | No independent full acceptance or network capture. |
| Internal installer artifact | Available at checkpoint | Artifact ID `14150661582`, `atlasbot-windows-l0-operational-15`, 235320936 bytes. Retention is finite. |
| Installer hash recorded by CI | `587f3d8427ce9b8079a88d39f2655d88296ab1f4a652221a5b881c108a267a05` | Operator-side hash match was not independently confirmed. |
| Restart persistence, scoped file task, permission limits, egress | PENDING | Must not be inferred from a model reply. |
| New identity and approved icons on installed Windows | PENDING at audit checkpoint | PR #8 identity and PR #9 visual build are separate from installed acceptance. |

No installer was downloaded, installed, replaced or executed by this report. The existing functional local instance remains the user's current working instance.

## Safe next acceptance

Use a disposable Windows account/VM and a separate empty installation/profile, retaining the existing working installation. Obtain the new internal artifact only after its CI passes; verify its own SHA-256 rather than reusing the older hash above.

1. Record source SHA, workflow/artifact ID, installer hash, Windows version and display scaling.
2. Check first-run branding, main-window/taskbar/tray/shortcut and notification identity. Capture actual screens. Keep screenshots in review artifacts, not source control.
3. Create one test agent with a disposable test directory. Verify the displayed application identity and selected provider/model.
4. Complete one scoped file task. Restart and confirm agent, conversation and file persistence.
5. Check denial/approval outside the permitted test directory without approving unrestricted access. Record observed behavior, not assumed policy.
6. Capture startup/task traffic and classify account, model-provider, downloads, updates, telemetry and catalog destinations. Do not supply original-service credentials to satisfy a blocked Atlas feature.
7. Test Atlas cloud login and pairing separately only after the API is functional. The local Canary identity has no remote session token.

Rollback means closing/uninstalling only the newly created test instance after saving its report. Do not delete the old app, its profile, workspace, data or processes. No migration, app-ID change or upgrade of user data is authorized by this audit.

## Official REA execution

The CI lane `.github/workflows/atlasbot-rea-static.yml` analyzes selected source bytes at pinned main in an ephemeral Linux runner. This is a different test from Windows installed runtime inspection. It emits package provenance, target tree/hash manifest, source selection, JSON/static Evidence and stderr. [REA-001-RUN-STATUS.json](REA-001-RUN-STATUS.json) is the authoritative recorded run checkpoint.

The environment in this session cannot resolve shell network DNS; no local clone/install is claimed. GitHub connectors remain functional. A scoped CI runner is used for static analysis, without application dependencies, credentials or application execution. A tool/runtime failure is kept as failure evidence, not relabelled as a completed audit.
