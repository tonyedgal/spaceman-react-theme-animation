# @space-man/react-theme-animation

## 2.1.0

### Minor Changes

- b671cf5: ---

  ## "@space-man/react-theme-animation": minor
  - Add NextThemeProvider optimized for Next.js and SSR frameworks with pre-hydration script injection
  - Add TanStackThemeProvider optimized for TanStack Start with useHydrated() integration
  - Add ViteThemeProvider optimized for Vite React SPAs with lightweight client-only rendering
  - Revert SpacemanThemeProvider to basic provider without SSR optimizations
  - Add animationOff optional parameter to all theme toggle functions (switchTheme, toggleTheme, toggleLightTheme, toggleDarkTheme)
  - Enable instant theme switching without animations when needed
  - Add toggleLightTheme() function for direct toggle to light theme
  - Add toggleDarkTheme() function for direct toggle to dark theme
  - Add createColorThemeToggle() factory function for creating color theme toggles
  - Add isColorThemeActive() function to check if specific color theme is active
  - Add universal SSR support with pre-hydration script injection in NextThemeProvider
  - Add CSP support via nonce prop for inline script injection
  - Add disablePreHydrationScript prop to opt out of flash prevention
  - Add disableAnimationOnInit prop to skip animation during hydration
  - Add nonce prop (NextThemeProvider only)
  - Add disablePreHydrationScript prop (NextThemeProvider only)
  - Add disableAnimationOnInit prop (NextThemeProvider only)
  - Add disableTransitionOnChange prop (ViteThemeProvider only)
  - Add attribute prop for HTML attribute selection ('class' or 'data-theme')
  - Add globalClassName prop for dark theme class name
  - Add colorThemePrefix prop for color theme class prefix
  - Add storageKey and colorStorageKey props for localStorage customization
  - Add onThemeChange and onColorThemeChange callback props
  - Add Next.js / SSR Setup Guide with App Router, Pages Router, and CSP examples
  - Add TanStack Start Setup Guide with isomorphic rendering patterns
  - Add Vite React SPA Setup Guide with client-side setup and routing examples
  - Restructure README to highlight v2.1 features with 66% reduction in verbosity
  - Add Provider Selection Table comparing all framework-specific providers
  - Consolidate API Reference with shared hook interface table
  - SpacemanThemeProvider reverted to basic provider (use NextThemeProvider for SSR)
  - Hook renamed to useNextTheme() when using NextThemeProvider

## 2.0.0

### Major Changes

- 33abc9f: ## Spaceman React Theme Animation v2
  - Add a functions to direct toggle between different color themes
  - Update Vite Theme Provider to handle theme toggling and persistence
  - Add function to manage and check active themes
  - Add functions to toggle light and dark themes directly

## 1.1.1

### Patch Changes

- 61afead: Fix `SlideDirection` not being exported in `src/index.ts`
  - Added `SlideDirection` to the export list in `src/index.ts` to ensure it is available for external use.
  - Optimized GIFs in the README for better performance and visual quality.

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
