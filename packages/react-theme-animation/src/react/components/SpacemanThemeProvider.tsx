import type { ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type {
  ColorTheme,
  ColorThemeToggle,
  Theme,
  ThemeTransitionInput,
  UseThemeAnimationProps,
  ThemeAnimationTypeInput,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useHydrated } from '../hooks/use-hydrated'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { useTransitionFreeze } from '../hooks/use-transition-freeze'
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
  readonly colorThemes: readonly ColorTheme[]
  readonly resolvedTheme: 'light' | 'dark'
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

const SpacemanThemeContext = createContext<
  SpacemanThemeContextType | undefined
>(undefined)

/**
 * Props for the Spaceman Theme Provider
 */
export type SpacemanThemeProviderProps = UseThemeAnimationProps & {
  readonly children: ReactNode
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly animationType?: ThemeAnimationTypeInput
  readonly duration?: number
  readonly disableTransitionOnChange?: boolean
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
 * @param duration - Animation duration in milliseconds (default: 400)
 * @param disableTransitionOnChange - Temporarily disable CSS transitions during theme changes (default: false)
 */
export function SpacemanThemeProvider({
  children,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 400,
  disableTransitionOnChange = false,
  ...animationOptions
}: Readonly<SpacemanThemeProviderProps>): React.JSX.Element {
  const mounted = useHydrated()

  const themeState = useThemeAnimation({
    ...animationOptions,
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
  })

  const withTransitionsDisabled = useTransitionFreeze(
    disableTransitionOnChange,
    animationOptions.nonce,
  )

  const wrappedSetTheme = useCallback(
    (theme: Theme) => {
      void withTransitionsDisabled(() => {
        themeState.setTheme(theme)
      })
    },
    [themeState, withTransitionsDisabled],
  )

  const wrappedSwitchTheme = useCallback(
    async (theme: Theme, options?: ThemeTransitionInput) =>
      withTransitionsDisabled(async () =>
        themeState.switchTheme(theme, options),
      ),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleTheme = useCallback(
    async (options?: ThemeTransitionInput): Promise<void> =>
      withTransitionsDisabled(async () => themeState.toggleTheme(options)),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleLightTheme = useCallback(
    async (options?: ThemeTransitionInput): Promise<void> =>
      withTransitionsDisabled(async () => themeState.toggleLightTheme(options)),
    [themeState, withTransitionsDisabled],
  )

  const wrappedToggleDarkTheme = useCallback(
    async (options?: ThemeTransitionInput): Promise<void> =>
      withTransitionsDisabled(async () => themeState.toggleDarkTheme(options)),
    [themeState, withTransitionsDisabled],
  )

  const setColorTheme = useCallback(
    (colorTheme: ColorTheme) => {
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

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement): Promise<void> =>
      withTransitionsDisabled(async () =>
        themeState.switchTheme(theme, { element }),
      ),
    [themeState, withTransitionsDisabled],
  )

  const contextValue = useMemo<SpacemanThemeContextType>(() => {
    if (!mounted)
      return {
        ref: { current: null },
        theme: defaultTheme,
        colorTheme: defaultColorTheme,
        colorThemes,
        resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
        setTheme: (): void => {},
        setColorTheme: (): void => {},

        switchTheme: async (): Promise<void> => Promise.resolve(),
        switchThemeFromElement: async (): Promise<void> => Promise.resolve(),
        switchColorTheme: async (): Promise<void> => Promise.resolve(),

        toggleTheme: async (): Promise<void> => Promise.resolve(),
        toggleLightTheme: async (): Promise<void> => Promise.resolve(),
        toggleDarkTheme: async (): Promise<void> => Promise.resolve(),
        toggleColorTheme: async (): Promise<void> => Promise.resolve(),

        createColorThemeToggle:
          (): ColorThemeToggle => async (): Promise<void> =>
            Promise.resolve(),
        isColorThemeActive: (): boolean => false,
      }

    return {
      ref: themeState.ref,
      theme: themeState.theme,
      colorTheme: themeState.colorTheme,
      colorThemes: themeState.colorThemes,
      resolvedTheme: themeState.resolvedTheme,
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
    }
  }, [
    mounted,
    defaultTheme,
    defaultColorTheme,
    colorThemes,
    themeState,
    switchThemeFromElement,
    wrappedSetTheme,
    wrappedSwitchTheme,
    wrappedToggleTheme,
    wrappedToggleLightTheme,
    wrappedToggleDarkTheme,
    setColorTheme,
    switchColorTheme,
    toggleColorTheme,
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
