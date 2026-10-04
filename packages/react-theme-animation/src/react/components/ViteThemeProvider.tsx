import React, { createContext, useContext, ReactNode, useCallback } from 'react'

import type {
  UseThemeAnimationProps,
  ThemeTransitionInput,
  ColorThemeToggle,
  Theme,
  ColorTheme,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { getBrowserSystemTheme } from './provider-helpers'
import { SharedThemeContext } from './shared-theme-context'

interface ViteThemeContextType {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
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

const ViteThemeContext = createContext<ViteThemeContextType | undefined>(
  undefined,
)

export type ViteThemeProviderProps = UseThemeAnimationProps & {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  attribute?: 'class' | 'data-theme'
  disableTransitionOnChange?: boolean
  storageKey?: string
  colorStorageKey?: string
  globalClassName?: string
  colorThemePrefix?: string
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
export const ViteThemeProvider: React.FC<ViteThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
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
  ...animationOptions
}) => {
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

  const applyTransitionDisable = useCallback(() => {
    if (!disableTransitionOnChange) return () => {}

    const css = document.createElement('style')
    css.textContent = `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    document.head.appendChild(css)

    window.getComputedStyle(document.body)

    return () => {
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
    [themeState.setTheme, applyTransitionDisable],
  )

  const wrappedSwitchTheme = useCallback(
    async (theme: Theme, animationOff: ThemeTransitionInput = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.switchTheme(theme, animationOff)
      cleanup()
    },
    [themeState.switchTheme, applyTransitionDisable],
  )

  const wrappedToggleTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleTheme(animationOff)
      cleanup()
    },
    [themeState.toggleTheme, applyTransitionDisable],
  )

  const wrappedToggleLightTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleLightTheme(animationOff)
      cleanup()
    },
    [themeState.toggleLightTheme, applyTransitionDisable],
  )

  const wrappedToggleDarkTheme = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleDarkTheme(animationOff)
      cleanup()
    },
    [themeState.toggleDarkTheme, applyTransitionDisable],
  )

  const switchThemeFromElement = async (
    theme: Theme,
    element: HTMLButtonElement,
  ) => {
    const cleanup = applyTransitionDisable()
    await themeState.switchTheme(theme, { element })
    cleanup()
  }

  const systemTheme = getBrowserSystemTheme()

  const contextValue: ViteThemeContextType = {
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
  }

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
