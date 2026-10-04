import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react'

import type {
  UseThemeAnimationProps,
  ThemeTransitionInput,
  ColorThemeToggle,
  ColorTheme,
  SystemThemeMode,
  Theme,
} from '../../core/types'
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
import { SharedThemeContext } from './shared-theme-context'

export interface TanStackThemeContextType {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
  isHydrated: boolean
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

const TanStackThemeContext = createContext<
  TanStackThemeContextType | undefined
>(undefined)

export type TanStackThemeProviderProps = UseThemeAnimationProps & {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
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

export const TanStackThemeProvider: React.FC<TanStackThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
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
  ...animationOptions
}) => {
  const isHydrated = useHydrated()
  const hasServerTheme = serverTheme !== undefined
  const initialTheme = hasServerTheme ? serverTheme : undefined

  const themeState = useThemeAnimation({
    ...animationOptions,
    onColorThemeChange: onServerColorThemeChange,
    onThemeChange: onServerThemeChange,
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
    [themeState, onServerThemeChange],
  )

  const setColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.setColorTheme(newColorTheme)
    },
    [themeState, onServerColorThemeChange],
  )

  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer(theme)

        return
      }

      await themeState.switchTheme(theme, animationOff)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
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
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const toggleLightThemeWithHydrationAwareness = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer('light')

        return
      }

      await themeState.toggleLightTheme(animationOff)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const toggleDarkThemeWithHydrationAwareness = useCallback(
    async (animationOff: ThemeTransitionInput = false) => {
      if (!isHydrated) {
        setThemeWithServer('dark')

        return
      }

      await themeState.toggleDarkTheme(animationOff)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange],
  )

  const switchColorThemeWithServer = useCallback(
    async (newColorTheme: ColorTheme, options?: ThemeTransitionInput) => {
      if (!colorThemes.includes(newColorTheme)) return
      await themeState.switchColorTheme(newColorTheme, options)
    },
    [colorThemes, themeState, onServerColorThemeChange],
  )

  const toggleColorThemeWithServer: ColorThemeToggle = useCallback(
    async (input) => {
      await themeState.toggleColorTheme(input)
    },
    [themeState],
  )

  const createColorThemeToggleWithServer = useCallback(
    (targetColorTheme: ColorTheme): ColorThemeToggle =>
      (input) =>
        switchColorThemeWithServer(
          targetColorTheme,
          input && typeof input === 'object' && 'currentTarget' in input
            ? { element: input.currentTarget, animationOff: input.detail === 0 }
            : input,
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

  if (!isHydrated) {
    const loadingContextValue: TanStackThemeContextType = {
      ref: { current: null },
      theme: initialTheme ?? defaultTheme,
      colorTheme: serverColorTheme ?? defaultColorTheme,
      resolvedTheme: serverResolvedTheme,
      systemTheme: 'light',
      isHydrated: false,
      setTheme: setThemeWithServer,
      setColorTheme: setColorThemeWithServer,
      switchTheme: async (theme: Theme) => setThemeWithServer(theme),
      switchThemeFromElement: async (theme: Theme) => setThemeWithServer(theme),
      switchColorTheme: switchColorThemeWithServer,
      toggleTheme: async () => {
        const nextTheme = serverResolvedTheme === 'dark' ? 'light' : 'dark'
        setThemeWithServer(nextTheme)
      },
      toggleLightTheme: async () => setThemeWithServer('light'),
      toggleDarkTheme: async () => setThemeWithServer('dark'),
      toggleColorTheme: toggleColorThemeWithServer,
      createColorThemeToggle: createColorThemeToggleWithServer,
      isColorThemeActive: themeState.isColorThemeActive,
    }

    return (
      <TanStackThemeContext.Provider value={loadingContextValue}>
        <SharedThemeContext.Provider value={loadingContextValue}>
          {children}
        </SharedThemeContext.Provider>
      </TanStackThemeContext.Provider>
    )
  }

  const contextValue: TanStackThemeContextType = {
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
