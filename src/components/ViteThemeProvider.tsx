import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

export interface ViteThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  systemTheme: 'light' | 'dark'
}

const ViteThemeContext = createContext<ViteThemeContextType | undefined>(undefined)

interface ViteThemeProviderProps {
  children: React.ReactNode
  attribute?: 'class' | 'data-theme'
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}

export const ViteThemeProvider: React.FC<ViteThemeProviderProps> = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = 'vite-theme',
}) => {
  const [mounted, setMounted] = useState(false)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme
      return savedTheme && ['light', 'dark', 'system'].includes(savedTheme)
        ? savedTheme
        : defaultTheme
    } catch {
      return defaultTheme
    }
  })

  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    updateSystemTheme()

    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [enableSystem])

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? systemTheme : (theme as 'light' | 'dark')

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.textContent = `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
      document.head.appendChild(css)

      window.getComputedStyle(document.body)

      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }

    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
    } else {
      root.setAttribute(attribute, resolvedTheme)
    }

    try {
      localStorage.setItem(storageKey, theme)
    } catch {}
  }, [theme, resolvedTheme, mounted, attribute, disableTransitionOnChange, storageKey])

  useEffect(() => {
    setMounted(true)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  const value: ViteThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  }

  return <ViteThemeContext.Provider value={value}>{children}</ViteThemeContext.Provider>
}

export const useViteTheme = (): ViteThemeContextType => {
  const context = useContext(ViteThemeContext)
  if (context === undefined) {
    throw new Error('useViteTheme must be used within a ViteThemeProvider')
  }
  return context
}
