# TanStack Start Setup Guide

Complete guide for using `@space-man/react-theme-animation` in TanStack Start apps with flash-free theme support.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Tailwind Setup For Prebuilt Components

`ThemeSwitcher`, `ThemeSelector`, and the bundled select primitives use Tailwind utility classes. The package does not ship a compiled stylesheet for those components, so Tailwind needs to scan the installed package when you use them.

For Tailwind v4, add an `@source` directive next to your Tailwind import:

```css
@import 'tailwindcss';
@source '../node_modules/@space-man/react-theme-animation/dist';
```

Adjust the relative path to match your app structure.

## Choose Your Approach

TanStack Start integrations have two supported flash-prevention modes:

| Approach             | Flash Prevention | Setup                                         |
| -------------------- | ---------------- | --------------------------------------------- |
| Cookie-based SSR     | Zero flash       | Recommended when you can use server functions |
| Pre-hydration script | Near-zero flash  | Simpler setup without cookies                 |

Both approaches support:

- `systemThemeMode="css"`: applies a `system` class and lets CSS media queries handle OS preference before hydration.
- `systemThemeMode="js"`: resolves `system` with `matchMedia` in JavaScript.

## Reference Apps

- `example-tanstack`: pre-hydration script setup
- `example-tanstack-ssr`: cookie-based SSR setup

## Option A: Cookie-Based SSR

This mode stores theme choices in cookies, reads them during `beforeLoad`, and renders the correct `<html>` classes on the server.

### 1. Create App-Level Server Functions

Create `src/lib/theme.ts`:

```ts
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import {
  buildServerThemeData,
  COLOR_STORAGE_KEY,
  STORAGE_KEY,
  type ServerThemeData,
} from '@space-man/react-theme-animation'

export const getThemeServerFn = createServerFn().handler(
  (): ServerThemeData => buildServerThemeData(getCookie(STORAGE_KEY), getCookie(COLOR_STORAGE_KEY))
)

export const setThemeServerFn = createServerFn()
  .inputValidator(z.string())
  .handler(({ data }) => {
    setCookie(STORAGE_KEY, data)
  })

export const setColorThemeServerFn = createServerFn()
  .inputValidator(z.string())
  .handler(({ data }) => {
    setCookie(COLOR_STORAGE_KEY, data)
  })
```

`createServerFn()` must live in application source code. TanStack Start transforms those calls at build time, so they cannot be hidden inside a prebuilt library helper.

### 2. Wire the Root Route

```tsx
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'
import { getThemeServerFn, setColorThemeServerFn, setThemeServerFn } from '@/lib/theme'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => ({
    themeData: await getThemeServerFn(),
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { themeData } = Route.useRouteContext()
  const htmlClass = [
    themeData.theme,
    themeData.colorTheme !== 'default' ? `theme-${themeData.colorTheme}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { themeData } = Route.useRouteContext()

  return (
    <TanStackThemeProvider
      defaultTheme="system"
      defaultColorTheme="default"
      themes={['light', 'dark', 'system']}
      colorThemes={['default', 'blue', 'green']}
      animationType={ThemeAnimationType.CIRCLE}
      serverTheme={themeData.theme}
      serverColorTheme={themeData.colorTheme}
      systemThemeMode="css"
      onServerThemeChange={theme => setThemeServerFn({ data: theme })}
      onServerColorThemeChange={colorTheme => setColorThemeServerFn({ data: colorTheme })}
    >
      <Outlet />
    </TanStackThemeProvider>
  )
}
```

## Option B: Pre-Hydration Script

This mode reads `localStorage` before React hydrates.

```tsx
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackStartThemeScript, TanStackThemeProvider } from '@space-man/react-theme-animation'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <TanStackStartThemeScript defaultTheme="system" systemThemeMode="css" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <TanStackThemeProvider
      defaultTheme="system"
      defaultColorTheme="default"
      themes={['light', 'dark', 'system']}
      colorThemes={['default', 'blue', 'green']}
      systemThemeMode="css"
    >
      <Outlet />
    </TanStackThemeProvider>
  )
}
```

## Theme Controls

```tsx
import { useTanStackTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, switchTheme, ref } = useTanStackTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button ref={ref} onClick={() => switchTheme(nextTheme)}>
      Switch theme
    </button>
  )
}
```

## CSS Setup

Standard explicit dark-mode styling works with `systemThemeMode="js"`:

```css
@custom-variant dark (&:is(.dark *));

:root {
  --background: white;
  --foreground: black;
}

.dark {
  --background: black;
  --foreground: white;
}
```

For `systemThemeMode="css"`, update the `dark` variant and mirror your dark variables into `.system` under the OS media query:

```css
@custom-variant dark {
  &:is(.dark *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:is(.system *) {
      @slot;
    }
  }
}

.dark {
  --background: black;
  --foreground: white;
}

@media (prefers-color-scheme: dark) {
  .system {
    --background: black;
    --foreground: white;
  }
}
```

Color themes follow the same pattern:

```css
.theme-blue {
  --primary: blue;
}

.theme-blue.dark {
  --primary: lightblue;
}

@media (prefers-color-scheme: dark) {
  .theme-blue.system {
    --primary: lightblue;
  }
}
```

## TanStack-Specific API

### `TanStackThemeProvider`

| Prop                       | Type                                            | Default |
| -------------------------- | ----------------------------------------------- | ------- |
| `serverTheme`              | `'light' \| 'dark' \| 'system'`                 | -       |
| `serverColorTheme`         | `string`                                        | -       |
| `systemThemeMode`          | `'css' \| 'js'`                                 | `'css'` |
| `onServerThemeChange`      | `(theme: Theme) => void \| Promise<void>`       | -       |
| `onServerColorThemeChange` | `(colorTheme: string) => void \| Promise<void>` | -       |

### `TanStackStartThemeScript`

| Prop                | Type            | Default         |
| ------------------- | --------------- | --------------- |
| `storageKey`        | `string`        | `'theme'`       |
| `colorStorageKey`   | `string`        | `'color-theme'` |
| `defaultTheme`      | `Theme`         | `'system'`      |
| `defaultColorTheme` | `string`        | `'default'`     |
| `globalClassName`   | `string`        | `'dark'`        |
| `colorThemePrefix`  | `string`        | `'theme-'`      |
| `nonce`             | `string`        | -               |
| `systemThemeMode`   | `'css' \| 'js'` | `'js'`          |

### Server Helpers

```ts
import {
  buildServerThemeData,
  resolveThemeForServer,
  STORAGE_KEY,
  COLOR_STORAGE_KEY,
} from '@space-man/react-theme-animation'
```

- `buildServerThemeData()` converts raw cookie values into `{ theme, themePreference, colorTheme }`.
- `resolveThemeForServer()` preserves `'system'` for CSS-driven server rendering.
