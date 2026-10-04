# Release notes: planned v3

This release is not published. Changesets currently plans `3.0.0`. The package manifest remains `2.2.0` until the version step runs. See [release readiness](docs/release-readiness.md) for unresolved blockers.

## Breaking module change

The package ships ESM only. Replace CommonJS `require()` with static `import` or dynamic `import()`. Existing ESM root, `/react`, `/core`, and `/tanstack` paths remain. Type declarations remain included.

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

Keep both built-in controls and their required dependencies. Share compiled modules between entries, minify JavaScript, and omit source maps. The measured pre-documentation archive was 20.4 KiB compressed and 76.4 KiB unpacked. README edits can change the final size. Examples are not included in the archive. External dependencies install separately.

Use Oxlint, Oxfmt, and the published `antislop-plugin`. Validate compiled public imports and declarations, browser transitions, and example builds.

## Migration

Read [MIGRATION.md](MIGRATION.md) for ESM and server-import guidance. Read the [transition guide](packages/react-theme-animation/docs/theme-transitions.md) for the new options and promise timing. The [v2 notes](RELEASE_NOTES_v2.md) remain the historical record.
