'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type {
  ColorTheme,
  ColorThemeToggle,
  Theme,
  ThemeTransitionInput,
  UseThemeAnimationProps,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import { useHydrated } from '../hooks/use-hydrated'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { ThemePreHydrationScript } from './NextThemeScript'
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

export type NextThemeProviderProps = UseThemeAnimationProps & {
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
  duration = 400,
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
  ...animationOptions
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
    ...animationOptions,
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
    async (theme: Theme, animationOff: ThemeTransitionInput = false) => {
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

        await themeState.switchTheme(theme, { element })
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
      toggleTheme: async (
        options: ThemeTransitionInput = false,
      ): Promise<void> =>
        withTransitionsDisabled(async () => themeState.toggleTheme(options)),
      toggleLightTheme: async (
        options: ThemeTransitionInput = false,
      ): Promise<void> =>
        withTransitionsDisabled(async () =>
          themeState.toggleLightTheme(options),
        ),
      toggleDarkTheme: async (
        options: ThemeTransitionInput = false,
      ): Promise<void> =>
        withTransitionsDisabled(async () =>
          themeState.toggleDarkTheme(options),
        ),
      toggleColorTheme: themeState.toggleColorTheme,
      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
      switchThemeFromElement,
    }),
    [
      setTheme,
      switchTheme,
      switchThemeFromElement,
      themeState,
      withTransitionsDisabled,
    ],
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
