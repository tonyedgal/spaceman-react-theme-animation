import type { ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useHydrated } from '../hooks/use-hydrated'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { withElementAsRef } from './provider-helpers'
import { SharedThemeContext } from './shared-theme-context'

const defaultThemes = ['light', 'dark', 'system'] as const

const defaultColorThemes = ['default'] as const

/**
 * Context type for the Spaceman Theme Provider
 */
interface SpacemanThemeContextType {
  readonly ref: React.RefObject<HTMLButtonElement | null>
  readonly theme: Theme
  readonly colorTheme: ColorTheme
  readonly resolvedTheme: 'light' | 'dark'
  readonly setTheme: (theme: Theme) => void
  readonly setColorTheme: (colorTheme: ColorTheme) => void

  readonly switchTheme: (theme: Theme) => Promise<void>
  readonly switchColorTheme: (colorTheme: string) => void

  readonly toggleTheme: () => Promise<void>
  readonly toggleLightTheme: () => Promise<void>
  readonly toggleDarkTheme: () => Promise<void>
  readonly toggleColorTheme: () => void

  readonly createColorThemeToggle: (targetColorTheme: string) => () => void
  readonly isColorThemeActive: (targetColorTheme: string) => boolean

  readonly switchThemeFromElement: (
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
interface SpacemanThemeProviderProps {
  readonly children: ReactNode
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly animationType?: ThemeAnimationType
  readonly duration?: number
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
export function SpacemanThemeProvider({
  children,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
}: SpacemanThemeProviderProps): React.JSX.Element {
  const mounted = useHydrated()

  const themeState = useThemeAnimation({
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
  })

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement): Promise<void> => {
      await withElementAsRef(themeState.ref, element, async () => {
        await themeState.switchTheme(theme)
      })
    },
    [themeState],
  )

  const contextValue = useMemo<SpacemanThemeContextType>(() => {
    if (!mounted)
      return {
        ref: { current: null },
        theme: defaultTheme,
        colorTheme: defaultColorTheme,
        resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
        setTheme: (): void => {},
        setColorTheme: (): void => {},

        switchTheme: async (): Promise<void> => Promise.resolve(),
        switchThemeFromElement: async (): Promise<void> => Promise.resolve(),
        switchColorTheme: (): void => {},

        toggleTheme: async (): Promise<void> => Promise.resolve(),
        toggleLightTheme: async (): Promise<void> => Promise.resolve(),
        toggleDarkTheme: async (): Promise<void> => Promise.resolve(),
        toggleColorTheme: (): void => {},

        createColorThemeToggle: (): (() => void) => (): void => {},
        isColorThemeActive: (): boolean => false,
      }

    return {
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
  }, [
    mounted,
    defaultTheme,
    defaultColorTheme,
    themeState,
    switchThemeFromElement,
  ])

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
