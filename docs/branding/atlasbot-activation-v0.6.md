# AtlasBot — Phase 01 V0.6 desktop activation (candidate)

This is a **media activation**, not an automatic product rebrand.

## Source of truth

- Approved dual-maquette source and frozen SHA-256 are managed in private [atlas-brand-system](https://github.com/AtlasHub-Si/atlas-brand-system).
- The approved master is unchanged: `39df365f652f527933287b9d83ee7bc37d750214271f3ea7bd6070f4b10df48a`.
- [V0.6 full ZIP on Drive](https://drive.google.com/file/d/1XcvGDBy7QynmVddqq15NfHZTh4_EeGRG/view)
- [Guide master on Drive](https://drive.google.com/file/d/1JOmCAbsQmSR87pUaZxMpoj45DKzZkLq1/view)
- [Favicon A concept](https://drive.google.com/file/d/1IDO4mj2K8G7-xyAbTYNKhUtYNc6_dKk_/view)
- [Guide app icon concept](https://drive.google.com/file/d/1QvMuk84H7qapBUalX_S2BrhILh1UK-7O/view)
- [Visual review sheet](https://drive.google.com/file/d/1ZgKg8rlaWA9LqoeETM6eu0n3RHnYcqaM/view)
- ZIP SHA-256: `54996b346f9c2da7b99979566755deb950b070fc04d66143c66eea39f7ac330a`.

## What is inside

97 integrity-checked assets: six 1024px transparent masters, six sets of 64–1024px WebP mascots, 6 SVG role icons, static motion CSS (opt-in), Cosmos hero without text, OG image, Windows ICO, macOS ICNS, Linux PNG and system tray templates, browser favicons SVG/PNG/ICO, PWA manifest, theme, QA and documentation.

## Install without changing the current desktop product

At repository root, download the specific reviewed archive and run:

```sh
python3 scripts/branding/install-atlasbot-pack-v06.py --archive /absolute/path/ATLASBOT_Visual_Activation_Pack_V0.6.zip
python3 scripts/branding/install-atlasbot-pack-v06.py --archive /absolute/path/ATLASBOT_Visual_Activation_Pack_V0.6.zip --apply
```

The tool checks the archive hash and every asset record. It only installs into `src/renderer/src/assets/atlasbot-v0.6/`, never overwrites changed files, and never modifies `build/icon-production.*`.

Use `atlasbot-assets.ts` inside a renderer prototype for URLs. The import returns undefined when binary media has not been installed; render an accessible fallback. Include motion CSS only in the prototype and respect reduced-motion.

## Website workstream

The ZIP contains a full favicon suite and meta manifest for `AtlasHub-Si/atlas-si-website`. Web integration is not part of this PR; use a separate reviewed website PR. The A vector is a **candidate approximation** pending the official Atlas SVG source.

## Unresolved release gates

1. Human creative approval of six characters, especially Guide and icon A geometry.
2. Real Electron/macOS/Windows/Linux and browser/PWA visual checks on target devices.
3. Articulated character 3D rigs / full turnarounds / genuine Lottie motion remain pending.
4. Existing OpenBot repository is PolyForm Noncommercial 1.0.0. No permission for commercial redistribution or renaming signed installers has been established.
5. No production deployment, updater changes, domain DNS, or public R2 delivery has been authorized.
