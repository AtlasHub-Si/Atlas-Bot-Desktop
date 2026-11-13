# AtlasBot desktop branding

Public name: **AtlasBot**. Repository: `AtlasHub-Si/Atlas-Bot-Desktop`. Company: ATLAS GLOBAL TECH LTD. Website: https://atlas-si.com.

Primary brand reference: https://github.com/AtlasHub-Si/atlas-brand-system. Secondary working assets: https://drive.google.com/drive/folders/1IPc6n9InPrmp5SYuUjRzes4o4x9CJoHU.

## Current integration

Desktop HTML title, native display name, packaging product name, onboarding labels and core UI catalogs use AtlasBot. Root package identity `openbot`, workspace names `@openbot/*`, IPC names, database names, URI schemes, OS IDs and storage paths remain stable for compatibility. Shared catalogs cover desktop, web client and mobile labels. Wire error/status text remains stable.

The current icon is a temporary inherited asset. Do not call it an approved AtlasBot logo. The brand repository has an approved composite reference image, but no final application icon masters. Do not crop or trace that composite, copy private assets into this public repository, or promote draft tokens or mascot candidates to production.

## Next asset integration

Validate SVG masters and transparent PNG exports; prepare production/dev/preview icons, macOS safe-area variants and ICNS, Windows ICO, Linux PNG, tray templates and installer artwork. Replace the shared AppLogo and outlined wordmark together with the approved assets. Preserve accessible labels and reduced-motion behavior.

## Diagnostics and updates

Default desktop analytics and desktop failure report queues are disabled. An explicit development capture endpoint remains available for local diagnostics tests. The web, mobile and API analytics paths still need their separate hygiene pass; this change does not claim complete telemetry removal.

Packaging and hosted release feeds point to AtlasHub-Si/Atlas-Bot-Desktop. Installed and recovery updates require `ATLASBOT_ENABLE_UPDATES=1`; leave it unset until signed Atlas releases and recovery behavior pass release validation. The download URL is https://bot.atlas-si.com/download; availability is not verified here.

## Remaining work

- Complete the file-by-file A/B/C audit and remove inherited external automation safely.
- Review API, marketplace, invitations, authentication, mobile OTA and provider-runtime endpoints. Changing their domains alone does not provision working Atlas services.
- Apply final approved assets and verify all desktop platforms.
- Resolve license permissions before relicensing or deleting required notices.
- Review any history rewrite separately after validation; it does not detach a GitHub fork or erase other refs/copies.

## Automation

Inherited workflows were retired before publication, including deployments, OTA, release announcements, external review automation and upstream runtime jobs. `atlasbot-check.yml` uses the frozen lockfile and checks catalogs, types and build with read-only permissions. It has no deploy, release or messaging step. Platform release and security regression lanes must be restored under Atlas ownership before installers ship.

Retired workflows: `release-rollout.yml`, `cloudflare-preview.yml`, `mobile-updates-deploy.yml`, `publish-android-apk.yml`, `release-ios.yml`, `release-regression.yml`, `changelog.yml`, `remote-desktop-runtime.yml`, `release-health.yml`, `contribution-policy.yml`, `cla.yml`, `provider-cli-canary.yml`, `mobile-ota.yml`, `status-page.yml`, `windows-installer-e2e.yml`, `release.yml`, `ci.yml`, `provider-live-e2e.yml`, `release-android.yml`, `norbiai-review.yml`, `cua-driver.yml`, `release-android-apk.yml`, `mobile-release-announcement.yml`.
