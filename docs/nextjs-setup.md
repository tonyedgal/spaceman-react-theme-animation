# Next.js / SSR Setup Guide

Complete guide for integrating @space-man/react-theme-animation with Next.js and other SSR frameworks.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Basic Setup

NextThemeProvider is optimized for SSR frameworks with pre-hydration script injection to prevent flash of wrong theme.

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { NextThemeProvider } from '@space-man/react-theme-animation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemeProvider defaultTheme="system" defaultColorTheme="default">
          {children}
        </NextThemeProvider>
      </body>
    </html>
  )
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { NextThemeProvider } from '@space-man/react-theme-animation'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider defaultTheme="system" defaultColorTheme="default">
      <Component {...pageProps} />
    </NextThemeProvider>
  )
}
```

## Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
'use client' // Required for App Router

import { useNextTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useNextTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()} className="theme-toggle">
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

## Advanced Configuration

### Content Security Policy (CSP)

If your app uses CSP headers, pass a `nonce` to the provider:

```tsx
// app/layout.tsx
import { headers } from 'next/headers'
import { NextThemeProvider } from '@space-man/react-theme-animation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get('x-nonce')

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemeProvider defaultTheme="system" nonce={nonce || undefined}>
          {children}
        </NextThemeProvider>
      </body>
    </html>
  )
}
```

### Disable Pre-Hydration Script

If you prefer to handle theme initialization yourself:

```tsx
<NextThemeProvider defaultTheme="system" disablePreHydrationScript={true}>
  {children}
</NextThemeProvider>
```

### Custom Animation Configuration

```tsx
import { NextThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'
;<NextThemeProvider
  defaultTheme="system"
  defaultColorTheme="blue"
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple']}
  animationType={ThemeAnimationType.BLUR_CIRCLE}
  duration={750}
  blurAmount={3}
  storageKey="my-app-theme"
  colorStorageKey="my-app-color-theme"
>
  {children}
</NextThemeProvider>
```

## Using Pre-built Components

### ThemeSwitcher

```tsx
'use client'

import { ThemeSwitcher } from '@space-man/react-theme-animation'

export function ThemeControls() {
  return (
    <div className="theme-controls">
      <ThemeSwitcher themes={['light', 'dark', 'system']} />
    </div>
  )
}
```

### ThemeSelector for Color Themes

```tsx
'use client'

import { ThemeSelector } from '@space-man/react-theme-animation'

export function ColorThemeSelector() {
  return (
    <ThemeSelector
      colorThemes={['default', 'blue', 'green', 'purple', 'red']}
      className="color-theme-selector"
    />
  )
}
```

## Direct Theme Control

### Toggle Functions

```tsx
'use client'

import { useNextTheme } from '@space-man/react-theme-animation'

export function ThemeControls() {
  const { toggleLightTheme, toggleDarkTheme, theme } = useNextTheme()

  return (
    <div className="flex gap-2">
      <button onClick={() => toggleLightTheme()}>Light Mode</button>
      <button onClick={() => toggleDarkTheme()}>Dark Mode</button>
      <span>Current: {theme}</span>
    </div>
  )
}
```

### Color Theme Toggles

```tsx
'use client'

import { useNextTheme } from '@space-man/react-theme-animation'

export function ColorThemeButtons() {
  const { createColorThemeToggle, isColorThemeActive } = useNextTheme()

  return (
    <div className="flex gap-2">
      <button
        onClick={createColorThemeToggle('blue')}
        className={isColorThemeActive('blue') ? 'active' : ''}
      >
        Blue {isColorThemeActive('blue') ? '✓' : ''}
      </button>
      <button
        onClick={createColorThemeToggle('green')}
        className={isColorThemeActive('green') ? 'active' : ''}
      >
        Green {isColorThemeActive('green') ? '✓' : ''}
      </button>
    </div>
  )
}
```

## CSS Variables Setup

Define theme variables in your global CSS file:

```css
/* app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
}

/* Color theme variants */
.theme-blue {
  --primary: 221.2 83.2% 53.3%;
}

.theme-blue.dark {
  --primary: 217.2 91.2% 59.8%;
}

.theme-green {
  --primary: 142.1 76.2% 36.3%;
}

.theme-green.dark {
  --primary: 142.1 70.6% 45.3%;
}
```

## Animation Control

Disable animation for instant theme switches:

```tsx
const { switchTheme, toggleTheme } = useNextTheme()

// With animation (default)
await switchTheme('dark')

// Without animation
await switchTheme('dark', true)
await toggleTheme(true)
```

## Complete Example

```tsx
// app/layout.tsx
import { NextThemeProvider } from '@space-man/react-theme-animation'
import { ThemeToggle } from '@/components/ThemeToggle'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemeProvider
          defaultTheme="system"
          defaultColorTheme="default"
          colorThemes={['default', 'blue', 'green']}
        >
          <nav>
            <ThemeToggle />
          </nav>
          <main>{children}</main>
        </NextThemeProvider>
      </body>
    </html>
  )
}
```

```tsx
// components/ThemeToggle.tsx
'use client'

import { useNextTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useNextTheme()

  return (
    <button
      ref={ref}
      onClick={() => toggleTheme()}
      className="px-4 py-2 rounded-md border"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

## Provider Props Reference

| Prop                      | Type               | Default                     | Description                               |
| ------------------------- | ------------------ | --------------------------- | ----------------------------------------- |
| defaultTheme              | Theme              | 'system'                    | Initial theme                             |
| defaultColorTheme         | ColorTheme         | 'default'                   | Initial color theme                       |
| themes                    | Theme[]            | ['light', 'dark', 'system'] | Available themes                          |
| colorThemes               | ColorTheme[]       | ['default']                 | Available color themes                    |
| animationType             | ThemeAnimationType | CIRCLE                      | Animation type (CIRCLE, BLUR_CIRCLE)      |
| duration                  | number             | 500                         | Animation duration in ms                  |
| blurAmount                | number             | 2                           | Blur amount for blur-circle animation     |
| storageKey                | string             | 'spaceman-theme'            | localStorage key for theme                |
| colorStorageKey           | string             | 'spaceman-color-theme'      | localStorage key for color theme          |
| attribute                 | string             | 'class'                     | How to apply theme ('class' or 'data-\*') |
| globalClassName           | string             | ''                          | Additional class to apply globally        |
| colorThemePrefix          | string             | 'theme-'                    | Prefix for color theme classes            |
| nonce                     | string             | undefined                   | CSP nonce for script tag                  |
| disablePreHydrationScript | boolean            | false                       | Disable pre-hydration script injection    |
| disableAnimationOnInit    | boolean            | true                        | Disable animation on initial mount        |
| onThemeChange             | function           | undefined                   | Callback when theme changes               |
| onColorThemeChange        | function           | undefined                   | Callback when color theme changes         |

## Common Issues

### Hydration Mismatch

Make sure to add `suppressHydrationWarning` to the `<html>` tag:

```tsx
<html lang="en" suppressHydrationWarning>
```

### Theme Flashing on Load

This shouldn't happen with NextThemeProvider. If you see flashing:

1. Ensure you're not disabling the pre-hydration script
2. Check that CSS variables are defined for all theme combinations
3. Verify there are no conflicting theme-setting scripts

### Client Component Required

In Next.js App Router, components using `useNextTheme()` must have `'use client'` directive.

## See Also

- [TanStack Start Setup](./tanstack-start-setup.md)
- [Vite Setup](./vite-setup.md)
- [API Reference](../README.md#api-reference)
