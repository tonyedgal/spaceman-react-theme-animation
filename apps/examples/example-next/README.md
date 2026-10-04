Next.js example using `@space-man/react-theme-animation` with the root `ThemeProvider` / `useTheme` API.

This app demonstrates:

- `ThemeProvider` as a drop-in `next-themes`-style provider
- `useTheme` for client theme state and setters
- Next.js App Router integration with SSR-safe theme hydration
- a local client provider wrapper so `app/layout.tsx` remains a server component

## Run from the workspace root

```sh
pnpm install
pnpm --filter @space-man/react-theme-animation build
pnpm --filter example-next dev
```

## Build for production

```sh
pnpm --filter example-next... build
```

The example uses ESM package imports. It demonstrates animated mode and palette
changes through the shared library API. Read the [transition guide](../../../packages/react-theme-animation/docs/theme-transitions.md) for origins, directions, logos, and keyboard handling.

This example app is private. npm publishes only the library package.
