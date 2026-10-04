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
  TanStackStartThemeScript,
  TanStackThemeProvider,
  useTanStackTheme,
} from './react/components/TanStackThemeProvider'

export {
  ViteThemeProvider,
  useViteTheme,
} from './react/components/ViteThemeProvider'

export type {
  ColorTheme,
  SlideDirection,
  SystemThemeMode,
  Theme,
  ThemeSelectorProps,
  ThemeSwitcherProps,
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
} from './core/types'

export { ThemeAnimationType } from './core/types'

export {
  getSystemTheme,
  injectBaseStyles,
  prefersReducedMotion,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
} from './core/utils/animations'

export {
  COLOR_STORAGE_KEY,
  COLOR_THEME_PREFIX,
  GLOBAL_CLASS_NAME,
  STORAGE_KEY,
  buildServerThemeData,
} from './tanstack/helpers'

export type { ServerResolvedTheme, ServerThemeData } from './tanstack/helpers'

export type {
  AnimationPosition,
  ColorThemeToggle,
  ThemeAnimationOptions,
  ThemeLogoOptions,
  ThemeTransitionInput,
  ThemeTransitionOptions,
  TransitionDirection,
} from './core/types'

export { TRANSITION_DIRECTIONS } from './core/types'

export { preloadThemeLogo } from './core/logo'

export { useHydrated } from './react/hooks/use-hydrated'
