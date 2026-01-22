---
'@space-man/react-theme-animation': minor
---

---

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
