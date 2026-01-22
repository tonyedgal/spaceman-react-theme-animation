import React, { createContext, useContext, ReactNode, useCallback } from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { Theme, ColorTheme, ThemeAnimationType } from '../types'

interface ViteThemeContextType {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  switchTheme: (theme: Theme, animationOff?: boolean) => Promise<void>
  switchColorTheme: (colorTheme: string) => void
  toggleTheme: (animationOff?: boolean) => Promise<void>
  toggleLightTheme: (animationOff?: boolean) => Promise<void>
  toggleDarkTheme: (animationOff?: boolean) => Promise<void>
  toggleColorTheme: () => void
  createColorThemeToggle: (targetColorTheme: string) => () => void
  isColorThemeActive: (targetColorTheme: string) => boolean
  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>
}

const ViteThemeContext = createContext<ViteThemeContextType | undefined>(undefined)

interface ViteThemeProviderProps {
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
}) => {
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
    [themeState.setTheme, applyTransitionDisable]
  )

  const wrappedSwitchTheme = useCallback(
    async (theme: Theme, animationOff: boolean = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.switchTheme(theme, animationOff)
      cleanup()
    },
    [themeState.switchTheme, applyTransitionDisable]
  )

  const wrappedToggleTheme = useCallback(
    async (animationOff: boolean = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleTheme(animationOff)
      cleanup()
    },
    [themeState.toggleTheme, applyTransitionDisable]
  )

  const wrappedToggleLightTheme = useCallback(
    async (animationOff: boolean = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleLightTheme(animationOff)
      cleanup()
    },
    [themeState.toggleLightTheme, applyTransitionDisable]
  )

  const wrappedToggleDarkTheme = useCallback(
    async (animationOff: boolean = false) => {
      const cleanup = applyTransitionDisable()
      await themeState.toggleDarkTheme(animationOff)
      cleanup()
    },
    [themeState.toggleDarkTheme, applyTransitionDisable]
  )

  const switchThemeFromElement = async (theme: Theme, element: HTMLButtonElement) => {
    const cleanup = applyTransitionDisable()
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
    cleanup()
  }

  const systemTheme =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

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

  return <ViteThemeContext.Provider value={contextValue}>{children}</ViteThemeContext.Provider>
}

export const useViteTheme = (): ViteThemeContextType => {
  const context = useContext(ViteThemeContext)
  if (context === undefined) {
    throw new Error('useViteTheme must be used within a ViteThemeProvider')
  }
  return context
}
