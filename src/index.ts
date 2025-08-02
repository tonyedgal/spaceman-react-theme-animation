export { useThemeAnimation } from './hooks/use-theme-animation';

export { ThemeSwitcher } from './components/ThemeSwitcher';
export { ThemeSelector } from './components/ThemeSelector';

export type {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeSwitcherProps,
  ThemeSelectorProps,
  Theme,
  ColorTheme,
} from './types';

export { ThemeAnimationType } from './types';

export {
  injectBaseStyles,
  getSystemTheme,
  resolveTheme,
  supportsViewTransitions,
  prefersReducedMotion,
} from './utils/animations';
