export { useThemeAnimation } from './hooks/use-theme-animation'

export { ThemeSwitcher } from './components/ThemeSwitcher'
export { ThemeSelector } from './components/ThemeSelector'

export { SpacemanThemeProvider, useSpacemanTheme } from './components/SpacemanThemeProvider'

// Framework-specific optimized providers
export { NextThemeProvider, useNextTheme } from './components/NextThemeProvider'
export {
  TanStackThemeProvider,
  TanStackStartThemeScript,
  useTanStackTheme,
} from './components/TanStackThemeProvider'
export { ViteThemeProvider, useViteTheme } from './components/ViteThemeProvider'

export type {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeSwitcherProps,
  ThemeSelectorProps,
  Theme,
  ColorTheme,
  SystemThemeMode,
  SlideDirection,
} from './types'

export { ThemeAnimationType } from './types'

export {
  injectBaseStyles,
  getSystemTheme,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
  prefersReducedMotion,
} from './utils/animations'

export {
  buildServerThemeData,
  STORAGE_KEY,
  COLOR_STORAGE_KEY,
  GLOBAL_CLASS_NAME,
  COLOR_THEME_PREFIX,
} from './tanstack'

export type { ServerResolvedTheme, ServerThemeData } from './tanstack'
