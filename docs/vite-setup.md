# Vite React SPA Setup Guide

Complete guide for integrating @space-man/react-theme-animation with Vite-based React single-page applications.

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Why ViteThemeProvider?

ViteThemeProvider is optimized for client-side rendered SPAs:

- Lightweight with no SSR overhead
- Optional transition disabling for instant theme changes
- Simple API focused on client-side theme management
- Perfect for Vite, Create React App, and other SPA setups

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

## Theme Toggle Component

```tsx
// src/components/ThemeToggle.tsx
import { useViteTheme } from '@space-man/react-theme-animation'

export function ThemeToggle() {
  const { theme, toggleTheme, ref } = useViteTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()} className="theme-toggle">
      {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
    </button>
  )
}
```

## App Component with Theme Controls

```tsx
// src/App.tsx
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="app">
      <header>
        <nav>
          <h1>My App</h1>
          <ThemeToggle />
        </nav>
      </header>
      <main>
        <h2>Welcome!</h2>
        <p>Theme switching with smooth animations</p>
      </main>
    </div>
  )
}

export default App
```

## Advanced Configuration

### Custom Animation Settings

```tsx
import { ViteThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'
;<ViteThemeProvider
  defaultTheme="system"
  defaultColorTheme="blue"
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple']}
  animationType={ThemeAnimationType.BLUR_CIRCLE}
  duration={750}
  attribute="class"
  storageKey="my-vite-theme"
  colorStorageKey="my-vite-color-theme"
>
  <App />
</ViteThemeProvider>
```

### Disable Transitions During Theme Change

Useful for preventing CSS transition artifacts:

```tsx
<ViteThemeProvider defaultTheme="system" disableTransitionOnChange={true}>
  <App />
</ViteThemeProvider>
```

When enabled, this temporarily adds `[data-theme-transitioning]` attribute during theme switches to disable CSS transitions.

## Using Pre-built Components

### ThemeSwitcher

```tsx
import { ThemeSwitcher } from '@space-man/react-theme-animation'

function ThemeControls() {
  return (
    <div className="theme-controls">
      <ThemeSwitcher themes={['light', 'dark', 'system']} />
    </div>
  )
}
```

### ThemeSelector for Color Themes

```tsx
import { ThemeSelector } from '@space-man/react-theme-animation'

function ColorThemeSelector() {
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
import { useViteTheme } from '@space-man/react-theme-animation'

function ThemeButtons() {
  const { toggleLightTheme, toggleDarkTheme, toggleTheme, theme } = useViteTheme()

  return (
    <div className="flex gap-2">
      <button onClick={() => toggleLightTheme()}>Light Mode</button>
      <button onClick={() => toggleDarkTheme()}>Dark Mode</button>
      <button onClick={() => toggleTheme()}>Toggle</button>
      <span>Current: {theme}</span>
    </div>
  )
}
```

### Color Theme Management

```tsx
function ColorThemeControls() {
  const { createColorThemeToggle, isColorThemeActive, colorTheme } = useViteTheme()

  const themes = ['default', 'blue', 'green', 'purple', 'red']

  return (
    <div className="grid grid-cols-3 gap-2">
      {themes.map(t => (
        <button
          key={t}
          onClick={createColorThemeToggle(t)}
          className={isColorThemeActive(t) ? 'active' : ''}
        >
          {t} {isColorThemeActive(t) ? '✓' : ''}
        </button>
      ))}
      <span className="col-span-3">Active: {colorTheme}</span>
    </div>
  )
}
```

## CSS Variables Setup

Define theme variables in your global CSS:

```css
/* src/index.css */
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

.theme-red {
  --primary: 0 72.2% 50.6%;
}

.theme-red.dark {
  --primary: 0 62.8% 30.6%;
}

/* Optional: Disable transitions during theme change */
[data-theme-transitioning] * {
  transition: none !important;
}
```

## Animation Control

Control when animations should run:

```tsx
const { switchTheme, toggleTheme } = useViteTheme()

// With animation (default)
await switchTheme('dark')

// Without animation for instant switching
await switchTheme('dark', true)
await toggleTheme(true)
```

## Complete Example with Routing

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ViteThemeProvider, ThemeAnimationType } from '@space-man/react-theme-animation'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ViteThemeProvider
        defaultTheme="system"
        defaultColorTheme="default"
        colorThemes={['default', 'blue', 'green', 'purple']}
        animationType={ThemeAnimationType.CIRCLE}
        duration={500}
      >
        <App />
      </ViteThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

```tsx
// src/App.tsx
import { Routes, Route, Link } from 'react-router-dom'
import { useViteTheme } from '@space-man/react-theme-animation'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  const { toggleTheme, theme, ref } = useViteTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </div>
          <button ref={ref} onClick={() => toggleTheme()} className="px-4 py-2 rounded border">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
```

## Provider Props Reference

| Prop                      | Type               | Default                     | Description                                 |
| ------------------------- | ------------------ | --------------------------- | ------------------------------------------- |
| defaultTheme              | Theme              | 'system'                    | Initial theme                               |
| defaultColorTheme         | ColorTheme         | 'default'                   | Initial color theme                         |
| themes                    | Theme[]            | ['light', 'dark', 'system'] | Available themes                            |
| colorThemes               | ColorTheme[]       | ['default']                 | Available color themes                      |
| animationType             | ThemeAnimationType | CIRCLE                      | Animation type (CIRCLE, BLUR_CIRCLE)        |
| duration                  | number             | 500                         | Animation duration in ms                    |
| attribute                 | string             | 'class'                     | How to apply theme ('class' or 'data-\*')   |
| disableTransitionOnChange | boolean            | false                       | Disable CSS transitions during theme change |
| storageKey                | string             | 'vite-theme'                | localStorage key for theme                  |
| colorStorageKey           | string             | 'vite-color-theme'          | localStorage key for color theme            |
| globalClassName           | string             | ''                          | Additional class to apply globally          |
| colorThemePrefix          | string             | 'theme-'                    | Prefix for color theme classes              |
| onThemeChange             | function           | undefined                   | Callback when theme changes                 |
| onColorThemeChange        | function           | undefined                   | Callback when color theme changes           |

## Hook Return Reference

The `useViteTheme()` hook returns the same interface as other providers:

| Property               | Type                                                    | Description                        |
| ---------------------- | ------------------------------------------------------- | ---------------------------------- |
| theme                  | Theme                                                   | Current theme                      |
| colorTheme             | ColorTheme                                              | Current color theme                |
| resolvedTheme          | 'light' \| 'dark'                                       | Resolved theme (system → actual)   |
| systemTheme            | 'light' \| 'dark'                                       | OS theme preference                |
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

### Theme Flashing on Reload

The library handles theme persistence automatically. If you still see flashing, ensure CSS variables are defined before React loads.

### Animations Not Working

1. Verify browser supports View Transitions API (Chrome 111+, Edge 111+)
2. Check that CSS variables are properly defined
3. Ensure `ref` is attached to the triggering element

### localStorage Not Working

Check browser privacy settings. If localStorage is blocked, theme will reset on reload.

## TypeScript Support

Full TypeScript support is included:

```tsx
import type { Theme, ColorTheme } from '@space-man/react-theme-animation'

const myTheme: Theme = 'dark'
const myColorTheme: ColorTheme = 'blue'
```

## See Also

- [Next.js / SSR Setup](./nextjs-setup.md)
- [TanStack Start Setup](./tanstack-start-setup.md)
- [API Reference](../README.md#api-reference)
