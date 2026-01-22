# TanStack Start Setup Guide

Complete guide for integrating @space-man/react-theme-animation with TanStack Start applications.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Why TanStackThemeProvider?

TanStackThemeProvider is optimized for TanStack Start's isomorphic architecture:

- No pre-hydration script injection needed (isomorphic rendering handles theme on server)
- Uses `useSyncExternalStore` for optimal hydration safety
- Lightweight compared to SSR-focused providers
- Native integration with TanStack Start's rendering lifecycle

## Basic Setup

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackThemeProvider } from '@space-man/react-theme-animation'

export const Route = createRootRoute({
  component: () => (
    <TanStackThemeProvider defaultTheme="system" defaultColorTheme="default">
      <div className="app">
        <Outlet />
      </div>
    </TanStackThemeProvider>
  ),
})
```

## Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
import { useTanStackTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useTanStackTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()} className="theme-toggle">
      {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
    </button>
  )
}
```

## Layout with Theme Controls

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackThemeProvider } from '@space-man/react-theme-animation'
import { ThemeToggle } from '@/components/ThemeToggle'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <TanStackThemeProvider
      defaultTheme="system"
      defaultColorTheme="default"
      colorThemes={['default', 'blue', 'green', 'purple']}
    >
      <div className="app-layout">
        <header>
          <nav>
            <ThemeToggle />
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </TanStackThemeProvider>
  )
}
```

## Advanced Configuration

### Custom Animation Settings

```tsx
import { TanStackThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'

;<TanStackThemeProvider
  defaultTheme="system"
  defaultColorTheme="blue"
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple']}
  animationType={ThemeAnimationType.BLUR_CIRCLE}
  duration={750}
  storageKey="my-tanstack-theme"
  colorStorageKey="my-tanstack-color-theme"
>
  {children}
</TanStackThemeProvider>
```

### Using Pre-built Components

```tsx
import { ThemeSwitcher, ThemeSelector } from '@space-man/react-theme-animation'

function ThemeControls() {
  return (
    <div className="flex gap-4">
      <ThemeSwitcher themes={['light', 'dark', 'system']} />
      <ThemeSelector colorThemes={['default', 'blue', 'green', 'purple']} />
    </div>
  )
}
```

## Hydration-Safe Patterns

### Checking Hydration State

```tsx
import { useTanStackTheme } from '@space-man/react-theme-animation'

function ThemeAwareComponent() {
  const { theme, isHydrated } = useTanStackTheme()

  if (!isHydrated) {
    return <div>Loading theme...</div>
  }

  return <div>Current theme: {theme}</div>
}
```

### Conditional Rendering Based on Hydration

```tsx
function AnimationComponent() {
  const { isHydrated, theme } = useTanStackTheme()

  return (
    <div>
      {isHydrated ? <div className="animate-in">Theme: {theme}</div> : <div>Theme: {theme}</div>}
    </div>
  )
}
```

## Direct Theme Control

### Toggle Functions

```tsx
import { useTanStackTheme } from '@space-man/react-theme-animation'

function ThemeButtons() {
  const { toggleLightTheme, toggleDarkTheme, toggleTheme, theme } = useTanStackTheme()

  return (
    <div className="flex gap-2">
      <button onClick={() => toggleLightTheme()}>Light</button>
      <button onClick={() => toggleDarkTheme()}>Dark</button>
      <button onClick={() => toggleTheme()}>Toggle</button>
      <span>Current: {theme}</span>
    </div>
  )
}
```

### Color Theme Management

```tsx
function ColorThemeControls() {
  const { createColorThemeToggle, isColorThemeActive, colorTheme } = useTanStackTheme()

  return (
    <div className="grid grid-cols-2 gap-2">
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
      <button
        onClick={createColorThemeToggle('purple')}
        className={isColorThemeActive('purple') ? 'active' : ''}
      >
        Purple {isColorThemeActive('purple') ? '✓' : ''}
      </button>
      <span className="col-span-2">Active: {colorTheme}</span>
    </div>
  )
}
```

## CSS Variables Setup

Define your theme variables in your global CSS:

```css
/* src/styles.css */
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

.theme-purple {
  --primary: 262.1 83.3% 57.8%;
}

.theme-purple.dark {
  --primary: 263.4 70% 50.4%;
}
```

## Animation Control

Control when animations should run:

```tsx
const { switchTheme, toggleTheme } = useTanStackTheme()

// With animation (default)
await switchTheme('dark')

// Without animation for instant switching
await switchTheme('dark', true)
await toggleTheme(true)
```

## Complete Example

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'
import { useTanStackTheme } from '@space-man/react-theme-animation'
import '@/styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <TanStackThemeProvider
      defaultTheme="system"
      defaultColorTheme="default"
      colorThemes={['default', 'blue', 'green', 'purple']}
      animationType={ThemeAnimationType.CIRCLE}
      duration={500}
    >
      <AppLayout>
        <Outlet />
      </AppLayout>
    </TanStackThemeProvider>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <ThemeControls />
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

function ThemeControls() {
  const { toggleTheme, ref } = useTanStackTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()} className="px-4 py-2 rounded border">
      Toggle Theme
    </button>
  )
}
```

## Provider Props Reference

| Prop               | Type               | Default                     | Description                          |
| ------------------ | ------------------ | --------------------------- | ------------------------------------ |
| defaultTheme       | Theme              | 'system'                    | Initial theme                        |
| defaultColorTheme  | ColorTheme         | 'default'                   | Initial color theme                  |
| themes             | Theme[]            | ['light', 'dark', 'system'] | Available themes                     |
| colorThemes        | ColorTheme[]       | ['default']                 | Available color themes               |
| animationType      | ThemeAnimationType | CIRCLE                      | Animation type (CIRCLE, BLUR_CIRCLE) |
| duration           | number             | 500                         | Animation duration in ms             |
| storageKey         | string             | 'tanstack-theme'            | localStorage key for theme           |
| colorStorageKey    | string             | 'tanstack-color-theme'      | localStorage key for color theme     |
| globalClassName    | string             | ''                          | Additional class to apply globally   |
| colorThemePrefix   | string             | 'theme-'                    | Prefix for color theme classes       |
| onThemeChange      | function           | undefined                   | Callback when theme changes          |
| onColorThemeChange | function           | undefined                   | Callback when color theme changes    |

## Hook Return Reference

The `useTanStackTheme()` hook returns:

| Property               | Type                                                    | Description                        |
| ---------------------- | ------------------------------------------------------- | ---------------------------------- |
| theme                  | Theme                                                   | Current theme                      |
| colorTheme             | ColorTheme                                              | Current color theme                |
| resolvedTheme          | 'light' \| 'dark'                                       | Resolved theme (system → actual)   |
| systemTheme            | 'light' \| 'dark'                                       | OS theme preference                |
| isHydrated             | boolean                                                 | Client hydration state             |
| ref                    | RefObject<HTMLElement>                                  | Ref for animation origin           |
| setTheme               | (theme: Theme) => void                                  | Set theme instantly                |
| setColorTheme          | (colorTheme: ColorTheme) => void                        | Set color theme                    |
| switchTheme            | (theme: Theme, animationOff?: boolean) => Promise<void> | Switch with animation              |
| switchColorTheme       | (colorTheme: string) => void                            | Switch color theme with animation  |
| toggleTheme            | (animationOff?: boolean) => Promise<void>               | Toggle light/dark                  |
| toggleLightTheme       | (animationOff?: boolean) => Promise<void>               | Toggle to light                    |
| toggleDarkTheme        | (animationOff?: boolean) => Promise<void>               | Toggle to dark                     |
| toggleColorTheme       | () => void                                              | Toggle between color themes        |
| createColorThemeToggle | (colorTheme: string) => () => void                      | Create color theme toggle          |
| isColorThemeActive     | (colorTheme: string) => boolean                         | Check if color theme active        |
| switchThemeFromElement | (theme: Theme, element: HTMLElement) => Promise<void>   | Switch with animation from element |

## Common Issues

### Theme Not Persisting

Ensure you're not clearing localStorage. TanStackThemeProvider automatically persists theme choices.

### Animation Not Working

1. Check that `isHydrated` is true before expecting animations
2. Verify CSS variables are properly defined
3. Ensure browser supports View Transitions API (fallback animations will work regardless)

### Hydration Mismatch

TanStackThemeProvider uses `useSyncExternalStore` to prevent hydration mismatches. If you see warnings:

1. Verify you're using TanStackThemeProvider (not SpacemanThemeProvider)
2. Check that CSS is loaded before theme application
3. Ensure no conflicting theme-setting code

## See Also

- [Next.js / SSR Setup](./nextjs-setup.md)
- [Vite Setup](./vite-setup.md)
- [API Reference](../README.md#api-reference)
