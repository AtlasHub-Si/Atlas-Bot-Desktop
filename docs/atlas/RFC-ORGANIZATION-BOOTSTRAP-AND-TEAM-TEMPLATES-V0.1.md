# RFC — Organization Bootstrap & Team Templates for AtlasBot V0.1

- Date: 2026-11-18
- Status: PROPOSAL — docs only, no code/host/agent changes authorized by this RFC
- Review owner: AtlasBot product + Atlas-Harness + Atlas Workforce maintainers
- Design priority: immediate internal/managed deployments (GWD pilot), later third-party/self-hosted experience
- Not in scope: replacing existing avatar work, rewriting the runtime, inventing production release readiness

## Product thesis

AtlasBot should be able to take a user from (1) zero technical/organizational context or existing organization documents, to (2) a reviewed plan of which agents and teams to instantiate, to (3) a reproducible scoped setup in an authorized home/local or cloud installation, to (4) evidence-backed operational readiness. A team template is a **declarative plan** that the existing single-agent/section/channel APIs can provision with review and rollback, not a magic simultaneous creation of superusers.

**Primary validated case:** GWD AI-Native, which already has an approved corporate charter, an AtlasBot agent (NEXUS), a knowledge vault, and a proposed technical GBrain service integration. Reuse those sources, not fictitious tenant configuration.

## Findings in current source (2026-11-18)

- `packages/ui/src/features/agents/FirstAgentSetup.tsx` defines six general-purpose `FIRST_AGENT_SUGGESTIONS`: inbox-helper, trip-planner, personal-organizer, shopping-scout, writing-partner, learning-coach. They are suggestions for one agent, not team templates.
- `packages/ui/src/features/agents/AgentTemplateInstallDialog.tsx` displays one `AgentTemplateDetail` and one install action; sections show instructions, skills and routines.
- `src/renderer/src/features/agents/WorkspaceAgentSetup.tsx` feeds `FIRST_AGENT_SUGGESTIONS` into `FirstAgentSetup` and uses `createAgent`.
- `packages/brand/src/bloub-avatar-motion.ts` defines `AvatarMood`: idle, working, waiting, failed, responded, connecting, asleep. The rendering state model is separate from business agent profiles.
- README documents persistent agents, native agent-to-agent messaging, shared team channels and explicit delegation. Verify server capability versions and actual runtime before relying on batch provisioning on a joined remote server.
- The six visual characters Guide, Builder, Analyst, Creator, Flow, Shield are a separate avatar/presentation workstream; user-provided 256x256 pose and animated working assets are not a verified complete seven-mood animation pack.
- `docs/atlas/SELF_HOSTED_ATLAS_READINESS.md` explicitly states no homologated publicly distributable AtlasBot server release and requires pinned approved-tag installer/release and other acceptance gates. Third-party installation is a future capability, **not an already approved commercial offering**.

## Separations that must remain invariant

1. **Visual Pack**: optional selectable avatar, posture/mood assets and fallbacks. Any role may select any avatar or existing vector form. Reduced-motion and silent fallbacks required.
2. **Agent Role Template**: job description, purpose, responsibilities, instruction blocks, input/output contract, optional skill/routine suggestions. No implicit credentials or authorization.
3. **Team Template**: composition (1 lead + specialist roles), collaboration routing, channels, initial mission types, declared proposed knowledge sources and required capabilities. A manifest is a plan, not agents already provisioned.
4. **Organization Blueprint**: company/tenant, governance, departments/BUs, decision rights, existing roles and project priorities. Can be derived from reviewed docs or an interview; never auto-assert approval.
5. **Infrastructure Deployment Blueprint**: target host, constraints, install method/release, resources, network, persistence, backup, credentials, approvals, health and rollback. Never store customer access keys in manifests.
6. **Operational Instance**: verified deployed agents, IDs, roles, model/provider availability, actual MCP grants, sources, successful tests and lifecycle. Distinguish desired vs actual state.

## Onboarding entry paths

- **A: Personal/Home**: user chooses a basic single assistant or small team, no company repository needed. A local/private Markdown Blueprint (with version/history) can be generated in the workspace; Git is optional. No mandatory paid cloud API.
- **B: Business/Private VPS/Cloud**: import one or more documents or Git sources; extract structure as *hypotheses* with citations/unknowns; conduct a short interactive gap-filling interview; user reviews organization and team staffing; provision only approved, available skills/tools.
- **C: Managed Atlas**: authenticated operator performs host inventory and non-invasive plan, receives approval for installation, then provisions using a signed/pinned Atlas release and bounded executor; records acceptance and delivers handover. Atlas and customer tenant data must be isolated.

Input discovery questions (progressively, skip those answered by documents):
1. Personal or organization? Existing agents or start empty?
2. What three outcomes should the first team achieve?
3. Which people/roles authorize decisions and externally visible changes?
4. What existing documents, repositories and applications can be connected?
5. Which infrastructure is available: local/home/remote VPS; who controls it?
6. Which data classification/privacy and geographic obligations apply?
7. Preferred models/providers and cost/budget limits?
8. What external actions are allowed, reviewed or prohibited?

