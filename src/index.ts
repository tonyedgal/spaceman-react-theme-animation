export { useThemeAnimation } from './hooks/use-theme-animation'

export { ThemeSwitcher } from './components/ThemeSwitcher'
export { ThemeSelector } from './components/ThemeSelector'

export { SpacemanThemeProvider, useSpacemanTheme } from './components/SpacemanThemeProvider'

// Framework-specific optimized providers
export { NextThemeProvider, useNextTheme } from './components/NextThemeProvider'
export { TanStackThemeProvider, useTanStackTheme } from './components/TanStackThemeProvider'
export { ViteThemeProvider, useViteTheme } from './components/ViteThemeProvider'

export type {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeSwitcherProps,
  ThemeSelectorProps,
  Theme,
  ColorTheme,
  SlideDirection,
} from './types'

export { ThemeAnimationType } from './types'

export {
  injectBaseStyles,
  getSystemTheme,
  resolveTheme,
  supportsViewTransitions,
  prefersReducedMotion,
} from './utils/animations'
