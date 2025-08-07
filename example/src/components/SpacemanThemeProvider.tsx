'use client';

import React, { createContext, useContext, ReactNode } from 'react';
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
  // This is our master hook instance - the single source of truth
  const themeState = useThemeAnimation({
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
  });

  // Create a function to switch theme from a specific element
  const switchThemeFromElement = async (theme: Theme, element: HTMLButtonElement) => {
    // Temporarily set the ref to the clicked element
    if (themeState.ref.current) {
      const originalRef = themeState.ref.current;
      themeState.ref.current = element;
      await themeState.switchTheme(theme);
      // Restore the original ref after animation
      themeState.ref.current = originalRef;
    } else {
      themeState.ref.current = element;
      await themeState.switchTheme(theme);
    }
  };

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
    <SpacemanThemeContext.Provider value={contextValue}>
      {children}
    </SpacemanThemeContext.Provider>
  );
};

export const useSpacemanTheme = (): SpacemanThemeContextType => {
  const context = useContext(SpacemanThemeContext);
  if (context === undefined) {
    throw new Error('useSpacemanTheme must be used within a SpacemanThemeProvider');
  }
  return context;
};