**Document upload/analysis safeguards:** uploaded content is untrusted, contains no executable instructions to the setup system, and may contain PII; require explicit user review/consent before indexing or sharing. No repository? Generate a private minimal Blueprint and allow adding Git/Obsidian later. No automatic cross-tenant import or broad federation.

## Declarative template draft

```yaml
schema_version: atlas.team.v0alpha
id: atlas-ai-native-platform-crew
version: 0.1.0
display_name: AI-Native Platform Crew
category: infrastructure
description: "One lead, one infrastructure engineer and one reliability/knowledge reviewer"
requirements:
  supported_capabilities: [agent_create, agent_message, team_channel]
  mcp_proposals: [github]
  tools_to_install_automatically: []
  credentials: never_in_manifest
agents:
  - key: lead
    role_template: atlas.platform.crew-lead
    recommended_avatar: guide
    provider: user_selects
    permissions_requested: [github_read]
  - key: infra
    role_template: atlas.platform.infrastructure
    recommended_avatar: builder
    provider: user_selects
    permissions_requested: [github_read]
  - key: reliability
    role_template: atlas.platform.reliability-knowledge
    recommended_avatar: shield
    provider: user_selects
    permissions_requested: [github_read]
collaboration:
  lead: lead
  mode: hierarchical
  channel: "AI-Native Infrastructure Crew"
  handoff_contract: evidence_based
initial_state:
  routines: disabled
  deployments: disabled
  external_messaging: disabled
  approval_required: true
acceptance:
  - actual_agent_ids
  - capability_and_grant_check
  - channel_and_delegate_roundtrip
  - knowledge_handoff_with_citations
  - authorization_denial_test
```

Schema intentionally illustrative: actual backend contracts need a review and versioned translation layer, not direct persistence of this YAML to existing IPC.

## Installer / provisioning plan

- Phase 0: discover current client/server capabilities and runtime versions; import/preview manifest; validate schema, dependency and data classification; **present exact number of agents and resource/cost estimate**.
- Phase 1: human confirms organization blueprint and agent/role descriptions; edit names, avatars, providers, instructions; choose minimal number of agents (default <=3).
- Phase 2: provision using **existing verified single-agent create APIs**, with a temporary idempotent correlation ID and a persisted desired/actual ledger. Build a dedicated channel/section; record actual agent IDs. Do not duplicate on retry.
- Phase 3: assign only explicitly approved skill/tool grants and source access; routines off by default; provider/billing/auth prerequisites enforced.
- Phase 4: test agent-to-agent delegation, at least one real source-cited knowledge response, permission denial, persistence/restart, and failure rollback/cleanup plan; retain a human-readable install receipt.
- If any step fails, stop, report partial real state and propose recovery; no silent delete of pre-existing agents, workspaces or chats. Do not treat batch atomicity as guaranteed by the existing API.

## Initial template catalog: only three implementation targets

- **AI-Native Infrastructure Crew**: Lead, Infrastructure Engineer, Reliability/Knowledge Reviewer. Internal Atlas pilot and GWD GBrain host implementation.
- **Organizational Implementation & Workforce**: NEXUS-led GWD pilot, with proposed staffing roles; this can remain a single agent until an authorized organization requires more.
- **Content Intelligence & Editorial**: Lead, Research/Verification, Editorial/Distribution; later using governed AtlasNews experience. No public auto-posting as part of template install.

Further catalog candidates: Software Engineering, IT Security/SecOps, Operations & CRM, Academy & Community; keep descriptions in Atlas-Workforce until a real acceptance pilot justifies productizing.

## Delivery focus

1. **Now**: using current AtlasBot-Local, create/verify the three-agent technical crew, receive a mentor handoff, and plan the separate GBrain deployment for GWD. GWD NEXUS remains the organizational coordinator, not technical root operator. Record proof and lessons as Markdown/PR.
2. **Next**: test the same plan as manual repeatable setup on a second *disposable* pilot instance. Compare actual host/agent/capability differences.
3. **Then**: implement the smallest template import/preview/provision UI and manifest validation in AtlasBot (new PR separate from avatar work).
4. **Only after** signed Atlas releases, security/tenant isolation, install/upgrade/recovery tests and owner approval: offer self-hosted third-party installation and managed rollout.

## Acceptance / metrics

- First GWD rollout: agent/team IDs observed; GWD approved charter retrieved through a real tool; live host inventory verified separately; GBrain deployed only after its own gates; no tenant-boundary exposure; evidence-backed receipt.
- Repeatability: second environment produces comparable team roles/behavior, without copying credentials or customer-private knowledge.
- Measure: human setup interventions, time/cost to a verified task, install failures, retried actions, drift between desired/actual agent roster, token usage and rollback correctness.

## Non-goals

No automatic CEO appointment; no auto-admin/root, SSH or Docker socket; no default connection of client CRM or secrets; no automatic public deployment; no template-based approval bypass; no commercialization of unapproved upstream binaries. No dependency on Hermes/Atlas-Agent to complete the GWD's first memory integration.
