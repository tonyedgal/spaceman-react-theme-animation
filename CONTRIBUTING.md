# Contributing

Thanks for your interest in contributing to `@space-man/react-theme-animation`.

Please review this guide before opening a pull request.

## About this repository

This repository is a monorepo.

- We use [pnpm](https://pnpm.io) workspaces.
- We use [Turborepo](https://turbo.build/repo) for task orchestration.
- We use [Changesets](https://github.com/changesets/changesets) for releases.

## Repository structure

```text
apps/
  examples/
    example-next/
    example-tanstack/
    example-tanstack-ssr/
packages/
  react-theme-animation/
```

| Path                                  | Description                                       |
| ------------------------------------- | ------------------------------------------------- |
| `packages/react-theme-animation`      | Published package source                          |
| `packages/react-theme-animation/docs` | Framework setup guides                            |
| `apps/examples/example-next`          | Next.js example app                               |
| `apps/examples/example-tanstack`      | TanStack Start example using pre-hydration script |
| `apps/examples/example-tanstack-ssr`  | TanStack Start example using cookie-based SSR     |

## Getting set up

### Clone the repository

```bash
git clone https://github.com/tonyedgal/spaceman-react-theme-animation.git
cd spaceman-react-theme-animation
```

### Install dependencies

```bash
pnpm install
```

## Development

### Run all workspace development tasks

```bash
pnpm dev
```

### Run a specific workspace

Examples:

```bash
pnpm --filter @space-man/react-theme-animation dev
pnpm --filter example-next dev
pnpm --filter example-tanstack dev
pnpm --filter example-tanstack-ssr dev
```

## Verification

Before opening a pull request, run the relevant checks for the code you changed.

### Whole workspace

```bash
pnpm build
pnpm typecheck
pnpm format:check
```

### Common targeted checks

```bash
pnpm --filter @space-man/react-theme-animation build
pnpm --filter @space-man/react-theme-animation typecheck
pnpm --filter example-next build
pnpm --filter example-tanstack build
pnpm --filter example-tanstack-ssr build
```

## Documentation

Repository docs are split like this:

- root `README.md` is the repository docs hub
- `packages/react-theme-animation/README.md` is the package README and release-facing documentation
- `packages/react-theme-animation/docs/*.md` contains framework-specific setup guides

When changing API behavior, update the package README and the relevant framework guide in the same change.

## Releases

Releases are managed with Changesets.

If your change affects the published package, add a changeset:

```bash
pnpm changeset
```

The release workflow builds from the workspace root and publishes only `@space-man/react-theme-animation`.

## Pull requests

Please keep pull requests focused and include:

- a clear summary of what changed
- any API or behavior changes called out explicitly
- doc updates when public behavior changed
- verification notes describing what you ran

## Commit messages

Using conventional-style commit messages is preferred.

Examples:

- `feat(next): add root ThemeProvider alias`
- `fix(tanstack): sync server color theme updates`
- `docs(readme): rewrite package documentation`
