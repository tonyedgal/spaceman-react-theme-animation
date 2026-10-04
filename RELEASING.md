# Releasing

## Current status

The planned release is `3.0.0`. The implementation blockers in [release readiness](docs/release-readiness.md) are resolved. Version generation and external npm authorization still remain. Do not run the publish step as part of a local audit.

Changesets combines the pending major and minor entries. Keep the historical v2 note unchanged. Release tooling must generate the version and changelog; do not edit the generated changelog by hand.

## Local checks

Run from the workspace root, in this order:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm quality
pnpm typecheck
pnpm --filter @space-man/react-theme-animation test
pnpm --filter @space-man/react-theme-animation test:unit
pnpm --filter @space-man/react-theme-animation test:types
pnpm --filter @space-man/react-theme-animation exec node scripts/check-packed-package.mjs
pnpm --filter @space-man/react-theme-animation test:browser
pnpm exec changeset status
pnpm audit --prod
```

Build first. Import, type, and browser fixtures now use compiled package entries. Browser checks require installed Playwright browsers. The workflow runs builds, quality, workspace types, imports, units, public type fixtures, extracted-package consumers, production security auditing, and the browser suite. The extracted-package check uses React 18.0 / Motion 12.0 / Radix 2.0 and current peers. It checks public imports, declarations, SSR, and shipped files. GitHub Actions execution is still unverified until the branch is pushed.

## Inspect the release artifact

Pack the package to a temporary directory:

```sh
pnpm --filter @space-man/react-theme-animation exec npm pack --json --pack-destination /tmp
```

Check the exact file list. The archive must contain the ESM entries, shared JavaScript chunks, `.d.ts` declarations, README, license, and manifest. It must not contain CommonJS files, source maps, source files, tests, examples, or workspace tooling.

Extract the archive into a temporary consumer. Supply compatible versions of the required peers. Verify root, `/react`, `/core`, and `/tanstack` imports and compile TypeScript against the extracted declarations. Confirm the controls share the provider state. Verify the lowest supported React version and an actual Next.js SSR/hydration flow.

## Release flow

The workflow in `.github/workflows/publish.yml` runs on `main`. Changesets opens or updates a version PR while pending Changesets exist. After that version PR is merged, the publish command can publish the versioned package. Example packages are private and are not published.

Before merging, confirm the resulting package version is `3.0.0`, the generated changelog includes all pending changes, the lockfile is current, and the final archive matches the tested artifact.

## npm authentication and provenance

The workflow supplies `id-token: write`, uses Node 24, and enables provenance in the package manifest. These settings do not prove that npm's external trusted-publisher configuration is correct.

Verify the npm publisher entry matches the GitHub owner, repository, and `.github/workflows/publish.yml`. Verify any configured environment and allowed publish action. Trusted publishing requires npm >=11.5.1 and Node >=22.14.0. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) and [provenance](https://docs.npmjs.com/generating-provenance-statements/).

A local `npm publish --dry-run` is optional. It does not prove registry authorization, OIDC configuration, or successful provenance generation. No package is published during a dry run.

## Release documentation

- [Planned v3 release](RELEASE_NOTES_v3.md)
- [Migration](MIGRATION.md)
- [Readiness audit](docs/release-readiness.md)
- [Historical v2 release](RELEASE_NOTES_v2.md)
