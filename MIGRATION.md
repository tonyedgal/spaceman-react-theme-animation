# Migration

## Root Imports

Version 2 standardizes public imports on the package root:

```tsx
import { ThemeProvider, useTheme } from '@space-man/react-theme-animation'
```

Prefer root imports for all public APIs.

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

They should be treated as temporary compatibility paths.

## Recommended Update

1. Change imports to `@space-man/react-theme-animation`.
2. Keep behavior the same.
3. Only rely on subpath exports if you need temporary migration compatibility.
