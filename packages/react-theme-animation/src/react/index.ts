export { useThemeAnimation } from './hooks/use-theme-animation'

export { ThemeSwitcher } from './components/ThemeSwitcher'

export { ThemeSelector } from './components/ThemeSelector'

export {
  SpacemanThemeProvider,
  useSpacemanTheme,
} from './components/SpacemanThemeProvider'

export {
  NextThemeProvider,
  ThemeProvider,
  useNextTheme,
  useTheme,
} from './components/NextThemeProvider'

export {
  TanStackStartThemeScript,
  TanStackThemeProvider,
  useTanStackTheme,
} from './components/TanStackThemeProvider'

export { ViteThemeProvider, useViteTheme } from './components/ViteThemeProvider'

export type {
  ColorTheme,
  SlideDirection,
  SystemThemeMode,
  Theme,
  ThemeSelectorProps,
  ThemeSwitcherProps,
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
} from '../core/types'

export { ThemeAnimationType } from '../core/types'

export {
  getSystemTheme,
  injectBaseStyles,
  prefersReducedMotion,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
} from '../core/utils/animations'

export { useHydrated } from './hooks/use-hydrated'
