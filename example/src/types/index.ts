import { RefObject } from 'react';

export enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
}

export type Theme = 'light' | 'dark' | 'system';
export type ColorTheme = string;

export interface UseThemeAnimationProps {
  duration?: number;
  easing?: string;
  animationType?: ThemeAnimationType;
  blurAmount?: number;
  styleId?: string;

  themes?: Theme[];
  colorThemes?: ColorTheme[];
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;

  globalClassName?: string;
  colorThemePrefix?: string;

  storageKey?: string;
  colorStorageKey?: string;

  theme?: Theme;
  colorTheme?: ColorTheme;

  onThemeChange?: (theme: Theme) => void;
  onColorThemeChange?: (colorTheme: ColorTheme) => void;
}

export interface UseThemeAnimationReturn {
  ref: RefObject<HTMLButtonElement | null>;

  theme: Theme;
  colorTheme: ColorTheme;
  resolvedTheme: 'light' | 'dark';

  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;

  toggleTheme: () => Promise<void>;
  switchTheme: (theme: Theme) => Promise<void>;
}

export interface ThemeSwitcherProps {
  themes?: Theme[];
  currentTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;

  animationType?: ThemeAnimationType;
  duration?: number;

  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';

  icons?: {
    light?: React.ReactNode;
    dark?: React.ReactNode;
    system?: React.ReactNode;
  };
}

export interface ThemeSelectorProps {
  themes?: Theme[];
  colorThemes?: ColorTheme[];
  currentTheme?: Theme;
  currentColorTheme?: ColorTheme;

  onThemeChange?: (theme: Theme) => void;
  onColorThemeChange?: (colorTheme: ColorTheme) => void;

  animationType?: ThemeAnimationType;
  duration?: number;

  className?: string;
  placeholder?: string;

  themeLabel?: string;
  colorThemeLabel?: string;
}
