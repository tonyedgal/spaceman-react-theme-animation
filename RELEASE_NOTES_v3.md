# Release notes: planned v3

This release is not published. Changesets currently plans `3.0.0`. The package manifest remains `2.2.0` until the version step runs. See [release readiness](docs/release-readiness.md) for verified checks and the remaining publication steps.

## Breaking module change

The package ships ESM only. Replace CommonJS `require()` with static `import` or dynamic `import()`. Existing ESM root, `/react`, `/core`, and `/tanstack` paths remain. Type declarations remain included.

## Supported peers and fixes

Require React and React DOM >=18 and Motion >=12. Keep Radix Select >=2 and all UI dependencies required. Extracted-package checks cover these minimums and current peers.

Blocked storage reads use defaults. Failed writes still update mode and palette. Hydration preserves the server render before restoring saved browser preferences.

`ThemeSelector` now applies its class, placeholder, and palette label, and calls its own callback inside a provider. `themeLabel` is deprecated because this selector changes palettes.

## Transitions

- Mode and palette changes use the same transition lifecycle.
- Per-call options accept a trigger `element`, an explicit CSS-pixel `origin`, or `animationOff`. Existing boolean bypass arguments remain supported.
- Add `CLIP_PATH`, `POLYGON_GRADIENT`, `TRIANGLE`, and `SVG_LOGO` alongside the existing circle, blur-circle, and slide effects.
- Add eight wipe directions, fixed origins, paired destination logos, automatic logo sizing, and asset preloading.
- Use a 400 ms default and preserve explicit durations across large and high-density displays.
- Use a bounded reveal-edge feather for the blur-circle effect.
- Coordinate rapid requests per document and preserve state updates when capture is skipped or animation is unavailable.
- Track keyboard input within the built-in selector popup.

## Packaging and tooling

Keep both built-in controls and their required dependencies. Share compiled modules between entries, minify JavaScript, and omit source maps. Readiness records the current archive measurement. Examples are not included in the archive. External dependencies install separately.

Use Oxlint, Oxfmt, and the published `antislop-plugin`. Update the workspace to React 19.3, Next 16.3.8, Vite 8.3.2, Motion 14, and current TanStack packages. TypeScript stays on the latest compatible 5.9.3 because newer compilers break tsup declaration generation.

Release CI checks compiled imports, units, declarations, minimum/current extracted-package consumers, browser transitions, example builds, and production dependency auditing. The production audit reports zero findings. GitHub Actions dependencies also use their current major releases.

## Migration

Read [MIGRATION.md](MIGRATION.md) for ESM and server-import guidance. Read the [transition guide](packages/react-theme-animation/docs/theme-transitions.md) for the new options and promise timing. The [v2 notes](RELEASE_NOTES_v2.md) remain the historical record.
