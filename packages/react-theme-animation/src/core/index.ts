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

export type {
  AnimationPosition,
  TransitionDirection,
  ThemeAnimationOptions,
  ThemeLogoOptions,
  ThemeTransitionOptions,
  ThemeTransitionInput,
  ColorThemeToggle,
} from './types'

export { TRANSITION_DIRECTIONS } from './types'

export { preloadThemeLogo } from './logo'
