TanStack Start example using `@space-man/react-theme-animation` with the cookie-based SSR approach.

This app demonstrates:

- app-local TanStack Start server functions for theme cookies
- `beforeLoad()` theme hydration on the server
- server-rendered `<html>` theme classes
- `TanStackThemeProvider` callbacks that keep cookies in sync
- CSS-driven `system` handling via `systemThemeMode="css"`

## Run from the workspace root

```sh
pnpm install
pnpm --filter @space-man/react-theme-animation build
pnpm --filter example-tanstack-ssr dev
```

## Build for production

```sh
pnpm --filter example-tanstack-ssr... build
```

The example uses ESM package imports. It demonstrates animated mode and palette
changes through the shared library API. Read the [transition guide](../../../packages/react-theme-animation/docs/theme-transitions.md) for origins, directions, logos, and keyboard handling.

This example app is private. npm publishes only the library package.
