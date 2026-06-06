# spaceman-react-theme-animation

Monorepo for `@space-man/react-theme-animation` and its example apps.

## Documentation

- [Package README](./packages/react-theme-animation/README.md) - installation, release notes, API overview, and package usage
- [Next.js / SSR Setup Guide](./packages/react-theme-animation/docs/nextjs-setup.md) - Next.js App Router, Pages Router, SSR, and `ThemeProvider` / `useTheme`
- [TanStack Start Setup Guide](./packages/react-theme-animation/docs/tanstack-start-setup.md) - cookie-based SSR and pre-hydration script setups
- [Vite React SPA Setup Guide](./packages/react-theme-animation/docs/vite-setup.md) - client-side setup and Vite provider usage
- [Contributing Guide](./CONTRIBUTING.md) - monorepo structure, development workflow, and verification commands
- [Security Policy](./SECURITY.md) - private vulnerability reporting guidance
- [Support Guide](./SUPPORT.md) - issue reporting and support expectations
- [Migration Guide](./MIGRATION.md) - root-import migration notes and compatibility paths
- [Release Notes v2](./RELEASE_NOTES_v2.md) - user-facing summary of the v2 release
- [Releasing Guide](./RELEASING.md) - release flow and local provenance verification

## Package

- [`packages/react-theme-animation`](./packages/react-theme-animation/) - published package source

## Workspace Examples

- [`apps/examples/example-next`](./apps/examples/example-next/) - Next.js example
- [`apps/examples/example-tanstack`](./apps/examples/example-tanstack/) - TanStack Start example using pre-hydration script setup
- [`apps/examples/example-tanstack-ssr`](./apps/examples/example-tanstack-ssr/) - TanStack Start example using cookie-based SSR setup

## Development

```bash
pnpm install
pnpm build
```
