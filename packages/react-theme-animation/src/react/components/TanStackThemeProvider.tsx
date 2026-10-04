import type { ReactNode } from 'react'
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
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
  isHydrated: boolean
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
    element: HTMLButtonElement,
  ) => Promise<void>
}

const TanStackThemeContext = createContext<
  TanStackThemeContextType | undefined
>(undefined)

export interface TanStackThemeProviderProps {
  children: ReactNode
  themes?: readonly Theme[]
  colorThemes?: readonly ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  storageKey?: string
  colorStorageKey?: string
  globalClassName?: string
  colorThemePrefix?: string
  serverTheme?: 'light' | 'dark' | 'system'
  serverColorTheme?: ColorTheme
  systemThemeMode?: SystemThemeMode
  onServerThemeChange?: (theme: Theme) => Promise<void> | void
  onServerColorThemeChange?: (colorTheme: ColorTheme) => Promise<void> | void
}

export interface TanStackStartThemeScriptProps {
  storageKey?: string
  colorStorageKey?: string
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  globalClassName?: string
  colorThemePrefix?: string
  nonce?: string
  systemThemeMode?: SystemThemeMode
}

const generateTanStackPreHydrationScript = (
  storageKey: string,
  colorStorageKey: string,
  defaultTheme: Theme,
  defaultColorTheme: ColorTheme,
  globalClassName: string,
  colorThemePrefix: string,
  systemThemeMode: SystemThemeMode,
): string => {
  return `
(function() {
  try {
    var theme = localStorage.getItem('${storageKey}') || '${defaultTheme}';
    var colorTheme = localStorage.getItem('${colorStorageKey}') || '${defaultColorTheme}';
    var el = document.documentElement;
    var resolved;
    if (theme === 'system') {
      if ('${systemThemeMode}' === 'css') {
        el.classList.remove('${globalClassName}');
        el.classList.remove('auto');
        el.classList.remove('system');
        el.classList.add('system');
        el.style.colorScheme = '';
      } else {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (resolved === 'dark') {
          el.classList.add('${globalClassName}');
        } else {
          el.classList.remove('${globalClassName}');
        }
        el.classList.remove('system');
        el.classList.remove('auto');
        el.style.colorScheme = resolved;
      }
    } else {
      resolved = theme;
      el.classList.remove('system');
      el.classList.remove('auto');
      if (resolved === 'dark') {
        el.classList.add('${globalClassName}');
      } else {
        el.classList.remove('${globalClassName}');
      }
      el.style.colorScheme = resolved;
    }
    if (colorTheme && colorTheme !== 'default') {
      el.classList.add('${colorThemePrefix}' + colorTheme);
    }
  } catch (e) {
    console.warn('Theme pre-hydration script failed:', e);
  }
})();
`
}

export const TanStackStartThemeScript: React.FC<TanStackStartThemeScriptProps> =
  React.memo(
    ({
      storageKey = STORAGE_KEY,
      colorStorageKey = COLOR_STORAGE_KEY,
      defaultTheme = 'system',
      defaultColorTheme = 'default',
      globalClassName = GLOBAL_CLASS_NAME,
      colorThemePrefix = COLOR_THEME_PREFIX,
      nonce,
      systemThemeMode = 'js',
    }) => {
      const scriptContent = generateTanStackPreHydrationScript(
        storageKey,
        colorStorageKey,
        defaultTheme,
        defaultColorTheme,
        globalClassName,
        colorThemePrefix,
        systemThemeMode,
      )

      return (
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: scriptContent }}
        />
      )
    },
  )

TanStackStartThemeScript.displayName = 'TanStackStartThemeScript'

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
        switchTheme: async (theme: Theme) => {
          setThemeWithServer(theme)

          return Promise.resolve()
        },
        switchThemeFromElement: async (theme: Theme) => {
          setThemeWithServer(theme)

          return Promise.resolve()
        },
        switchColorTheme: switchColorThemeWithServer,
        toggleTheme: async () => {
          const nextTheme = serverResolvedTheme === 'dark' ? 'light' : 'dark'
          setThemeWithServer(nextTheme)

          return Promise.resolve()
        },
        toggleLightTheme: async () => {
          setThemeWithServer('light')

          return Promise.resolve()
        },
        toggleDarkTheme: async () => {
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
