---
'@space-man/react-theme-animation': patch
---

Expose `colorThemes` from `useThemeAnimation` and every provider context (Spaceman, Next, Vite and TanStack). The value is the resolved list, so it is `['default']` when the prop is not set, and it is also present before hydration. A theme picker can now read the list from `useTheme()` instead of keeping a second copy.
