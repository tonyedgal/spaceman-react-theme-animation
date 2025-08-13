'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useThemeAnimation } from '../hooks/useThemeAnimation';
import { Theme, ColorTheme, ThemeAnimationType } from '../types';

interface SpacemanThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleTheme: () => Promise<void>;
  switchTheme: (theme: Theme) => Promise<void>;
  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>;
  ref: React.RefObject<HTMLButtonElement | null>;
}

const SpacemanThemeContext = createContext<SpacemanThemeContextType | undefined>(undefined);

interface SpacemanThemeProviderProps {
  children: ReactNode;
  themes?: Theme[];
  colorThemes?: ColorTheme[];
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  animationType?: ThemeAnimationType;
  duration?: number;
}

export const SpacemanThemeProvider: React.FC<SpacemanThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
}) => {
  const [mounted, setMounted] = useState(false);

  const themeState = useThemeAnimation({
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchThemeFromElement = async (theme: Theme, element: HTMLButtonElement) => {
    if (themeState.ref.current) {
      const originalRef = themeState.ref.current;
      themeState.ref.current = element;
      await themeState.switchTheme(theme);
      themeState.ref.current = originalRef;
    } else {
      themeState.ref.current = element;
      await themeState.switchTheme(theme);
    }
  };

  if (!mounted) {
    const loadingContextValue: SpacemanThemeContextType = {
      theme: defaultTheme,
      colorTheme: defaultColorTheme,
      resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
      setTheme: () => {},
      setColorTheme: () => {},
      toggleTheme: async () => {},
      switchTheme: async () => {},
      switchThemeFromElement: async () => {},
      ref: { current: null },
    };

    return (
      <SpacemanThemeContext.Provider value={loadingContextValue}>
        {children}
      </SpacemanThemeContext.Provider>
    );
  }

  const contextValue: SpacemanThemeContextType = {
    theme: themeState.theme,
    colorTheme: themeState.colorTheme,
    resolvedTheme: themeState.resolvedTheme,
    setTheme: themeState.setTheme,
    setColorTheme: themeState.setColorTheme,
    toggleTheme: themeState.toggleTheme,
    switchTheme: themeState.switchTheme,
    switchThemeFromElement,
    ref: themeState.ref,
  };

  return (
    <SpacemanThemeContext.Provider value={contextValue}>{children}</SpacemanThemeContext.Provider>
  );
};

export const useSpacemanTheme = (): SpacemanThemeContextType => {
  const context = useContext(SpacemanThemeContext);
  if (context === undefined) {
    throw new Error('useSpacemanTheme must be used within a SpacemanThemeProvider');
  }
  return context;
};
