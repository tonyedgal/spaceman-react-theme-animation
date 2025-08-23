# @space-man/react-theme-animation

## 1.1.0

### Minor Changes

- fe43109: Add slide animation to theme animation hook
  - Add slide animation options to the theme animation hook.
  - Add SlideDirection prop to the theme animation hook.
  - Update documentation to reflect new slide animation features.

## 1.0.4

### Patch Changes

- a54a5fe: Add a `ViteThemeProvider` and fix `Themeswitcher` component
  - This commit introduces a new `ViteThemeProvider` component that centralizes theme management for the `ThemeSelector` and `ThemeSwitcher` components in vite react SPAs.
  - It also fixes the `Themeswitcher` component to ensure it works correctly with motion library.

## 1.0.3

### Patch Changes

- daf14b0: Setup Prettier formatter in the project
  - This commit adds Prettier configuration and a GitHub Action to check formatting.

## 1.0.2

### Patch Changes

- cc37368: Fix hydration errors in Next.js
  - Ensure `SpacemanThemeProvider` only renders children after the component has mounted

## 1.0.1

### Patch Changes

- ea09895: Update documentation
  - Create a seperate `getting-started.md` guide for better clarity
  - Add detailed usage examples for `SpacemanThemeProvider`, `ThemeSwitcher`, and `ThemeSelector`
  - Include advanced configuration options and TypeScript support details
  - Ensure all examples are up-to-date with the latest API changes
  - Add an sample next.js app to demonstrate usage

- 96a65da: Initial release of @space-man/react-theme-animation with smooth view transition animations, multi-theme support, and comprehensive TypeScript support.

  Features:
  - 🎨 Smooth view transition animations for theme switching
  - 🌓 Multi-theme support (light, dark, system)
  - 🎯 Color theme variants
  - 🪝 Powerful useThemeAnimation hook
  - 🧩 Ready-to-use ThemeSwitcher and ThemeSelector components
  - 🎛️ Centralized state management with SpacemanThemeProvider
  - 🔄 State synchronization between components
  - 🔧 Full TypeScript support
