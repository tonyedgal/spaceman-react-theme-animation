import type { ReactNode } from 'react'

import type {
  ColorThemeToggle,
  ThemeTransitionInput,
  UseThemeAnimationProps,
} from '../../core/types'
import { getColorTransitionOptions } from '../hooks/transition-options'

export { TanStackStartThemeScript } from './TanStackStartThemeScript'

export type { TanStackStartThemeScriptProps } from './TanStackStartThemeScript'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'

import type { ColorTheme, SystemThemeMode, Theme } from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import {
  COLOR_STORAGE_KEY,
  COLOR_THEME_PREFIX,
  GLOBAL_CLASS_NAME,
  STORAGE_KEY,
} from '../../tanstack/helpers'
import { useSyncServerThemeStorage } from '../hooks/use-sync-server-theme-storage'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { getBrowserSystemTheme, getNextResolvedTheme } from './provider-helpers'
import { notifyServerChange } from './server-notifications'
import { SharedThemeContext } from './shared-theme-context'

const defaultThemes = ['light', 'dark', 'system'] as const

const defaultColorThemes = ['default'] as const

export interface TanStackThemeContextType {
  readonly ref: React.RefObject<HTMLButtonElement | null>
  readonly theme: Theme
  readonly colorTheme: ColorTheme
  readonly resolvedTheme: 'light' | 'dark'
  readonly systemTheme: 'light' | 'dark'
  readonly isHydrated: boolean
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

const TanStackThemeContext = createContext<
  TanStackThemeContextType | undefined
>(undefined)

export type TanStackThemeProviderProps = UseThemeAnimationProps & {
  readonly children: ReactNode
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly animationType?: ThemeAnimationType
  readonly duration?: number
  readonly storageKey?: string
  readonly colorStorageKey?: string
  readonly globalClassName?: string
  readonly colorThemePrefix?: string
  readonly serverTheme?: 'light' | 'dark' | 'system'
  readonly serverColorTheme?: ColorTheme
  readonly systemThemeMode?: SystemThemeMode
  readonly onServerThemeChange?: (theme: Theme) => Promise<void> | void
  readonly onServerColorThemeChange?: (
    colorTheme: ColorTheme,
  ) => Promise<void> | void
}

const useHydrated = (): boolean => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function TanStackThemeProvider({
  children,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 400,
  storageKey = STORAGE_KEY,
  colorStorageKey = COLOR_STORAGE_KEY,
  globalClassName = GLOBAL_CLASS_NAME,
  colorThemePrefix = COLOR_THEME_PREFIX,
  serverTheme,
  serverColorTheme,
  systemThemeMode = 'css',
  onServerThemeChange,
  onServerColorThemeChange,
  ...animationOptions
}: Readonly<TanStackThemeProviderProps>): React.JSX.Element {
  const isHydrated = useHydrated()
  const hasServerTheme = serverTheme !== undefined
  const initialTheme = hasServerTheme ? serverTheme : undefined

  const handleServerThemeChange = useCallback(
    (theme: Theme): void => {
      notifyServerChange(onServerThemeChange, theme)
    },
    [onServerThemeChange],
  )

  const handleServerColorThemeChange = useCallback(
    (colorTheme: ColorTheme): void => {
      notifyServerChange(onServerColorThemeChange, colorTheme)
    },
    [onServerColorThemeChange],
  )

  const themeState = useThemeAnimation({
    ...animationOptions,
    onThemeChange: handleServerThemeChange,
    onColorThemeChange: handleServerColorThemeChange,
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
    storageKey,
    colorStorageKey,
    globalClassName,
    colorThemePrefix,
    initialTheme,
    initialColorTheme: serverColorTheme,
    systemThemeMode,
  })

  useSyncServerThemeStorage({
    enabled: hasServerTheme,
    theme: initialTheme,
    colorTheme: serverColorTheme,
    storageKey,
    colorStorageKey,
  })

  const setThemeWithServer = useCallback(
    (newTheme: Theme) => {
      themeState.setTheme(newTheme)
    },
    [themeState],
  )

  const setColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.setColorTheme(newColorTheme)
    },
    [themeState],
  )

  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer(theme)

        return
      }

      await themeState.switchTheme(theme, animationOff)
    },
    [isHydrated, themeState, setThemeWithServer],
  )

  const toggleThemeWithHydrationAwareness = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      const nextTheme = getNextResolvedTheme(themeState.resolvedTheme)

      if (!isHydrated) {
        setThemeWithServer(nextTheme)

        return
      }

      await themeState.toggleTheme(animationOff)
    },
    [isHydrated, themeState, setThemeWithServer],
  )

  const toggleLightThemeWithHydrationAwareness = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer('light')

        return
      }

      await themeState.toggleLightTheme(animationOff)
    },
    [isHydrated, themeState, setThemeWithServer],
  )

  const toggleDarkThemeWithHydrationAwareness = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer('dark')

        return
      }

      await themeState.toggleDarkTheme(animationOff)
    },
    [isHydrated, themeState, setThemeWithServer],
  )

  const switchColorThemeWithServer = useCallback(
    async (newColorTheme: ColorTheme, options?: ThemeTransitionInput) => {
      if (!colorThemes.includes(newColorTheme)) return
      await themeState.switchColorTheme(newColorTheme, options)
    },
    [colorThemes, themeState],
  )

  const toggleColorThemeWithServer: ColorThemeToggle = useCallback(
    async (input) => {
      await themeState.toggleColorTheme(input)
    },
    [themeState],
  )

  const createColorThemeToggleWithServer = useCallback(
    (targetColorTheme: ColorTheme): ColorThemeToggle =>
      async (input) =>
        switchColorThemeWithServer(
          targetColorTheme,
          getColorTransitionOptions(input),
        ),
    [switchColorThemeWithServer],
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      if (!isHydrated) {
        setThemeWithServer(theme)

        return
      }

      await themeState.switchTheme(theme, { element })
    },
    [isHydrated, themeState, setThemeWithServer],
  )

  const systemTheme = getBrowserSystemTheme()

  const serverResolvedTheme: 'light' | 'dark' = (() => {
    if (hasServerTheme) {
      if (serverTheme === 'dark') return 'dark'

      if (serverTheme === 'system') return systemTheme

      return 'light'
    }

    return defaultTheme === 'dark' ? 'dark' : 'light'
  })()

  const contextValue = useMemo<TanStackThemeContextType>(() => {
    if (!isHydrated)
      return {
        ref: { current: null },
        theme: initialTheme ?? defaultTheme,
        colorTheme: serverColorTheme ?? defaultColorTheme,
        resolvedTheme: serverResolvedTheme,
        systemTheme: 'light',
        isHydrated: false,
        setTheme: setThemeWithServer,
        setColorTheme: setColorThemeWithServer,
        switchTheme: async (theme: Theme): Promise<void> => {
          setThemeWithServer(theme)

          return Promise.resolve()
        },
        switchThemeFromElement: async (theme: Theme): Promise<void> => {
          setThemeWithServer(theme)

          return Promise.resolve()
        },
        switchColorTheme: switchColorThemeWithServer,
        toggleTheme: async (): Promise<void> => {
          const nextTheme = serverResolvedTheme === 'dark' ? 'light' : 'dark'
          setThemeWithServer(nextTheme)

          return Promise.resolve()
        },
        toggleLightTheme: async (): Promise<void> => {
          setThemeWithServer('light')

          return Promise.resolve()
        },
        toggleDarkTheme: async (): Promise<void> => {
          setThemeWithServer('dark')

          return Promise.resolve()
        },
        toggleColorTheme: toggleColorThemeWithServer,
        createColorThemeToggle: createColorThemeToggleWithServer,
        isColorThemeActive: themeState.isColorThemeActive,
      }

    return {
      ref: themeState.ref,
      theme: themeState.theme,
      colorTheme: themeState.colorTheme,
      resolvedTheme: themeState.resolvedTheme,
      systemTheme,
      isHydrated: true,
      setTheme: setThemeWithServer,
      setColorTheme: setColorThemeWithServer,
      switchTheme: switchThemeWithHydrationAwareness,
      switchThemeFromElement,
      switchColorTheme: switchColorThemeWithServer,
      toggleTheme: toggleThemeWithHydrationAwareness,
      toggleLightTheme: toggleLightThemeWithHydrationAwareness,
      toggleDarkTheme: toggleDarkThemeWithHydrationAwareness,
      toggleColorTheme: toggleColorThemeWithServer,
      createColorThemeToggle: createColorThemeToggleWithServer,
      isColorThemeActive: themeState.isColorThemeActive,
    }
  }, [
    isHydrated,
    initialTheme,
    defaultTheme,
    serverColorTheme,
    defaultColorTheme,
    serverResolvedTheme,
    setThemeWithServer,
    setColorThemeWithServer,
    switchColorThemeWithServer,
    toggleColorThemeWithServer,
    createColorThemeToggleWithServer,
    themeState,
    systemTheme,
    switchThemeWithHydrationAwareness,
    switchThemeFromElement,
    toggleThemeWithHydrationAwareness,
    toggleLightThemeWithHydrationAwareness,
    toggleDarkThemeWithHydrationAwareness,
  ])

  return (
    <TanStackThemeContext.Provider value={contextValue}>
      <SharedThemeContext.Provider value={contextValue}>
        {children}
      </SharedThemeContext.Provider>
    </TanStackThemeContext.Provider>
  )
}

export const useTanStackTheme = (): TanStackThemeContextType => {
  const context = useContext(TanStackThemeContext)

  if (context === undefined) {
    throw new Error(
      'useTanStackTheme must be used within a TanStackThemeProvider',
    )
  }

  return context
}
