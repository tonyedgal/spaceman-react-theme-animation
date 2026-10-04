import type { ReactNode } from 'react'

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
import {
  getBrowserSystemTheme,
  getNextResolvedTheme,
  withElementAsRef,
} from './provider-helpers'
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

const TanStackThemeContext = createContext<
  TanStackThemeContextType | undefined
>(undefined)

export interface TanStackThemeProviderProps {
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

const getNextColorTheme = (
  colorThemes: readonly ColorTheme[],
  currentColorTheme: ColorTheme,
): ColorTheme => {
  if (colorThemes.length === 0) return currentColorTheme
  const currentIndex = colorThemes.indexOf(currentColorTheme)

  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % colorThemes.length

  return colorThemes[nextIndex]
}

export function TanStackThemeProvider({
  children,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
  storageKey = STORAGE_KEY,
  colorStorageKey = COLOR_STORAGE_KEY,
  globalClassName = GLOBAL_CLASS_NAME,
  colorThemePrefix = COLOR_THEME_PREFIX,
  serverTheme,
  serverColorTheme,
  systemThemeMode = 'css',
  onServerThemeChange,
  onServerColorThemeChange,
}: TanStackThemeProviderProps): React.JSX.Element {
  const isHydrated = useHydrated()
  const hasServerTheme = serverTheme !== undefined
  const initialTheme = hasServerTheme ? serverTheme : undefined

  const themeState = useThemeAnimation({
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
      notifyServerChange(onServerThemeChange, newTheme)
    },
    [themeState, onServerThemeChange],
  )

  const setColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.setColorTheme(newColorTheme)
      notifyServerChange(onServerColorThemeChange, newColorTheme)
    },
    [themeState, onServerColorThemeChange],
  )

  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff = false) => {
      if (!isHydrated) {
        setThemeWithServer(theme)

        return
      }

      await themeState.switchTheme(theme, animationOff)
      notifyServerChange(onServerThemeChange, theme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const toggleThemeWithHydrationAwareness = useCallback(
    async (animationOff = false) => {
      const nextTheme = getNextResolvedTheme(themeState.resolvedTheme)

      if (!isHydrated) {
        setThemeWithServer(nextTheme)

        return
      }

      await themeState.toggleTheme(animationOff)
      notifyServerChange(onServerThemeChange, nextTheme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const toggleLightThemeWithHydrationAwareness = useCallback(
    async (animationOff = false) => {
      if (!isHydrated) {
        setThemeWithServer('light')

        return
      }

      await themeState.toggleLightTheme(animationOff)
      notifyServerChange(onServerThemeChange, 'light')
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const toggleDarkThemeWithHydrationAwareness = useCallback(
    async (animationOff = false) => {
      if (!isHydrated) {
        setThemeWithServer('dark')

        return
      }

      await themeState.toggleDarkTheme(animationOff)
      notifyServerChange(onServerThemeChange, 'dark')
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const switchColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.switchColorTheme(newColorTheme)
      notifyServerChange(onServerColorThemeChange, newColorTheme)
    },
    [themeState, onServerColorThemeChange],
  )

  const toggleColorThemeWithServer = useCallback(() => {
    const nextColorTheme = getNextColorTheme(colorThemes, themeState.colorTheme)
    themeState.toggleColorTheme()
    notifyServerChange(onServerColorThemeChange, nextColorTheme)
  }, [colorThemes, themeState, onServerColorThemeChange])

  const createColorThemeToggleWithServer = useCallback(
    (targetColorTheme: ColorTheme) => (): void => {
      themeState.createColorThemeToggle(targetColorTheme)()
      notifyServerChange(onServerColorThemeChange, targetColorTheme)
    },
    [themeState, onServerColorThemeChange],
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      if (!isHydrated) {
        setThemeWithServer(theme)

        return
      }

      await withElementAsRef(themeState.ref, element, async () => {
        await themeState.switchTheme(theme)
      })

      notifyServerChange(onServerThemeChange, theme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
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
