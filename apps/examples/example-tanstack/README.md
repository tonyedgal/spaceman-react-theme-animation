TanStack Start example using `@space-man/react-theme-animation` with the pre-hydration script approach.

This app demonstrates:

- `TanStackStartThemeScript` in the document `<head>`
- `TanStackThemeProvider` for client-side state and transitions
- CSS-driven `system` handling via `systemThemeMode="css"`

## Run from the workspace root

```sh
pnpm install
pnpm --filter @space-man/react-theme-animation build
pnpm --filter example-tanstack dev
```

## Build for production

```sh
pnpm --filter example-tanstack... build
```

The example uses ESM package imports. It demonstrates animated mode and palette
changes through the shared library API. Read the [transition guide](../../../packages/react-theme-animation/docs/theme-transitions.md) for origins, directions, logos, and keyboard handling.

This example app is private. npm publishes only the library package.
