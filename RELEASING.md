# Releasing

## Release Flow

This repo uses Changesets.

The release workflow:

1. installs from the workspace root
2. runs formatting checks
3. runs the workspace build
4. versions packages with Changesets
5. publishes only `@space-man/react-theme-animation`

GitHub Actions release workflow:

- `.github/workflows/publish.yml`

## Local Verification

Before merging release-related changes, verify the package from the workspace root:

```bash
pnpm --filter @space-man/react-theme-animation build
pnpm --filter @space-man/react-theme-animation pack
pnpm --filter @space-man/react-theme-animation exec npm publish --dry-run --provenance --access public
```

What this verifies:

- the package builds from the monorepo layout
- the packed artifact is publishable
- npm accepts the publish command shape used for provenance-enabled publishing

This does not publish anything to npm.

## CI Provenance Requirements

Provenance publishing depends on both of these being present:

- `publishConfig.provenance: true` in `packages/react-theme-animation/package.json`
- `id-token: write` in `.github/workflows/publish.yml`

## Release Notes

See `RELEASE_NOTES_v2.md` for the current v2 summary.
