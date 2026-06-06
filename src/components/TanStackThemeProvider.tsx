import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { useSyncServerThemeStorage } from '../hooks/use-sync-server-theme-storage'
import { ColorTheme, SystemThemeMode, Theme, ThemeAnimationType } from '../types'
import { COLOR_STORAGE_KEY, COLOR_THEME_PREFIX, GLOBAL_CLASS_NAME, STORAGE_KEY } from '../tanstack'

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

  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>
}

const TanStackThemeContext = createContext<TanStackThemeContextType | undefined>(undefined)

export interface TanStackThemeProviderProps {
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
  systemThemeMode: SystemThemeMode
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

export const TanStackStartThemeScript: React.FC<TanStackStartThemeScriptProps> = React.memo(
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
      systemThemeMode
    )

    return (
      <script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      />
    )
  }
)

TanStackStartThemeScript.displayName = 'TanStackStartThemeScript'

const useHydrated = (): boolean => {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

const getNextColorTheme = (
  colorThemes: ColorTheme[],
  currentColorTheme: ColorTheme
): ColorTheme => {
  if (colorThemes.length === 0) return currentColorTheme
  const currentIndex = colorThemes.indexOf(currentColorTheme)
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % colorThemes.length
  return colorThemes[nextIndex]
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
}) => {
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
      onServerThemeChange?.(newTheme)
    },
    [themeState, onServerThemeChange]
  )

  const setColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.setColorTheme(newColorTheme)
      onServerColorThemeChange?.(newColorTheme)
    },
    [themeState, onServerColorThemeChange]
  )

  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff: boolean = false) => {
      if (!isHydrated) {
        setThemeWithServer(theme)
        return
      }

      await themeState.switchTheme(theme, animationOff)
      onServerThemeChange?.(theme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange]
  )

  const toggleThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      const nextTheme = themeState.resolvedTheme === 'dark' ? 'light' : 'dark'

      if (!isHydrated) {
        setThemeWithServer(nextTheme)
        return
      }

      await themeState.toggleTheme(animationOff)
      onServerThemeChange?.(nextTheme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange]
  )

  const toggleLightThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      if (!isHydrated) {
        setThemeWithServer('light')
        return
      }

      await themeState.toggleLightTheme(animationOff)
      onServerThemeChange?.('light')
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange]
  )

  const toggleDarkThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      if (!isHydrated) {
        setThemeWithServer('dark')
        return
      }

      await themeState.toggleDarkTheme(animationOff)
      onServerThemeChange?.('dark')
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange]
  )

  const switchColorThemeWithServer = useCallback(
    (newColorTheme: ColorTheme) => {
      themeState.switchColorTheme(newColorTheme)
      onServerColorThemeChange?.(newColorTheme)
    },
    [themeState, onServerColorThemeChange]
  )

  const toggleColorThemeWithServer = useCallback(() => {
    const nextColorTheme = getNextColorTheme(colorThemes, themeState.colorTheme)
    themeState.toggleColorTheme()
    onServerColorThemeChange?.(nextColorTheme)
  }, [colorThemes, themeState, onServerColorThemeChange])

  const createColorThemeToggleWithServer = useCallback(
    (targetColorTheme: ColorTheme) => () => {
      themeState.createColorThemeToggle(targetColorTheme)()
      onServerColorThemeChange?.(targetColorTheme)
    },
    [themeState, onServerColorThemeChange]
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      if (!isHydrated) {
        setThemeWithServer(theme)
        return
      }

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

      onServerThemeChange?.(theme)
    },
    [isHydrated, themeState, setThemeWithServer, onServerThemeChange]
  )

  const systemTheme =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

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
        {children}
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
    <TanStackThemeContext.Provider value={contextValue}>{children}</TanStackThemeContext.Provider>
  )
}

export const useTanStackTheme = (): TanStackThemeContextType => {
  const context = useContext(TanStackThemeContext)
  if (context === undefined) {
    throw new Error('useTanStackTheme must be used within a TanStackThemeProvider')
  }
  return context
}
