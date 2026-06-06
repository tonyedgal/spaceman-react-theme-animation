# Vite React SPA Setup Guide

Complete guide for using `@space-man/react-theme-animation` in Vite-based React single-page applications.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Recommended Imports

Import everything from the package root:

```tsx
import {
  ViteThemeProvider,
  useViteTheme,
} from '@space-man/react-theme-animation'
```

## When To Use This Provider

Use `ViteThemeProvider` when you need:

- client-side theme persistence in a SPA
- animated view-transition theme switching
- optional transition disabling during theme changes
- multi-theme color variants without SSR-specific setup

## Basic Setup

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ViteThemeProvider } from '@space-man/react-theme-animation'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ViteThemeProvider defaultTheme="system" defaultColorTheme="default">
      <App />
    </ViteThemeProvider>
  </React.StrictMode>
)
```

## Theme Toggle Example

```tsx
import { useViteTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useViteTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

## Color Theme Example

```tsx
import { useViteTheme } from '@space-man/react-theme-animation'

export function ColorThemeButtons() {
  const { createColorThemeToggle, isColorThemeActive, colorTheme } =
    useViteTheme()

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
      <span>Current color: {colorTheme}</span>
    </div>
  )
}
```

## Provider Props

| Prop                        | Type                      | Default                       |
| --------------------------- | ------------------------- | ----------------------------- |
| `defaultTheme`              | `Theme`                   | `'system'`                    |
| `defaultColorTheme`         | `ColorTheme`              | `'default'`                   |
| `themes`                    | `Theme[]`                 | `['light', 'dark', 'system']` |
| `colorThemes`               | `ColorTheme[]`            | `['default']`                 |
| `animationType`             | `ThemeAnimationType`      | `CIRCLE`                      |
| `duration`                  | `number`                  | `750`                         |
| `attribute`                 | `'class' \| 'data-theme'` | `'class'`                     |
| `disableTransitionOnChange` | `boolean`                 | `false`                       |
| `storageKey`                | `string`                  | `'vite-theme'`                |
| `colorStorageKey`           | `string`                  | `'vite-color-theme'`          |
| `globalClassName`           | `string`                  | `'dark'`                      |
| `colorThemePrefix`          | `string`                  | `'theme-'`                    |

## Disable CSS Transitions During Theme Change

`disableTransitionOnChange` temporarily injects a style tag that disables CSS transitions during a theme switch.

```tsx
<ViteThemeProvider defaultTheme="system" disableTransitionOnChange>
  <App />
</ViteThemeProvider>
```

This helps prevent mixed transition artifacts when the app already uses CSS transitions heavily.

## Custom Animation Configuration

```tsx
import {
  ThemeAnimationType,
  ViteThemeProvider,
} from '@space-man/react-theme-animation'
;<ViteThemeProvider
  defaultTheme="system"
  defaultColorTheme="blue"
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple']}
  animationType={ThemeAnimationType.BLUR_CIRCLE}
  duration={750}
  storageKey="my-vite-theme"
  colorStorageKey="my-vite-color-theme"
>
  <App />
</ViteThemeProvider>
```

## Complete Example

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ThemeAnimationType,
  ViteThemeProvider,
} from '@space-man/react-theme-animation'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ViteThemeProvider
      defaultTheme="system"
      defaultColorTheme="default"
      colorThemes={['default', 'blue', 'green', 'purple']}
      animationType={ThemeAnimationType.CIRCLE}
      duration={500}
      disableTransitionOnChange
    >
      <App />
    </ViteThemeProvider>
  </React.StrictMode>
)
```

```tsx
// src/App.tsx
import { useViteTheme } from '@space-man/react-theme-animation'

export default function App() {
  const { theme, toggleTheme, ref } = useViteTheme()

  return (
    <div>
      <button ref={ref} onClick={() => toggleTheme()}>
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  )
}
```

## CSS Setup

Define your CSS variables in your global stylesheet:

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

### Theme Resets On Reload

Make sure the app can access `localStorage`. If storage is unavailable, preferences will fall back to the defaults.

### Animations Not Running

Check:

1. browser support for the View Transitions API
2. whether the triggering element has the returned `ref`
3. whether reduced motion is enabled in the OS/browser

### Theme Change Looks Too Busy

If your app already has a lot of CSS transitions, try enabling `disableTransitionOnChange`.

## Reference Example

- `apps/examples/example-tanstack` for a root-level provider setup in a Vite-based app shell

## See Also

- [Next.js / SSR Setup](./nextjs-setup.md)
- [TanStack Start Setup](./tanstack-start-setup.md)
- [Package README](../README.md)
