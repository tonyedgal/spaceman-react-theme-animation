# Migration

## Planned v3: ESM only

The next release removes CommonJS exports. Use static `import` in ESM code.
For a CommonJS application, use dynamic `import()` from an async function:

```js
async function readServerTheme(themeCookie, colorCookie) {
  const { buildServerThemeData } =
    await import('@space-man/react-theme-animation/tanstack')
  return buildServerThemeData(themeCookie, colorCookie)
}
```

Update TypeScript module settings to match the application framework.
Do not rely on a removed `.cjs` entry.

Both controls and their required dependencies remain. Existing ESM import paths
remain. Compiled modules share code, JavaScript is minified, and source maps are
not included. Animated helpers also accept per-call options while retaining
boolean bypass arguments. See the [transition guide](packages/react-theme-animation/docs/theme-transitions.md).

The release is pending. See [readiness](docs/release-readiness.md) for the React
minimum and storage-recovery blockers.

## Server-only imports

Use `/tanstack` for server cookie helpers and `/core` for server-safe utilities.
The root entry also imports React controls and Motion. Do not import the root
entry from a Next React Server Component for a server-only helper.

```ts
import { buildServerThemeData } from '@space-man/react-theme-animation/tanstack'
import { resolveThemeForServer } from '@space-man/react-theme-animation/core'
```

## Root Imports

Version 2 standardizes public imports on the package root:

```tsx
import { ThemeProvider, useTheme } from '@space-man/react-theme-animation'
```

Prefer root imports for client APIs. Keep server helpers on their server-safe subpaths.

For Next.js App Router, keep provider and hook imports inside client components. The recommended
shape is a local `app/providers.tsx` file with `'use client'` that imports `ThemeProvider` from the
package root, then a server `app/layout.tsx` that renders `<Providers>`.

## What Changed

The package keeps compatibility subpath exports, but they are no longer the documented primary API.

Use this:

```tsx
import {
  NextThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
  ThemeSwitcher,
  ThemeSelector,
  useThemeAnimation,
  buildServerThemeData,
} from '@space-man/react-theme-animation'
```

Instead of older patterns like:

```tsx
import { useThemeAnimation } from '@space-man/react-theme-animation/react'
import { buildServerThemeData } from '@space-man/react-theme-animation/tanstack'
```

## Compatibility

These subpath exports still exist for migration safety:

- `@space-man/react-theme-animation/react`
- `@space-man/react-theme-animation/core`
- `@space-man/react-theme-animation/tanstack`

The subpaths remain supported in the planned v3 release. `/core` and `/tanstack` also keep server-only code separate from the controls.

## Recommended Update

1. Change imports to `@space-man/react-theme-animation`.
2. Keep behavior the same.
3. Keep server-only helpers on `/core` or `/tanstack`.
