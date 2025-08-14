import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { Theme, ColorTheme, ThemeAnimationType } from '../types'

/**
 * Context type for the Spaceman Theme Provider
 */
interface SpacemanThemeContextType {
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  toggleTheme: () => Promise<void>
  switchTheme: (theme: Theme) => Promise<void>
  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>
  ref: React.RefObject<HTMLButtonElement | null>
}

const SpacemanThemeContext = createContext<SpacemanThemeContextType | undefined>(undefined)

/**
 * Props for the Spaceman Theme Provider
 */
interface SpacemanThemeProviderProps {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
}

/**
 * Spaceman Theme Provider - Provides centralized theme state management
 *
 * This provider creates a single source of truth for theme state using the useThemeAnimation hook.
 * All theme-related components should consume from this context to ensure synchronization.
 *
 * @param children - React children to wrap with theme context
 * @param themes - Available theme options (default: ['light', 'dark', 'system'])
 * @param colorThemes - Available color theme options (default: ['default'])
 * @param defaultTheme - Default theme to use (default: 'system')
 * @param defaultColorTheme - Default color theme to use (default: 'default')
 * @param animationType - Animation type for theme transitions (default: CIRCLE)
 * @param duration - Animation duration in milliseconds (default: 750)
 */
export const SpacemanThemeProvider: React.FC<SpacemanThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
}) => {
  const [mounted, setMounted] = useState(false)

  const themeState = useThemeAnimation({
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchThemeFromElement = async (theme: Theme, element: HTMLButtonElement) => {
    if (themeState.ref.current) {
      const originalRef = themeState.ref.current
      Object.defineProperty(themeState.ref, 'current', {
        value: element,
        writable: true,
        configurable: true,
      })
      await themeState.switchTheme(theme)
      Object.defineProperty(themeState.ref, 'current', {
        value: originalRef,
        writable: true,
        configurable: true,
      })
    } else {
      Object.defineProperty(themeState.ref, 'current', {
        value: element,
        writable: true,
        configurable: true,
      })
      await themeState.switchTheme(theme)
    }
  }

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
    }

    return (
      <SpacemanThemeContext.Provider value={loadingContextValue}>
        {children}
      </SpacemanThemeContext.Provider>
    )
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
  }

  return (
    <SpacemanThemeContext.Provider value={contextValue}>{children}</SpacemanThemeContext.Provider>
  )
}

/**
 * Hook to consume the Spaceman Theme context
 *
 * @returns Theme context value with all theme state and methods
 * @throws Error if used outside of SpacemanThemeProvider
 */
export const useSpacemanTheme = (): SpacemanThemeContextType => {
  const context = useContext(SpacemanThemeContext)
  if (context === undefined) {
    throw new Error('useSpacemanTheme must be used within a SpacemanThemeProvider')
  }
  return context
}
