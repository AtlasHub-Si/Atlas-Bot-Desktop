# AtlasBot desktop visual pack V0.5 — review gate

**Scope:** opt-in visuals only, no renderer or installer brand switch. See `src/renderer/src/assets/atlasbot-v0.5/README.md`.

## Evidence

- User-approved reference: `AtlasHub-Si/atlas-brand-system/assets/approved/v1.0.0/atlas-dual-ecosystem-master.png`, SHA-256 `39df365f652f527933287b9d83ee7bc37d750214271f3ea7bd6070f4b10df48a`.
- No original frozen baseline is committed to this public repo.
- 5 original character candidates: Creator / Builder / Analyst / Flow / Shield. Guide remains preview-only.
- 42 packaged assets, 14,296,352 uncompressed bytes; installer dry-run and isolated install both PASS.
- Reviewed V0.5 ZIP SHA-256: `68a7cb7ebf42de2ff7384f439acb9ce8e081d6261ef3003720daaf880928bd99` (the repository installer rejects another archive).
- [Full Desktop Visual Pack ZIP](https://drive.google.com/file/d/1xsOvg6ndOQ-S7zA1asrP1m-4KKwVMb-a/view), [QA contact sheet](https://drive.google.com/file/d/1gybUHugFLDtz70yYktszoEOebqDoXwaX/view), [manifest](https://drive.google.com/file/d/1gl-YnF6CQxBGfkN5LmQA65swaita1_uE/view).

## Integration plan

1. Review and approve visual geometry/colors for each mascot; keep draft/proposal status until approval.
2. Download ZIP from Drive and run `python3 scripts/branding/install-atlasbot-pack.py --archive <ZIP>` to verify hashes. Run again with `--apply` on the target branch.
3. Use `atlasbot-assets.ts` in an isolated SolidJS prototype. Respect `prefers-reduced-motion` and fallback if the images are not installed.
4. Use `atlas-night.theme.json` as a user theme test. Do not replace global `@openbot/brand` tokens without design and accessibility QA.
5. Validate desktop Electron on Windows, macOS and Linux via normal project CI. Only after review should packaging icons be prepared, with exact Atlas vector masters.

## Licensing and safety

`LICENSE`, `NOTICE`, `ATLAS.md`, `electron-builder.yml`, and product identity are unchanged. **The upstream is PolyForm Noncommercial 1.0.0.** Commercial release, domain-specific installer or rebranded distribution requires a separate legal clearance; branding work does not grant new rights. No secrets, account changes, or DNS modifications.
