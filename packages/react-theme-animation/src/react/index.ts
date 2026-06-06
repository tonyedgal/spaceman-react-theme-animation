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
} from '../core/types'

export { ThemeAnimationType } from '../core/types'

export {
  injectBaseStyles,
  getSystemTheme,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
  prefersReducedMotion,
} from '../core/utils/animations'
