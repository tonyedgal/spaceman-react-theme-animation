export type {
  ColorTheme,
  SlideDirection,
  SystemThemeMode,
  Theme,
  ThemeSelectorProps,
  ThemeSwitcherProps,
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
} from './types'

export { ThemeAnimationType } from './types'

export {
  getSystemTheme,
  injectBaseStyles,
  prefersReducedMotion,
  resolveTheme,
  resolveThemeForServer,
  supportsViewTransitions,
} from './utils/animations'
