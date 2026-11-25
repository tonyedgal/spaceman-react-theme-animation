import type { ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type {
  ColorTheme,
  ColorThemeToggle,
  Theme,
  ThemeTransitionInput,
  UseThemeAnimationProps,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { useTransitionFreeze } from '../hooks/use-transition-freeze'
import { getBrowserSystemTheme } from './provider-helpers'
import { SharedThemeContext } from './shared-theme-context'

const defaultThemes = ['light', 'dark', 'system'] as const

const defaultColorThemes = ['default'] as const

interface ViteThemeContextType {
  readonly ref: React.RefObject<HTMLButtonElement | null>
  readonly theme: Theme
  readonly colorTheme: ColorTheme
  readonly colorThemes: readonly ColorTheme[]
  readonly resolvedTheme: 'light' | 'dark'
  readonly systemTheme: 'light' | 'dark'
  readonly setTheme: (theme: Theme) => void
  readonly setColorTheme: (colorTheme: ColorTheme) => void
  readonly switchTheme: (
    theme: Theme,
    options?: ThemeTransitionInput,
  ) => Promise<void>
  readonly switchColorTheme: (
    colorTheme: string,
    options?: ThemeTransitionInput,
  ) => Promise<void>
  readonly toggleTheme: (options?: ThemeTransitionInput) => Promise<void>
  readonly toggleLightTheme: (options?: ThemeTransitionInput) => Promise<void>
  readonly toggleDarkTheme: (options?: ThemeTransitionInput) => Promise<void>
  readonly toggleColorTheme: ColorThemeToggle
  readonly createColorThemeToggle: (
    targetColorTheme: string,
  ) => ColorThemeToggle
  readonly isColorThemeActive: (targetColorTheme: string) => boolean
  readonly switchThemeFromElement: (
    theme: Theme,
    element: HTMLButtonElement,
  ) => Promise<void>
}

const ViteThemeContext = createContext<ViteThemeContextType | undefined>(
  undefined,
)

export type ViteThemeProviderProps = UseThemeAnimationProps & {
  readonly children: ReactNode
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly animationType?: ThemeAnimationType
  readonly duration?: number
  readonly attribute?: 'class' | 'data-theme'
  readonly disableTransitionOnChange?: boolean
  readonly storageKey?: string
  readonly colorStorageKey?: string
  readonly globalClassName?: string
  readonly colorThemePrefix?: string
}

/**
 * Vite Theme Provider - Optimized for Vite SPA applications
 *
 * This provider is designed for Vite-based single-page applications with optional
 * transition disabling to prevent flash during theme switches.
 *
 * Note: For flash prevention on initial load, add a script to your index.html
 * or inject it via Vite plugin to apply theme before React loads.
 *
 * @param children - React children to wrap with theme context
 * @param themes - Available theme options
 * @param colorThemes - Available color theme options
 * @param defaultTheme - Default theme to use
 * @param defaultColorTheme - Default color theme to use
 * @param animationType - Animation type for theme transitions
 * @param duration - Animation duration in milliseconds
 * @param attribute - HTML attribute to use for theme ('class' or 'data-theme')
 * @param disableTransitionOnChange - Temporarily disable CSS transitions during theme switch
 * @param storageKey - LocalStorage key for theme preference
 * @param colorStorageKey - LocalStorage key for color theme preference
 * @param globalClassName - Class name for dark theme (when using 'class' attribute)
 * @param colorThemePrefix - Prefix for color theme classes
 */
export function ViteThemeProvider({
  children,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 400,
  attribute = 'class',
  disableTransitionOnChange = false,
  storageKey = 'vite-theme',
  colorStorageKey = 'vite-color-theme',
  globalClassName = 'dark',
  colorThemePrefix = 'theme-',
  ...animationOptions
}: Readonly<ViteThemeProviderProps>): React.JSX.Element {
  const themeState = useThemeAnimation({
    ...animationOptions,
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
    storageKey,
    colorStorageKey,
    globalClassName: attribute === 'class' ? globalClassName : undefined,
    colorThemePrefix,
  })

  const withTransitionsDisabled = useTransitionFreeze(disableTransitionOnChange)

  const wrappedSetTheme = useCallback(
    (theme: Theme) => {
      void withTransitionsDisabled(() => {
        themeState.setTheme(theme)
      })
    },
    [themeState, withTransitionsDisabled],
  )

  const wrappedSwitchTheme = useCallback(
    async (theme: Theme, animationOff: ThemeTransitionInput = false) =>
      withTransitionsDisabled(async () =>
        themeState.switchTheme(theme, animationOff),
      ),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false): Promise<void> =>
      withTransitionsDisabled(async () => themeState.toggleTheme(animationOff)),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleLightTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false): Promise<void> =>
      withTransitionsDisabled(async () =>
        themeState.toggleLightTheme(animationOff),
      ),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleDarkTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false): Promise<void> =>
      withTransitionsDisabled(async () =>
        themeState.toggleDarkTheme(animationOff),
      ),
    [themeState, withTransitionsDisabled],
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement): Promise<void> =>
      withTransitionsDisabled(async () =>
        themeState.switchTheme(theme, { element }),
      ),
    [themeState, withTransitionsDisabled],
  )

  const setColorTheme = useCallback(
    (colorTheme: string) => {
      void withTransitionsDisabled(() => {
        themeState.setColorTheme(colorTheme)
      })
    },
    [themeState, withTransitionsDisabled],
  )

  const switchColorTheme = useCallback(
    async (colorTheme: string, options?: ThemeTransitionInput) =>
      withTransitionsDisabled(async () =>
        themeState.switchColorTheme(colorTheme, options),
      ),
    [themeState, withTransitionsDisabled],
  )

  const toggleColorTheme: ColorThemeToggle = useCallback(
    async (input) =>
      withTransitionsDisabled(async () => themeState.toggleColorTheme(input)),
    [themeState, withTransitionsDisabled],
  )

  const systemTheme = getBrowserSystemTheme()

  const contextValue = useMemo<ViteThemeContextType>(
    () => ({
      ref: themeState.ref,
      theme: themeState.theme,
      colorTheme: themeState.colorTheme,
      colorThemes: themeState.colorThemes,
      resolvedTheme: themeState.resolvedTheme,
      systemTheme,
      setTheme: wrappedSetTheme,
      setColorTheme,
      switchTheme: wrappedSwitchTheme,
      switchThemeFromElement,
      switchColorTheme,
      toggleTheme: wrappedToggleTheme,
      toggleLightTheme: wrappedToggleLightTheme,
      toggleDarkTheme: wrappedToggleDarkTheme,
      toggleColorTheme,
      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
    }),
    [
      themeState,
      systemTheme,
      setColorTheme,
      switchColorTheme,
      toggleColorTheme,
      wrappedSetTheme,
      wrappedSwitchTheme,
      switchThemeFromElement,
      wrappedToggleTheme,
      wrappedToggleLightTheme,
      wrappedToggleDarkTheme,
    ],
  )

  return (
    <ViteThemeContext.Provider value={contextValue}>
      <SharedThemeContext.Provider value={contextValue}>
        {children}
      </SharedThemeContext.Provider>
    </ViteThemeContext.Provider>
  )
}

export const useViteTheme = (): ViteThemeContextType => {
  const context = useContext(ViteThemeContext)

  if (context === undefined) {
    throw new Error('useViteTheme must be used within a ViteThemeProvider')
  }

  return context
}
