import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'

import type {
  UseThemeAnimationProps,
  ThemeTransitionInput,
  ColorThemeToggle,
  Theme,
  ColorTheme,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { SharedThemeContext } from './shared-theme-context'

/**
 * Context type for the Spaceman Theme Provider
 */
interface SpacemanThemeContextType {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void

  switchTheme: (theme: Theme, options?: ThemeTransitionInput) => Promise<void>
  switchColorTheme: (
    colorTheme: string,
    options?: ThemeTransitionInput,
  ) => Promise<void>

  toggleTheme: (options?: ThemeTransitionInput) => Promise<void>
  toggleLightTheme: (options?: ThemeTransitionInput) => Promise<void>
  toggleDarkTheme: (options?: ThemeTransitionInput) => Promise<void>
  toggleColorTheme: ColorThemeToggle

  createColorThemeToggle: (targetColorTheme: string) => ColorThemeToggle
  isColorThemeActive: (targetColorTheme: string) => boolean

  switchThemeFromElement: (
    theme: Theme,
    element: HTMLButtonElement,
  ) => Promise<void>
}

const SpacemanThemeContext = createContext<
  SpacemanThemeContextType | undefined
>(undefined)

/**
 * Props for the Spaceman Theme Provider
 */
export type SpacemanThemeProviderProps = UseThemeAnimationProps & {
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
  ...animationOptions
}) => {
  const [mounted, setMounted] = useState(false)

  const themeState = useThemeAnimation({
    ...animationOptions,
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

  const switchThemeFromElement = async (
    theme: Theme,
    element: HTMLButtonElement,
  ) => {
    await themeState.switchTheme(theme, { element })
  }

  if (!mounted) {
    const loadingContextValue: SpacemanThemeContextType = {
      ref: { current: null },
      theme: defaultTheme,
      colorTheme: defaultColorTheme,
      resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
      setTheme: () => {},
      setColorTheme: () => {},

      switchTheme: async () => {},
      switchThemeFromElement: async () => {},
      switchColorTheme: async () => {},

      toggleTheme: async () => {},
      toggleLightTheme: async () => {},
      toggleDarkTheme: async () => {},
      toggleColorTheme: async () => {},

      createColorThemeToggle: () => async () => {},
      isColorThemeActive: () => false,
    }

    return (
      <SpacemanThemeContext.Provider value={loadingContextValue}>
        <SharedThemeContext.Provider value={loadingContextValue}>
          {children}
        </SharedThemeContext.Provider>
      </SpacemanThemeContext.Provider>
    )
  }

  const contextValue: SpacemanThemeContextType = {
    ref: themeState.ref,
    theme: themeState.theme,
    colorTheme: themeState.colorTheme,
    resolvedTheme: themeState.resolvedTheme,
    setTheme: themeState.setTheme,
    setColorTheme: themeState.setColorTheme,

    switchTheme: themeState.switchTheme,
    switchThemeFromElement,
    switchColorTheme: themeState.switchColorTheme,

    toggleTheme: themeState.toggleTheme,
    toggleLightTheme: themeState.toggleLightTheme,
    toggleDarkTheme: themeState.toggleDarkTheme,
    toggleColorTheme: themeState.toggleColorTheme,

    createColorThemeToggle: themeState.createColorThemeToggle,
    isColorThemeActive: themeState.isColorThemeActive,
  }

  return (
    <SpacemanThemeContext.Provider value={contextValue}>
      <SharedThemeContext.Provider value={contextValue}>
        {children}
      </SharedThemeContext.Provider>
    </SpacemanThemeContext.Provider>
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
    throw new Error(
      'useSpacemanTheme must be used within a SpacemanThemeProvider',
    )
  }

  return context
}
