# @space-man/react-theme-animation

https://github.com/user-attachments/assets/2819cf70-c474-478e-b821-6b26457c8d4a

React theme switching with smooth view transition animations, multi-theme support, and synchronized state management.

## What's New in v2.1

- **animationOff Parameter**: Instantly switch themes without animation via optional parameter on all toggle functions
- **Universal SSR Support**: Pre-hydration script prevents flash in Next.js, Remix, and SSR frameworks
- **Three Framework-Specific Providers**: NextThemeProvider (SSR/Next.js), TanStackThemeProvider (TanStack Start), ViteThemeProvider (Vite SPAs)
- **Consistent Hook API**: All providers expose identical hook interface with 15+ methods
- **Enhanced Theme Control**: Direct functions for toggleLightTheme(), toggleDarkTheme(), createColorThemeToggle()

## Live Demo

[View Live Demo](https://spaceman-rta-vite.netlify.app/)

## Features

- Smooth view transition animations with customizable origins
- Multi-theme support (light, dark, system)
- Color theme variants (brand colors, custom themes)
- Three framework-optimized providers
- Powerful useThemeAnimation hook for custom implementations
- Ready-to-use ThemeSwitcher and ThemeSelector components
- State synchronization across components
- Full TypeScript support
- Performance optimized with reduced motion support

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Provider Selection

Choose the right provider for your framework:

| Provider              | Best For                       | Key Features                                     |
| --------------------- | ------------------------------ | ------------------------------------------------ |
| NextThemeProvider     | Next.js, Remix, SSR frameworks | Pre-hydration script, CSP support, animations    |
| TanStackThemeProvider | TanStack Start apps            | Isomorphic rendering, useHydrated() integration  |
| ViteThemeProvider     | Vite React SPAs                | Lightweight, transition control, no SSR overhead |

## Quick Start

Basic pattern that works across all providers:

```tsx
import { SpacemanThemeProvider, useSpacemanTheme } from '@space-man/react-theme-animation'

function App() {
  return (
    <SpacemanThemeProvider defaultTheme="system" defaultColorTheme="default">
      <YourApp />
    </SpacemanThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme, ref } = useSpacemanTheme()

  return (
    <button ref={ref} onClick={() => toggleTheme()}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
```

**Choose your framework setup guide:**

- **[Next.js / SSR Setup Guide](./docs/nextjs-setup.md)** - Complete guide with App Router, Pages Router, CSP support
- **[TanStack Start Setup Guide](./docs/tanstack-start-setup.md)** - Isomorphic rendering, hydration-safe patterns
- **[Vite React SPA Setup Guide](./docs/vite-setup.md)** - Client-side setup, flash prevention, routing

**[View Complete Examples](./example/)** - Next.js implementation with both hook and provider patterns

## API Reference

### Shared Hook Return (All Providers)

All providers expose the same hook interface:

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

### Provider Props

| Prop                      | Spaceman | NextTheme | TanStack | Vite | Type               | Default                     |
| ------------------------- | -------- | --------- | -------- | ---- | ------------------ | --------------------------- |
| defaultTheme              | ✓        | ✓         | ✓        | ✓    | Theme              | 'system'                    |
| defaultColorTheme         | ✓        | ✓         | ✓        | ✓    | ColorTheme         | 'default'                   |
| themes                    | ✓        | ✓         | ✓        | ✓    | Theme[]            | ['light', 'dark', 'system'] |
| colorThemes               | ✓        | ✓         | ✓        | ✓    | ColorTheme[]       | ['default']                 |
| animationType             | ✓        | ✓         | ✓        | ✓    | ThemeAnimationType | CIRCLE                      |
| duration                  | ✓        | ✓         | ✓        | ✓    | number             | 500                         |
| storageKey                | ✓        | ✓         | ✓        | ✓    | string             | varies                      |
| colorStorageKey           | ✓        | ✓         | ✓        | ✓    | string             | varies                      |
| nonce                     | ✗        | ✓         | ✗        | ✗    | string             | -                           |
| disablePreHydrationScript | ✗        | ✓         | ✗        | ✗    | boolean            | false                       |
| disableTransitionOnChange | ✗        | ✗         | ✗        | ✓    | boolean            | false                       |
| onThemeChange             | ✓        | ✓         | ✓        | ✓    | function           | -                           |
| onColorThemeChange        | ✓        | ✓         | ✓        | ✓    | function           | -                           |

### Components

**ThemeSwitcher**: Pre-built theme toggle buttons with animations  
**ThemeSelector**: Dropdown selector for color themes

See framework-specific guides for component usage examples.

---

<details>
<summary>CSS Variables Setup</summary>

Define theme variables in your global CSS file:

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

</details>

<details>
<summary>Browser Support</summary>

- View Transitions API: Chrome 111+, Edge 111+
- Fallback: All modern browsers with CSS transitions
- Reduced Motion: Respects prefers-reduced-motion
- Framework Support: React 16.8+ (hooks required)

</details>

<details>
<summary>Advanced Configuration</summary>

### Animation Control

```tsx
const { switchTheme, toggleTheme } = useSpacemanTheme()

// With animation (default)
await switchTheme('dark')

// Without animation
await switchTheme('dark', true)
await toggleTheme(true)
```

### Custom Hook Usage

```tsx
import { useThemeAnimation } from '@space-man/react-theme-animation'

const { theme, toggleTheme, ref } = useThemeAnimation({
  animationType: ThemeAnimationType.BLUR_CIRCLE,
  duration: 750,
  colorThemes: ['default', 'blue', 'green'],
  onThemeChange: theme => console.log('Theme:', theme),
})
```

</details>

## Contributing

Fork the repository, make your changes, and submit a merge request for review.

## License

MIT
