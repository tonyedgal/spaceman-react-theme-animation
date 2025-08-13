import { useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeAnimationType,
  Theme,
} from '../types';
import {
  injectBaseStyles,
  resolveTheme,
  getSystemTheme,
  supportsViewTransitions,
  prefersReducedMotion,
  createCircleAnimation,
  createBlurCircleAnimation,
} from '../utils/animations';

const isBrowser = typeof window !== 'undefined';

export const useThemeAnimation = (props: UseThemeAnimationProps = {}): UseThemeAnimationReturn => {
  const {
    duration: propsDuration = 750,
    easing = 'ease-in-out',
    animationType = ThemeAnimationType.CIRCLE,
    blurAmount = 2,
    styleId = 'spaceman-theme-style',

    themes = ['light', 'dark', 'system'],
    colorThemes = ['default'],
    defaultTheme = 'system',
    defaultColorTheme = 'default',

    globalClassName = 'dark',
    colorThemePrefix = 'theme-',

    storageKey = 'theme',
    colorStorageKey = 'color-theme',

    theme: externalTheme,
    colorTheme: externalColorTheme,

    onThemeChange,
    onColorThemeChange,
  } = props;

  const isHighResolution = isBrowser && (window.innerWidth >= 3000 || window.innerHeight >= 2000);
  const duration = isHighResolution ? Math.max(propsDuration * 0.8, 500) : propsDuration;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    injectBaseStyles();
  }, []);

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (!isBrowser) return defaultTheme;
    return defaultTheme;
  });

  const [internalColorTheme, setInternalColorTheme] = useState(() => {
    if (!isBrowser) return defaultColorTheme;
    return defaultColorTheme;
  });

  useEffect(() => {
    setMounted(true);

    if (isBrowser && !externalTheme) {
      const saved = localStorage.getItem(storageKey) as Theme | null;
      if (saved && themes.indexOf(saved) !== -1) {
        setInternalTheme(saved);
      }
    }

    if (isBrowser && !externalColorTheme) {
      const saved = localStorage.getItem(colorStorageKey);
      if (saved && colorThemes.indexOf(saved) !== -1) {
        setInternalColorTheme(saved);
      }
    }
  }, []);

  const currentTheme = externalTheme ?? internalTheme;
  const currentColorTheme = externalColorTheme ?? internalColorTheme;

  const [, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());
  const resolvedTheme = resolveTheme(currentTheme);

  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(getSystemTheme());

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme classes to DOM
  useEffect(() => {
    if (!isBrowser || !mounted) return;

    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add(globalClassName);
    } else {
      document.documentElement.classList.remove(globalClassName);
    }

    colorThemes.forEach(theme => {
      document.documentElement.classList.remove(`${colorThemePrefix}${theme}`);
    });
    document.documentElement.classList.add(`${colorThemePrefix}${currentColorTheme}`);
  }, [resolvedTheme, currentColorTheme, globalClassName, colorThemePrefix, colorThemes, mounted]);

  const ref = useRef<HTMLButtonElement>(null);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      // Always save to localStorage
      if (isBrowser) {
        localStorage.setItem(storageKey, newTheme);
      }

      // Update internal state if no external control
      if (externalTheme === undefined) {
        setInternalTheme(newTheme);
      }

      // Call external callback if provided
      if (onThemeChange) {
        onThemeChange(newTheme);
      }
    },
    [onThemeChange, externalTheme, storageKey]
  );

  const setColorTheme = useCallback(
    (newColorTheme: string) => {
      // Always save to localStorage
      if (isBrowser) {
        localStorage.setItem(colorStorageKey, newColorTheme);
      }

      // Update internal state if no external control
      if (externalColorTheme === undefined) {
        setInternalColorTheme(newColorTheme);
      }

      // Call external callback if provided
      if (onColorThemeChange) {
        onColorThemeChange(newColorTheme);
      }
    },
    [onColorThemeChange, externalColorTheme, colorStorageKey]
  );

  const switchTheme = useCallback(
    async (newTheme: Theme) => {
      if (!ref.current || !supportsViewTransitions() || prefersReducedMotion()) {
        setTheme(newTheme);
        return;
      }

      const { top, left, width, height } = ref.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;

      const animationConfig = {
        x,
        y,
        duration,
        easing,
        animationType,
        blurAmount,
        styleId,
      };

      if (animationType === ThemeAnimationType.BLUR_CIRCLE) {
        createBlurCircleAnimation(animationConfig);
      }

      await (document as Document).startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      }).ready;

      if (animationType === ThemeAnimationType.CIRCLE) {
        createCircleAnimation(animationConfig);
      }
    },
    [setTheme, duration, easing, animationType, blurAmount, styleId]
  );

  const toggleTheme = useCallback(async () => {
    const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    await switchTheme(newTheme);
  }, [resolvedTheme, switchTheme]);

  return {
    ref,
    theme: currentTheme,
    colorTheme: currentColorTheme,
    resolvedTheme,
    setTheme,
    setColorTheme,
    toggleTheme,
    switchTheme,
  };
};
