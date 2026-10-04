# Theme transitions

Mode and palette changes share the same native View Transition lifecycle. `setTheme` and `setColorTheme` remain immediate setters; `switchTheme`, `switchColorTheme`, and the toggle helpers return promises for the state update and capture readiness. They do not wait for the entire visual playback.

```tsx
const theme = useThemeAnimation({
  colorThemes: ['default', 'ocean', 'rose'],
  animationType: ThemeAnimationType.CIRCLE,
  duration: 750,
})

<button onClick={(event) => void theme.toggleTheme({
  element: event.currentTarget,
  animationOff: event.detail === 0,
})}>Toggle theme</button>
<button onClick={theme.createColorThemeToggle('ocean')}>Ocean</button>
```

All providers accept the hook's animation settings. Existing boolean arguments continue to work: `toggleTheme(true)` skips animation. Per-call options accept `element`, a viewport `origin: { x, y }`, and `animationOff`. Coordinates use CSS pixels and must never be multiplied by device pixel ratio. The rectangle is read before any asynchronous boundary, without replacing the React ref. The built-in selector uses its own trigger, and the built-in controls skip animation for keyboard activation.

## Effects and positions

Existing effects: `CIRCLE`, `BLUR_CIRCLE`, `SLIDE`.

New effects: `CLIP_PATH`, `POLYGON_GRADIENT`, `TRIANGLE`, `SVG_LOGO`.

`clipPathDirection` accepts `top-left`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, and `left`. `gradientWidth` sets the polygon wipe feather in CSS pixels (default 80). `animationPosition` accepts those eight positions, `center`, or `trigger`. Circle effects without an element or explicit position update immediately. Triangle and polygon effects can use a centered fallback. SVG logos always stay at the viewport center.

The blur circle uses a bounded radial gradient instead of a large filtered SVG surface. `blurAmount` sets a reveal-edge feather capped at 20 CSS pixels; zero uses the sharp circle. Requested durations are preserved on large and high-DPI displays. Browser compositor behavior varies; these effects do not promise compositor-only rendering or a hardware frame rate.

## Stationary SVG logos

```tsx
<NextThemeProvider
  animationType={ThemeAnimationType.SVG_LOGO}
  logoLight='/logo-light.svg'
  logoDark='/logo-dark.svg'
  logoWidth={120}
  logoHeight='auto'
>
  {children}
</NextThemeProvider>
```

Choose either `logo` or both `logoLight` and `logoDark`. The pair selects the destination mode's asset. Incomplete pairs and mixed configurations are rejected in TypeScript and at runtime. Assets preload outside capture; `preloadThemeLogo(url)` is also exported. Failed or unavailable SVG assets fall back to the centered circle without delaying the theme update.

Dimensions accept positive CSS-pixel numbers or `"auto"`. One numeric dimension preserves the intrinsic aspect ratio when the other is omitted or `"auto"`. Both `"auto"` use the intrinsic SVG size. Both omitted retain a default width of 96 pixels. The logo has a separate fixed snapshot above the page reveal; it does not scale with the circle.

## Lifecycle and verification

Transitions are coordinated per document across hooks. A new request skips the previous visual transition while every requested state update still runs once. Reduced motion, hidden documents, unsupported APIs, skipped captures, and unsupported pseudo-element animation preserve the state update and clean up temporary layers. Native CSS pseudo animation supplies a fallback when an engine accepts WAAPI targeting without painting it.

Run `pnpm --filter @space-man/react-theme-animation test:browser` for Chromium at DPR 1–3, WebKit, and Firefox. The inspection gallery supports slowed/frozen playback, explicit origins, SVG upload, dimensions, and direction selection. The browser suite checks rendered snapshot corners, transformed/scrolled triggers, CSS zoom, palette updates, interruption, reduced motion, and asset selection. Firefox screenshot assertions that cannot capture active view transitions are skipped; its behavioral checks still run.

References: [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect), [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

Verified in this worktree: 214 browser checks passed, with 11 Firefox screenshot checks skipped, plus all four workspace builds, package import smoke checks, runtime logo validation, public API type checks, and formatting. Full Oxlint currently reports 2,299 diagnostics; complete rule remediation remains outstanding.
