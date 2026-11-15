# REA-001 — Visual and character matrix

**Date:** 2026-11-15 (America/Sao_Paulo). **Baseline:** `c8c2510ccc3ae85786792c27b24b658630e21c4f`. Source inventory only unless another evidence type is named. No screen capture or installed-app test was performed by this report.

## Approved source

[Desktop design PR #2](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/pull/2) records V0.7 as DEV_APPROVED. [Official V0.7 archive](https://drive.google.com/file/d/1vPg8qi02qOTU3UpUZut9PH0DEFcBse2c/view): SHA-256 `f23e9807bb7051d1dcaa23e7e20846390f9b223b68b5e090ab8827500fb1ef43`. The frozen dual master remains unchanged. An approved asset is not proof of integration at each entry point.

[Visual quick-fix PR #9](https://github.com/AtlasHub-Si/Atlas-Bot-Desktop/pull/9) is a separate branch on PR #8. Engineering checkpoint `dfb973da69f5f51796504ff873006645014ad474` contains 18 target paths from three verified derivatives; registry `build/atlasbot-approved-icons.json`. The official Drive ZIP was downloaded through the owner's authenticated session and matched the recorded archive hash. No local app replacement or Windows GUI acceptance is claimed.

| Approved derivative | SHA-256 | Applied targets |
|---|---|---|
| `03_icons_desktop/atlasbot-app-icon-512.png` (512 px) | `f60d3a1c7f8ef33a480324dcbe89743e952d6819eaad3de83f258029ea31707b` | Production/dev/preview PNGs and nine saved logo-color PNGs |
| `03_icons_desktop/atlasbot-app.ico` | `b3e5b42bc68fe6af3e8ca224738b66979d7b840fcc8c1c2b2ab773833720479a` | Three variant ICOs, `build/icon.ico`, renderer public favicon |
| `02_favicons_web/atlasbot-favicon-32.png` (32 px) | `8c04d197d4e48f283a4698b808a455158664468ff7bd5824bfd519b8eb15839e` | Renderer PNG favicon |

ICO internal resolutions are not remeasured by this audit. Shared animated logo, macOS safe-area/template assets and Linux acceptance remain outside this quick-fix checkpoint. Provider/OAuth endpoints remain unchanged. This report does not promote all mascot/motion work to accepted status.

## Product surfaces

| Surface / source owner | Function | Current evidence | Approved-asset use / gap |
|---|---|---|---|
| Desktop favicon / `src/renderer/index.html` | Tab and renderer identity | Source path exists; no browser screenshot in this audit | Apply approved V0.7 favicon bytes; verify 16/32 px and packaging URL. Quick fix tracked separately. |
| `src/main/app-icon.ts` | Main window and Dock icon path | Production/dev/preview variants resolve to `build/icon-*.png` or packaged `icons/` | Use approved square A. Preserve path compatibility and data IDs. macOS safe-area is a separate resource. |
| `src/main/background-tray.ts` | Background access and remote-control menu | Windows/Linux use passed app icon; macOS uses template when present | Verify tray at native size. Keep menu and remote-stop behavior unchanged. |
| `electron-builder.yml` | Installer, executable and OS identity | Product label AtlasBot; internal app ID/protocol retained at baseline | Approved Windows ICO; packaging/hash/clean-install acceptance required. No release publication. |
| `src/main/desktop-notifications.ts` | Native task and welcome notifications | Native policy/retention source identified | Notification display identity also depends on executable, shortcut and OS cache; native screenshot pending. |
| `FirstRunFlow.tsx`, `OnboardingComputerVisual.tsx` | First run and onboarding | Existing components; PR #8 changes Canary legal disclosure | Optional Guide placement, no automatic avatar overwrite. Loading/error/success captures pending. |
| `packages/ui/src/features/agents/AgentAvatar.tsx` | Individual agent avatar | Existing shared component | Preserve custom avatar and fallbacks. A mascot association must remain optional. |
| `packages/ui/src/features/team/TeamPersonAvatar.tsx` | User/member avatar | Existing shared component | Preserve person identity, upload/crop and local/remote ownership. No mascot replacement. |
| `WorkspaceAgentSetup.tsx`, `WorkspaceSidebar.tsx` | Agent creation/list and navigation | Source owners identified | Role-icon mapping and small-size QA pending. |
| `WorkspaceConversation.tsx`, `AgentSettingsPanel.tsx` | Chat, task and agent settings | Source owners identified | Agent avatar must remain stable through provider switch/restart. Native runtime proof pending. |
| `MarketplaceModal.tsx` | Connector/agent/skill catalog UI | Static connectors and authorized catalogs differ | Atlas catalog empty/loading/error states need real stage test. Preserve provider connector logos where permitted. |
| `SettingsModal.tsx`, `SettingsGeneralTab.tsx`, `HelpMenu.tsx` | Settings, help/about and external entry points | Promotional destinations mapped separately | Atlas home/repository replacements in PR #9; legitimate provider/help endpoints retained. |
| `WebWorkspace.tsx`, `WebAgentSettings.tsx` | Joined-server web UI | Existing consumers | Renderer-only branding is insufficient; web favicon/assets require independent verification. |
| `apps/mobile` | Android/iOS UI and notifications | Original client source exists; installed Android build not inspected | No redistribution/rebranding authorized here. QR compatibility is not complete app compatibility. |
| Atlas-SI website | Public marketing identity | Website PR #9 merged, separate repository | Static approved masters used; website acceptance does not certify desktop assets. |

Paths above are entry-point owners, not a claim that every descendant component and visual state has been inventoried. The mission's 100% screen inventory remains pending.

## Six characters

| Character | Role association proposal | Asset evidence | State / next validation |
|---|---|---|---|
| Guide | Assistance and onboarding | Approved character referenced by V0.6/V0.7 registry | Static role placement proposal; no speaking/rigged avatar proven. |
| Creator | Content creation | Approved six-character set referenced by PR #2 | Optional association only; detail, alt text and scale QA pending. |
| Builder | Implementation | Approved six-character set referenced by PR #2 | Optional association only; no agent permissions implied. |
| Analyst | Analysis | Approved six-character set referenced by PR #2 | Optional association only; no model/provider identity implied. |
| Flow | Coordination | Approved six-character set referenced by PR #2 | Static fallback first; no workflow execution proved by motion. |
| Shield | Review/security | Approved six-character set referenced by PR #2 | Visual role proposal, not a security certification. |

Character masters, agent/user avatars and interactive animation are three separate concepts. Do not change `avatarId`, local storage, `openbot-avatar:`, `openbot-remote-avatar:`, IPC or remote picture-cache behavior for a visual rebrand.

## Required acceptance still missing

- Exact asset ID/path, SHA-256, dimensions, byte size and approval state per applied surface, taken from the quick-fix manifest; verify package entries match those hashes.
- Real Windows captures at 16/32/128/512 px, dark/light, display scaling, taskbar/tray, first-run and notification. Record actual dimensions rather than assuming one master fits all.
- Keyboard/accessibility, descriptive text, empty/loading/error/success states and reduced-motion behavior for any added character.
- Avatar upload/crop/storage and revoke/sign-out cache deletion; local and joined-server consumers, with no loss of custom identity.
- macOS ICNS/template/safe-area and Linux tray/window acceptance. Windows source reuse is not evidence for these platforms.
