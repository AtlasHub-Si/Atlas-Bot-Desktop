# AtlasBot Desktop Assets — V0.5 (design candidate)

This directory is an **opt-in** asset library for visual prototypes. The six role icons, motion CSS, and theme JSON are included. The five transparent mascot WebP sets (128/256/512/1024), PNG masters, space wallpapers, and brand studies are distributed separately in the SHA-verified 14 MB ZIP.

**ZIP:** https://drive.google.com/file/d/1xsOvg6ndOQ-S7zA1asrP1m-4KKwVMb-a/view

**Source registry:** [ATLAS Visual Brand System](https://github.com/AtlasHub-Si/atlas-brand-system) (private; access required). The immutable approved master is never copied to this public repository.

## Install binary assets

From repository root:

```bash
python3 scripts/branding/install-atlasbot-pack.py --archive /path/to/ATLASBOT_Desktop_Visual_Pack_V0.5.zip
python3 scripts/branding/install-atlasbot-pack.py --archive /path/to/ATLASBOT_Desktop_Visual_Pack_V0.5.zip --apply
```

This first verifies SHA-256 and then adds only files under `src/renderer/src/assets/atlasbot-v0.5/`. It never overwrites changed files.

## Use

Import `atlasBotRoleIconUrl` or `atlasBotMascotUrl` from `./atlasbot-assets` in a renderer prototype. WebP URLs are undefined until binary files are installed; code must show an accessible fallback. Import `./motion/atlasbot-motion.opt-in.css` only in the prototype that needs it. Use `data-state` on the image, with support for reduced-motion. Import the theme JSON manually in Settings > General > Theme.

The current OpenBot logos, package icons, agent UI and runtime are **not** modified by this PR. The Guide image is still a low-resolution marketing preview, not an isolated transparent master. The logo approximations in the ZIP require exact geometric approval and must not replace the existing app icon.

**Legal:** inherited OpenBot source remains PolyForm Noncommercial 1.0.0; this work does not authorize commercial redistribution or branded installers.
