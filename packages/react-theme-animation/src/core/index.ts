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

export type {
  AnimationPosition,
  ColorThemeToggle,
  ThemeAnimationOptions,
  ThemeLogoOptions,
  ThemeTransitionInput,
  ThemeTransitionOptions,
  TransitionDirection,
} from './types'

export { TRANSITION_DIRECTIONS } from './types'

export { preloadThemeLogo } from './logo'
