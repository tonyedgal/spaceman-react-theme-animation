---
'@space-man/react-theme-animation': minor
---

Add a `nonce` prop to the hook and every provider. The base, keyframe fallback, logo, and `disableTransitionOnChange` `<style>` elements use it, so transitions work under a nonce-based `style-src` policy. Add `disableTransitionOnChange` to `TanStackThemeProvider` and `SpacemanThemeProvider`. Accept animation names as string literals, such as `'circle'`, for `animationType`.

Keep circle, triangle, blurred circle, and gradient reveals on the clicked element when the root element is zoomed. Let a rejected theme change retry the same theme. Ignore stale stored themes and color themes in the Next.js and TanStack Start pre-hydration scripts; `TanStackStartThemeScript` accepts `themes` and `colorThemes` for this check. Freeze CSS transitions for palette changes in the Vite and Next.js providers when `disableTransitionOnChange` is set. Remove the transition freeze only after React applies the new theme class, so CSS transitions no longer run in Firefox and WebKit. Write server theme values to storage once, after hydration. Keep the system theme in state and update it from the media query listener.

Document that `TanStackThemeProvider` defaults `systemThemeMode` to `'css'` and `TanStackStartThemeScript` defaults it to `'js'`.
