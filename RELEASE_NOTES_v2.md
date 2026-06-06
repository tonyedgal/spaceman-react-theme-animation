# Release Notes: v2

## Summary

Version 2 moves `@space-man/react-theme-animation` into a workspace-based monorepo and standardizes the public API around root imports.

## Highlights

- root-first public API via `@space-man/react-theme-animation`
- framework-specific providers for Next.js, TanStack Start, and Vite
- TanStack SSR helpers exported from the package root
- monorepo example apps for Next.js, TanStack Start, and TanStack Start SSR
- explicit package exports with ESM, CJS, and type declarations

## Provider Updates

- `ThemeProvider` / `useTheme` added as the primary Next.js-style API
- `NextThemeProvider` / `useNextTheme` remain available
- `TanStackThemeProvider` supports cookie-based SSR and pre-hydration script setups
- `ViteThemeProvider` supports client-side persistence and optional transition disabling
- `SpacemanThemeProvider` remains the general-purpose baseline provider

## API Additions

- `toggleLightTheme()`
- `toggleDarkTheme()`
- `createColorThemeToggle()`
- `isColorThemeActive()`
- optional `animationOff` parameter on theme toggle helpers

## Documentation

- rewritten package README
- new Next.js, TanStack Start, and Vite setup guides
- root `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, and `MIGRATION.md`

## Migration

- prefer `@space-man/react-theme-animation` root imports for public APIs
- compatibility subpath exports still exist temporarily for migration safety
