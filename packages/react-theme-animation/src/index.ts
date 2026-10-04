export { useThemeAnimation } from './react/hooks/use-theme-animation'

export { ThemeSwitcher } from './react/components/ThemeSwitcher'
export { ThemeSelector } from './react/components/ThemeSelector'

export {
  SpacemanThemeProvider,
  useSpacemanTheme,
} from './react/components/SpacemanThemeProvider'

// Framework-specific optimized providers
export {
  NextThemeProvider,
  ThemeProvider,
  useNextTheme,
  useTheme,
} from './react/components/NextThemeProvider'
export {
  TanStackThemeProvider,
  TanStackStartThemeScript,
  useTanStackTheme,
} from './react/components/TanStackThemeProvider'
export {
  ViteThemeProvider,
  useViteTheme,
} from './react/components/ViteThemeProvider'

export type {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeSwitcherProps,
  ThemeSelectorProps,
  Theme,
  ColorTheme,
  SystemThemeMode,
  SlideDirection,
} from './core/types'

export { ThemeAnimationType } from './core/types'

export {
  injectBaseStyles,
  getSystemTheme,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
  prefersReducedMotion,
} from './core/utils/animations'

export {
  buildServerThemeData,
  STORAGE_KEY,
  COLOR_STORAGE_KEY,
  GLOBAL_CLASS_NAME,
  COLOR_THEME_PREFIX,
} from './tanstack/helpers'

export type { ServerResolvedTheme, ServerThemeData } from './tanstack/helpers'
