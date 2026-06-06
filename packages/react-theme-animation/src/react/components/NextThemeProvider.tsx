'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { ColorTheme, Theme, ThemeAnimationType } from '../../core/types'
import { SharedThemeContext } from './shared-theme-context'
import { getNextResolvedTheme, withElementAsRef } from './provider-helpers'

export interface NextThemeContextType {
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
  switchThemeFromElement: (
    theme: Theme,
    element: HTMLButtonElement
  ) => Promise<void>
}

export interface NextThemeProviderProps {
  children: React.ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  storageKey?: string
  colorStorageKey?: string
  attribute?: 'class' | 'data-theme'
  value?: Record<string, string>
  enableSystem?: boolean
  enableColorScheme?: boolean
  disableTransitionOnChange?: boolean
  forcedTheme?: Theme
  nonce?: string
  scriptProps?: Omit<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    'dangerouslySetInnerHTML' | 'nonce'
  >
  colorThemePrefix?: string
  globalClassName?: string
  disableAnimationOnInit?: boolean
  disablePreHydrationScript?: boolean
  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: ColorTheme) => void
}

const NextThemeContext = createContext<NextThemeContextType | undefined>(
  undefined
)

const createDisableTransitions = () => {
  const css = document.createElement('style')
  css.textContent =
    '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
  document.head.appendChild(css)
  window.getComputedStyle(document.body)

  return () => {
    setTimeout(() => {
      if (css.parentNode) {
        css.parentNode.removeChild(css)
      }
    }, 1)
  }
}

const generatePreHydrationScript = ({
  attribute,
  colorStorageKey,
  colorThemePrefix,
  defaultColorTheme,
  defaultTheme,
  enableColorScheme,
  enableSystem,
  globalClassName,
  storageKey,
  value,
}: {
  attribute: 'class' | 'data-theme'
  colorStorageKey: string
  colorThemePrefix: string
  defaultColorTheme: ColorTheme
  defaultTheme: Theme
  enableColorScheme: boolean
  enableSystem: boolean
  globalClassName: string
  storageKey: string
  value?: Record<string, string>
}) => {
  const lightValue = value?.light ?? 'light'
  const darkValue = value?.dark ?? globalClassName
  const systemValue = value?.system ?? 'system'

  return `(function(){try{var d=document.documentElement;var theme=localStorage.getItem('${storageKey}')||'${defaultTheme}';var colorTheme=localStorage.getItem('${colorStorageKey}')||'${defaultColorTheme}';if(!${JSON.stringify(
    enableSystem
  )}&&theme==='system'){theme='${defaultTheme === 'system' ? 'light' : defaultTheme}';}var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var attr='${attribute}';var lightValue='${lightValue}';var darkValue='${darkValue}';var systemValue='${systemValue}';if(attr==='data-theme'){d.setAttribute('data-theme',theme==='system'?systemValue:(resolved==='dark'?darkValue:lightValue));}else{d.classList.remove(lightValue,darkValue,systemValue,'auto');d.classList.add(theme==='system'?systemValue:(resolved==='dark'?darkValue:lightValue));}if(${JSON.stringify(
    enableColorScheme
  )}){d.style.colorScheme=theme==='system'?'':resolved;}else{d.style.removeProperty('color-scheme');}d.classList.add('${colorThemePrefix}'+colorTheme);}catch(e){console.warn('Theme pre-hydration script failed:',e);}})();`
}

const ThemePreHydrationScript = React.memo(
  ({
    attribute,
    colorStorageKey,
    colorThemePrefix,
    defaultColorTheme,
    defaultTheme,
    enableColorScheme,
    enableSystem,
    globalClassName,
    nonce,
    scriptProps,
    storageKey,
    value,
  }: {
    attribute: 'class' | 'data-theme'
    colorStorageKey: string
    colorThemePrefix: string
    defaultColorTheme: ColorTheme
    defaultTheme: Theme
    enableColorScheme: boolean
    enableSystem: boolean
    globalClassName: string
    nonce?: string
    scriptProps?: Omit<
      React.ScriptHTMLAttributes<HTMLScriptElement>,
      'dangerouslySetInnerHTML' | 'nonce'
    >
    storageKey: string
    value?: Record<string, string>
  }) => (
    <script
      {...scriptProps}
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: generatePreHydrationScript({
          attribute,
          colorStorageKey,
          colorThemePrefix,
          defaultColorTheme,
          defaultTheme,
          enableColorScheme,
          enableSystem,
          globalClassName,
          storageKey,
          value,
        }),
      }}
    />
  )
)

ThemePreHydrationScript.displayName = 'ThemePreHydrationScript'

export const NextThemeProvider: React.FC<NextThemeProviderProps> = ({
  attribute = 'class',
  children,
  colorStorageKey = 'color-theme',
  colorThemePrefix = 'theme-',
  colorThemes = ['default'],
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
}) => {
  const allowedThemes = useMemo<Theme[]>(() => {
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

  const [mounted, setMounted] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  const withTransitionsDisabled = useCallback(
    async <T,>(fn: () => Promise<T> | T) => {
      const cleanup = disableTransitionOnChange
        ? createDisableTransitions()
        : undefined

      try {
        return await fn()
      } finally {
        cleanup?.()
      }
    },
    [disableTransitionOnChange]
  )

  const setTheme = useCallback(
    (theme: Theme) => {
      void withTransitionsDisabled(async () => {
        themeState.setTheme(theme)
      })
    },
    [themeState, withTransitionsDisabled]
  )

  const switchTheme = useCallback(
    async (theme: Theme, animationOff: boolean = false) => {
      await withTransitionsDisabled(async () => {
        if (!mounted && disableAnimationOnInit) {
          themeState.setTheme(theme)
          return
        }

        await themeState.switchTheme(theme, animationOff)
      })
    },
    [disableAnimationOnInit, mounted, themeState, withTransitionsDisabled]
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
    [disableAnimationOnInit, mounted, themeState, withTransitionsDisabled]
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
      toggleTheme: async (animationOff = false) =>
        switchTheme(
          getNextResolvedTheme(themeState.resolvedTheme),
          animationOff
        ),
      toggleLightTheme: async (animationOff = false) => {
        if (themeState.resolvedTheme === 'light') return
        await switchTheme('light', animationOff)
      },
      toggleDarkTheme: async (animationOff = false) => {
        if (themeState.resolvedTheme === 'dark') return
        await switchTheme('dark', animationOff)
      },
      toggleColorTheme: themeState.toggleColorTheme,
      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
      switchThemeFromElement,
    }),
    [setTheme, switchTheme, switchThemeFromElement, themeState]
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
