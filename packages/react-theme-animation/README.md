# @space-man/react-theme-animation

React theme switching with smooth view transition animations, multi-theme support, and synchronized state management.

## Spaceman React Theme Animation v2 release

Version 2 moves the library into a workspace-friendly monorepo, keeps the published package name stable, and standardizes the public API around flat root imports.

Highlights in this release:

- root-first public API via `@space-man/react-theme-animation`
- framework-specific providers for Next.js, TanStack Start, and Vite
- TanStack SSR helpers exposed from the root package
- workspace examples for Next.js, TanStack Start, and TanStack Start SSR
- build and packaging updates for ESM, CJS, and declaration output

## Installation

```bash
npm install @space-man/react-theme-animation
```

```bash
pnpm add @space-man/react-theme-animation
```

```bash
yarn add @space-man/react-theme-animation
```

## Imports

Import everything from the package root:

```tsx
import {
  NextThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
  ThemeSwitcher,
  ThemeSelector,
  useThemeAnimation,
} from '@space-man/react-theme-animation'
```

Compatibility subpath exports still exist for migration safety, but the package root is the documented public API.

For Next.js App Router, import providers/hooks from the package root inside client components. A
typical setup is a local `app/providers.tsx` file with `'use client'`, rendered by the server
`app/layout.tsx`.

## Tailwind Setup For Prebuilt Components

`ThemeSwitcher`, `ThemeSelector`, and the bundled select primitives use Tailwind utility classes. The package does not ship a compiled stylesheet for those components, so the consuming app must include the installed package in Tailwind's source scan.

For Tailwind v4, add an `@source` directive next to your Tailwind import:

```css
@import 'tailwindcss';
@source '../node_modules/@space-man/react-theme-animation/dist';
```

Adjust the relative path to match your app structure.

## Provider Selection

Choose the right provider for your framework:

| Provider              | Best For                       | Key Features                                      |
| --------------------- | ------------------------------ | ------------------------------------------------- |
| SpacemanThemeProvider | General React apps             | Universal provider with synchronized theme state  |
| NextThemeProvider     | Next.js, Remix, SSR frameworks | Pre-hydration script, CSP support, animations     |
| TanStackThemeProvider | TanStack Start apps            | Cookie SSR, pre-hydration script, system CSS mode |
| ViteThemeProvider     | Vite React SPAs                | Lightweight, transition control, no SSR overhead  |

## Quick Start

```tsx
import {
  SpacemanThemeProvider,
  useSpacemanTheme,
} from '@space-man/react-theme-animation'

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

## Documentation

Repository documentation, framework guides, migration notes, and examples are linked from the GitHub docs hub:

- https://github.com/tonyedgal/spaceman-react-theme-animation#documentation

## API Reference

### Shared Hook Return (All Providers)

All providers expose the same core hook interface:

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

### Root Exports

The root package exports:

- providers and framework hooks
- prebuilt `ThemeSwitcher` and `ThemeSelector`
- `useThemeAnimation`
- shared types and animation utilities
- TanStack server helpers such as `buildServerThemeData`, `STORAGE_KEY`, and `COLOR_STORAGE_KEY`

See the repository docs hub for provider-specific setup guides and examples.

## License

MIT
