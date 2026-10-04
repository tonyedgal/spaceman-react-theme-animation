'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useHydrated } from '../hooks/use-hydrated'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { ThemePreHydrationScript } from './NextThemeScript'
import { getNextResolvedTheme, withElementAsRef } from './provider-helpers'
import { SharedThemeContext } from './shared-theme-context'

const defaultColorThemes = ['default'] as const

export interface NextThemeContextType {
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

export interface NextThemeProviderProps {
  readonly children: React.ReactNode
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly animationType?: ThemeAnimationType
  readonly duration?: number
  readonly storageKey?: string
  readonly colorStorageKey?: string
  readonly attribute?: 'class' | 'data-theme'
  readonly value?: Record<string, string>
  readonly enableSystem?: boolean
  readonly enableColorScheme?: boolean
  readonly disableTransitionOnChange?: boolean
  readonly forcedTheme?: Theme
  readonly nonce?: string
  readonly scriptProps?: Omit<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    'dangerouslySetInnerHTML' | 'nonce'
  >
  readonly colorThemePrefix?: string
  readonly globalClassName?: string
  readonly disableAnimationOnInit?: boolean
  readonly disablePreHydrationScript?: boolean
  readonly onThemeChange?: (theme: Theme) => void
  readonly onColorThemeChange?: (colorTheme: ColorTheme) => void
}

const NextThemeContext = createContext<NextThemeContextType | undefined>(
  undefined,
)

const createDisableTransitions = () => {
  const css = document.createElement('style')
  css.textContent =
    '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
  document.head.appendChild(css)
  window.getComputedStyle(document.body)

  return (): void => {
    setTimeout(() => {
      if (css.parentNode) {
        css.parentNode.removeChild(css)
      }
    }, 1)
  }
}

export function NextThemeProvider({
  attribute = 'class',
  children,
  colorStorageKey = 'color-theme',
  colorThemePrefix = 'theme-',
  colorThemes = defaultColorThemes,
  defaultColorTheme = 'default',
  defaultTheme = 'system',
  disableAnimationOnInit = true,
  disablePreHydrationScript = false,
  disableTransitionOnChange = false,
  duration = 750,
  enableColorScheme = true,
  enableSystem = true,
  forcedTheme,
  globalClassName = 'dark',
  nonce,
  onColorThemeChange,
  onThemeChange,
  scriptProps,
  storageKey = 'theme',
  themes,
  value,
  animationType = ThemeAnimationType.CIRCLE,
}: Readonly<NextThemeProviderProps>): React.JSX.Element {
  const allowedThemes = useMemo<readonly Theme[]>(() => {
    if (themes && themes.length > 0) {
      return themes
    }

    return enableSystem ? ['light', 'dark', 'system'] : ['light', 'dark']
  }, [enableSystem, themes])

  const effectiveDefaultTheme = useMemo<Theme>(() => {
    if (defaultTheme === 'system' && !enableSystem) {
      return 'light'
    }

    return defaultTheme
  }, [defaultTheme, enableSystem])

  const mounted = useHydrated()

  const themeState = useThemeAnimation({
    animationType,
    attribute,
    colorStorageKey,
    colorTheme: forcedTheme ? undefined : undefined,
    colorThemePrefix,
    colorThemes,
    defaultColorTheme,
    defaultTheme: effectiveDefaultTheme,
    duration,
    enableColorScheme,
    globalClassName,
    onColorThemeChange,
    onThemeChange,
    storageKey,
    theme: forcedTheme,
    themes: allowedThemes,
    value,
  })

  const withTransitionsDisabled = useCallback(
    async <T,>(fn: () => T | Promise<T>) => {
      const cleanup = disableTransitionOnChange
        ? createDisableTransitions()
        : undefined

      try {
        const result = await fn()
        cleanup?.()

        return result
      } catch (error) {
        cleanup?.()
        throw error
      }
    },
    [disableTransitionOnChange],
  )

  const setTheme = useCallback(
    (theme: Theme) => {
      void withTransitionsDisabled(() => {
        themeState.setTheme(theme)
      })
    },
    [themeState, withTransitionsDisabled],
  )

  const switchTheme = useCallback(
    async (theme: Theme, animationOff = false) => {
      await withTransitionsDisabled(async () => {
        if (!mounted && disableAnimationOnInit) {
          themeState.setTheme(theme)

          return
        }

        await themeState.switchTheme(theme, animationOff)
      })
    },
    [disableAnimationOnInit, mounted, themeState, withTransitionsDisabled],
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      await withTransitionsDisabled(async () => {
        if (!mounted && disableAnimationOnInit) {
          themeState.setTheme(theme)

          return
        }

        await withElementAsRef(themeState.ref, element, async () => {
          await themeState.switchTheme(theme)
        })
      })
    },
    [disableAnimationOnInit, mounted, themeState, withTransitionsDisabled],
  )

  const contextValue = useMemo<NextThemeContextType>(
    () => ({
      ref: themeState.ref,
      theme: themeState.theme,
      colorTheme: themeState.colorTheme,
      resolvedTheme: themeState.resolvedTheme,
      systemTheme: themeState.systemTheme,
      setTheme,
      setColorTheme: themeState.setColorTheme,
      switchTheme,
      switchColorTheme: themeState.switchColorTheme,
      toggleTheme: async (animationOff = false): Promise<void> =>
        switchTheme(
          getNextResolvedTheme(themeState.resolvedTheme),
          animationOff,
        ),
      toggleLightTheme: async (animationOff = false): Promise<void> => {
        if (themeState.resolvedTheme === 'light') return
        await switchTheme('light', animationOff)
      },
      toggleDarkTheme: async (animationOff = false): Promise<void> => {
        if (themeState.resolvedTheme === 'dark') return
        await switchTheme('dark', animationOff)
      },
      toggleColorTheme: themeState.toggleColorTheme,
      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
      switchThemeFromElement,
    }),
    [setTheme, switchTheme, switchThemeFromElement, themeState],
  )

  return (
    <NextThemeContext.Provider value={contextValue}>
      <SharedThemeContext.Provider value={contextValue}>
        {!disablePreHydrationScript && !forcedTheme ? (
          <ThemePreHydrationScript
            attribute={attribute}
            colorStorageKey={colorStorageKey}
            colorThemePrefix={colorThemePrefix}
            defaultColorTheme={defaultColorTheme}
            defaultTheme={effectiveDefaultTheme}
            enableColorScheme={enableColorScheme}
            enableSystem={enableSystem}
            globalClassName={globalClassName}
            nonce={nonce}
            scriptProps={scriptProps}
            storageKey={storageKey}
            value={value}
          />
        ) : null}
        {children}
      </SharedThemeContext.Provider>
    </NextThemeContext.Provider>
  )
}

export const ThemeProvider = NextThemeProvider

export const useNextTheme = (): NextThemeContextType => {
  const context = useContext(NextThemeContext)

  if (context === undefined) {
    throw new Error('useNextTheme must be used within a NextThemeProvider')
  }

  return context
}

export const useTheme = useNextTheme
