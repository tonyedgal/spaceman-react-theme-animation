'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import { Theme, ColorTheme, ThemeAnimationType } from '../types'

interface SpacemanThemeContextType {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  switchTheme: (theme: Theme) => Promise<void>
  switchColorTheme: (colorTheme: string) => void
  toggleTheme: () => Promise<void>
  toggleLightTheme: () => Promise<void>
  toggleDarkTheme: () => Promise<void>
  toggleColorTheme: () => void
  createColorThemeToggle: (targetColorTheme: string) => () => void
  isColorThemeActive: (targetColorTheme: string) => boolean
  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>
}

const SpacemanThemeContext = createContext<SpacemanThemeContextType | undefined>(undefined)

interface SpacemanThemeProviderProps {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
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
      ref: { current: null },
      theme: defaultTheme,
      colorTheme: defaultColorTheme,
      resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
      setTheme: () => {},
      setColorTheme: () => {},
      switchTheme: async () => {},
      switchThemeFromElement: async () => {},
      switchColorTheme: () => {},
      toggleTheme: async () => {},
      toggleLightTheme: async () => {},
      toggleDarkTheme: async () => {},
      toggleColorTheme: () => {},
      createColorThemeToggle: () => () => {},
      isColorThemeActive: () => false,
    }

    return (
      <SpacemanThemeContext.Provider value={loadingContextValue}>
        {children}
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
    <SpacemanThemeContext.Provider value={contextValue}>{children}</SpacemanThemeContext.Provider>
  )
}

export const useSpacemanTheme = (): SpacemanThemeContextType => {
  const context = useContext(SpacemanThemeContext)
  if (context === undefined) {
    throw new Error('useSpacemanTheme must be used within a SpacemanThemeProvider')
  }
  return context
}
