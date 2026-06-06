# Next.js / SSR Setup Guide

Complete guide for using `@space-man/react-theme-animation` in Next.js and other SSR-style React apps.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Recommended Imports

Import public APIs from the package root:

```tsx
import { ThemeProvider, useTheme } from '@space-man/react-theme-animation'
```

In the App Router, import `ThemeProvider` from a local client component such as
`app/providers.tsx`, then render that local component from `app/layout.tsx`. This keeps the layout
as a server component while the theme provider runs on the client.

For Next.js usage, the package exposes both:

- `ThemeProvider` / `useTheme` for a drop-in `next-themes`-style API
- `NextThemeProvider` / `useNextTheme` if you prefer the framework-specific names

They point to the same implementation.

## When To Use This Provider

Use `ThemeProvider` or `NextThemeProvider` when you need:

- pre-hydration theme application to reduce flash on SSR pages
- a `next-themes`-style API for theme state and setters
- animated theme switching with view transitions
- color-theme support in addition to light/dark/system mode

## App Router Setup

```tsx
// app/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@space-man/react-theme-animation'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" defaultColorTheme="default">
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Providers } from './providers'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Pages Router Setup

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@space-man/react-theme-animation'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" defaultColorTheme="default">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

## Theme Toggle Example

```tsx
'use client'

import { useTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

## Color Theme Example

```tsx
'use client'

import { useTheme } from '@space-man/react-theme-animation'

export function ColorThemeButtons() {
  const { createColorThemeToggle, isColorThemeActive } = useTheme()

  return (
    <div>
      <button
        onClick={createColorThemeToggle('blue')}
        className={isColorThemeActive('blue') ? 'active' : ''}
      >
        Blue
      </button>
      <button
        onClick={createColorThemeToggle('green')}
        className={isColorThemeActive('green') ? 'active' : ''}
      >
        Green
      </button>
    </div>
  )
}
```

## `next-themes`-Style Provider Props

The Next provider supports these root-import props:

| Prop                        | Type                                      | Default                       |
| --------------------------- | ----------------------------------------- | ----------------------------- |
| `defaultTheme`              | `Theme`                                   | `'system'`                    |
| `themes`                    | `Theme[]`                                 | `['light', 'dark', 'system']` |
| `attribute`                 | `'class' \| 'data-theme'`                 | `'class'`                     |
| `value`                     | `Record<string, string>`                  | -                             |
| `enableSystem`              | `boolean`                                 | `true`                        |
| `enableColorScheme`         | `boolean`                                 | `true`                        |
| `forcedTheme`               | `Theme`                                   | -                             |
| `disableTransitionOnChange` | `boolean`                                 | `false`                       |
| `nonce`                     | `string`                                  | -                             |
| `scriptProps`               | `ScriptHTMLAttributes<HTMLScriptElement>` | -                             |
| `disablePreHydrationScript` | `boolean`                                 | `false`                       |

Additional package-specific props:

| Prop                     | Type                               | Default         |
| ------------------------ | ---------------------------------- | --------------- |
| `defaultColorTheme`      | `ColorTheme`                       | `'default'`     |
| `colorThemes`            | `ColorTheme[]`                     | `['default']`   |
| `colorStorageKey`        | `string`                           | `'color-theme'` |
| `colorThemePrefix`       | `string`                           | `'theme-'`      |
| `animationType`          | `ThemeAnimationType`               | `CIRCLE`        |
| `duration`               | `number`                           | `750`           |
| `globalClassName`        | `string`                           | `'dark'`        |
| `disableAnimationOnInit` | `boolean`                          | `true`          |
| `onThemeChange`          | `(theme: Theme) => void`           | -               |
| `onColorThemeChange`     | `(colorTheme: ColorTheme) => void` | -               |

## CSP / Nonce Support

If your app uses CSP headers, pass the nonce into the provider so the pre-hydration script can run safely.

```tsx
// app/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@space-man/react-theme-animation'

export function Providers({
  children,
  nonce,
}: {
  children: ReactNode
  nonce?: string
}) {
  return <ThemeProvider nonce={nonce}>{children}</ThemeProvider>
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { Providers } from './providers'

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers nonce={nonce ?? undefined}>{children}</Providers>
      </body>
    </html>
  )
}
```

## `attribute` And `value`

By default the provider uses `class` mode and applies:

- `dark` for dark mode
- no extra light class by default
- `system` when `system` mode is active

If you want custom values, pass a `value` map:

```tsx
<ThemeProvider
  attribute="class"
  value={{
    light: 'theme-light',
    dark: 'theme-dark',
    system: 'theme-system',
  }}
>
  {children}
</ThemeProvider>
```

## Complete Example

```tsx
// app/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@space-man/react-theme-animation'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      defaultColorTheme="default"
      colorThemes={['default', 'blue', 'green', 'purple']}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

```tsx
// components/theme-toggle.tsx
'use client'

import { useTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
      <span>Current: {theme}</span>
    </div>
  )
}
```

## CSS Setup

Define your theme variables in global CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}

.theme-blue {
  --primary: 221.2 83.2% 53.3%;
}

.theme-blue.dark {
  --primary: 217.2 91.2% 59.8%;
}
```

## Common Issues

### Hydration Mismatch

Make sure the root `<html>` tag includes `suppressHydrationWarning`.

### Theme Flash On Load

If you still see flashing:

1. make sure `disablePreHydrationScript` is not set
2. check that your CSS variables exist for every supported theme combination
3. make sure no other script is mutating theme classes before hydration

### Migrating From `next-themes`

Use the same app-level provider shape, but in the App Router keep the package import inside a
client component:

```tsx
// app/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@space-man/react-theme-animation'

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
```

If you need the framework-specific names, you can also use:

```tsx
import {
  NextThemeProvider,
  useNextTheme,
} from '@space-man/react-theme-animation'
```

## Reference Example

- `apps/examples/example-next`

## See Also

- [TanStack Start Setup](./tanstack-start-setup.md)
- [Vite Setup](./vite-setup.md)
- [Package README](../README.md)
