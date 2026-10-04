import type { ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { getBrowserSystemTheme, withElementAsRef } from './provider-helpers'
import { SharedThemeContext } from './shared-theme-context'

const defaultThemes = ['light', 'dark', 'system'] as const

const defaultColorThemes = ['default'] as const

interface ViteThemeContextType {
  readonly ref: React.RefObject<HTMLButtonElement | null>
  readonly theme: Theme
  readonly colorTheme: ColorTheme
  readonly resolvedTheme: 'light' | 'dark'
  readonly systemTheme: 'light' | 'dark'
  readonly setTheme: (theme: Theme) => void
  readonly setColorTheme: (colorTheme: ColorTheme) => void
  readonly switchTheme: (theme: Theme, animationOff?: boolean) => Promise<void>
  readonly switchColorTheme: (colorTheme: string) => void
  readonly toggleTheme: (animationOff?: boolean) => Promise<void>
  readonly toggleLightTheme: (animationOff?: boolean) => Promise<void>
  readonly toggleDarkTheme: (animationOff?: boolean) => Promise<void>
  readonly toggleColorTheme: () => void
  readonly createColorThemeToggle: (targetColorTheme: string) => () => void
  readonly isColorThemeActive: (targetColorTheme: string) => boolean
  readonly switchThemeFromElement: (
    theme: Theme,
    element: HTMLButtonElement,
  ) => Promise<void>
}

const ViteThemeContext = createContext<ViteThemeContextType | undefined>(
  undefined,
)

interface ViteThemeProviderProps {
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
  duration = 750,
  attribute = 'class',
  disableTransitionOnChange = false,
  storageKey = 'vite-theme',
  colorStorageKey = 'vite-color-theme',
  globalClassName = 'dark',
  colorThemePrefix = 'theme-',
}: ViteThemeProviderProps): React.JSX.Element {
  const themeState = useThemeAnimation({
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

  const applyTransitionDisable = useCallback(() => {
    if (!disableTransitionOnChange) return (): void => {}

    const css = document.createElement('style')
    css.textContent = `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    document.head.appendChild(css)

    window.getComputedStyle(document.body)

    return (): void => {
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }
  }, [disableTransitionOnChange])

  const wrappedSetTheme = useCallback(
    (theme: Theme) => {
      const cleanup = applyTransitionDisable()
      themeState.setTheme(theme)
      cleanup()
    },
    [themeState, applyTransitionDisable],
  )

  const wrappedSwitchTheme = useCallback(
    async (theme: Theme, animationOff = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.switchTheme(theme, animationOff)
      cleanup()
    },
    [themeState, applyTransitionDisable],
  )

  const wrappedToggleTheme = useCallback(
    async (animationOff = false): Promise<void> => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleTheme(animationOff)
      cleanup()
    },
    [themeState, applyTransitionDisable],
  )

  const wrappedToggleLightTheme = useCallback(
    async (animationOff = false): Promise<void> => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleLightTheme(animationOff)
      cleanup()
    },
    [themeState, applyTransitionDisable],
  )

  const wrappedToggleDarkTheme = useCallback(
    async (animationOff = false): Promise<void> => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleDarkTheme(animationOff)
      cleanup()
    },
    [themeState, applyTransitionDisable],
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement): Promise<void> => {
      const cleanup = applyTransitionDisable()

      try {
        await withElementAsRef(themeState.ref, element, async () => {
          await themeState.switchTheme(theme)
        })
        cleanup()
      } catch (error) {
        cleanup()
        throw error
      }
    },
    [themeState, applyTransitionDisable],
  )

  const systemTheme = getBrowserSystemTheme()

  const contextValue = useMemo<ViteThemeContextType>(
    () => ({
      ref: themeState.ref,
      theme: themeState.theme,
      colorTheme: themeState.colorTheme,
      resolvedTheme: themeState.resolvedTheme,
      systemTheme,
      setTheme: wrappedSetTheme,
      setColorTheme: themeState.setColorTheme,
      switchTheme: wrappedSwitchTheme,
      switchThemeFromElement,
      switchColorTheme: themeState.switchColorTheme,
      toggleTheme: wrappedToggleTheme,
      toggleLightTheme: wrappedToggleLightTheme,
      toggleDarkTheme: wrappedToggleDarkTheme,
      toggleColorTheme: themeState.toggleColorTheme,
      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
    }),
    [
      themeState,
      systemTheme,
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
