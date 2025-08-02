import { useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { 
  UseThemeAnimationProps, 
  UseThemeAnimationReturn, 
  ThemeAnimationType,
  Theme 
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
    
    themes = ['light', 'dark'],
    colorThemes = ['default'],
    defaultTheme = 'system',
    defaultColorTheme = 'default',
    
    globalClassName = 'dark',
    colorThemePrefix = 'theme-',
    
    theme: externalTheme,
    colorTheme: externalColorTheme,
    
    onThemeChange,
    onColorThemeChange,
  } = props;

  const isHighResolution = isBrowser && (window.innerWidth >= 3000 || window.innerHeight >= 2000);
  const duration = isHighResolution ? Math.max(propsDuration * 0.8, 500) : propsDuration;

  useEffect(() => {
    injectBaseStyles();
  }, []);

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (!isBrowser) return defaultTheme;
    const saved = localStorage.getItem('spaceman-theme') as Theme | null;
    return saved && themes.indexOf(saved) !== -1 ? saved : defaultTheme;
  });

  const [internalColorTheme, setInternalColorTheme] = useState(() => {
    if (!isBrowser) return defaultColorTheme;
    const saved = localStorage.getItem('spaceman-color-theme');
    return saved && colorThemes.indexOf(saved) !== -1 ? saved : defaultColorTheme;
  });

  const currentTheme = externalTheme ?? internalTheme;
  const currentColorTheme = externalColorTheme ?? internalColorTheme;

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme());
  const resolvedTheme = resolveTheme(currentTheme);

  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(getSystemTheme());
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const ref = useRef<HTMLButtonElement>(null);

  const setTheme = useCallback((newTheme: Theme) => {
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else {
      setInternalTheme(newTheme);
      if (isBrowser) {
        localStorage.setItem('spaceman-theme', newTheme);
      }
    }
  }, [onThemeChange]);

  const setColorTheme = useCallback((newColorTheme: string) => {
    if (onColorThemeChange) {
      onColorThemeChange(newColorTheme);
    } else {
      setInternalColorTheme(newColorTheme);
      if (isBrowser) {
        localStorage.setItem('spaceman-color-theme', newColorTheme);
      }
    }
  }, [onColorThemeChange]);

  const switchTheme = useCallback(async (newTheme: Theme) => {
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

    await (document as any).startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    if (animationType === ThemeAnimationType.CIRCLE) {
      createCircleAnimation(animationConfig);
    }
  }, [setTheme, duration, easing, animationType, blurAmount, styleId]);

  const toggleTheme = useCallback(async () => {
    const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    await switchTheme(newTheme);
  }, [resolvedTheme, switchTheme]);

  useEffect(() => {
    if (!isBrowser) return;

    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add(globalClassName);
    } else {
      root.classList.remove(globalClassName);
    }

    colorThemes.forEach(theme => {
      root.classList.remove(`${colorThemePrefix}${theme}`);
    });
    
    if (currentColorTheme !== 'default') {
      root.classList.add(`${colorThemePrefix}${currentColorTheme}`);
    }
  }, [resolvedTheme, currentColorTheme, globalClassName, colorThemePrefix, colorThemes]);

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
