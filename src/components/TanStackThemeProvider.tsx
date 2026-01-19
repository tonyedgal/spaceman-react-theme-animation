import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useSyncExternalStore,
} from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { Theme, ColorTheme, ThemeAnimationType } from '../types'

/**
 * Context type for the TanStack Start Theme Provider
 */
interface TanStackThemeContextType {
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

/**
 * Props for the TanStack Start Theme Provider
 */
interface TanStackThemeProviderProps {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  /** Storage key for theme preference */
  storageKey?: string
  /** Storage key for color theme preference */
  colorStorageKey?: string
  /** Class name for dark theme */
  globalClassName?: string
  /** Prefix for color theme classes */
  colorThemePrefix?: string
}

/**
 * Custom hook to detect hydration state
 * This is a simplified version compatible with TanStack Start's isomorphic model
 *
 * In TanStack Start, you can also use the built-in `useHydrated()` hook
 * from `@tanstack/start` if available
 */
const useHydrated = (): boolean => {
  return useSyncExternalStore(
    // Subscribe function (no-op for hydration state)
    () => () => {},
    // Client snapshot: always true after hydration
    () => true,
    // Server snapshot: always false during SSR
    () => false
  )
}

/**
 * TanStack Start Theme Provider - Optimized for TanStack Start Framework
 *
 * @param children - React children to wrap with theme context
 * @param themes - Available theme options
 * @param colorThemes - Available color theme options
 * @param defaultTheme - Default theme to use
 * @param defaultColorTheme - Default color theme to use
 * @param animationType - Animation type for theme transitions
 * @param duration - Animation duration in milliseconds
 * @param storageKey - LocalStorage key for theme preference
 * @param colorStorageKey - LocalStorage key for color theme preference
 * @param globalClassName - Class name for dark theme
 * @param colorThemePrefix - Prefix for color theme classes
 */
export const TanStackThemeProvider: React.FC<TanStackThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
  storageKey = 'theme',
  colorStorageKey = 'color-theme',
  globalClassName = 'dark',
  colorThemePrefix = 'theme-',
}) => {
  const isHydrated = useHydrated()

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
  })

  // Hydration-aware theme switch: instant during hydration, animated after
  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff: boolean = false) => {
      if (!isHydrated) {
        // During hydration: instant switch, no animation
        themeState.setTheme(theme)
      } else {
        // After hydration: animated switch
        await themeState.switchTheme(theme, animationOff)
      }
    },
    [isHydrated, themeState]
  )

  const toggleThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      if (!isHydrated) {
        const nextTheme = themeState.resolvedTheme === 'dark' ? 'light' : 'dark'
        themeState.setTheme(nextTheme)
      } else {
        await themeState.toggleTheme(animationOff)
      }
    },
    [isHydrated, themeState]
  )

  const toggleLightThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      if (!isHydrated) {
        themeState.setTheme('light')
      } else {
        await themeState.toggleLightTheme(animationOff)
      }
    },
    [isHydrated, themeState]
  )

  const toggleDarkThemeWithHydrationAwareness = useCallback(
    async (animationOff: boolean = false) => {
      if (!isHydrated) {
        themeState.setTheme('dark')
      } else {
        await themeState.toggleDarkTheme(animationOff)
      }
    },
    [isHydrated, themeState]
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      if (!isHydrated) {
        themeState.setTheme(theme)
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
    },
    [isHydrated, themeState]
  )

  const systemTheme =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

  // During SSR/hydration: provide safe context without animations
  if (!isHydrated) {
    const loadingContextValue: TanStackThemeContextType = {
      ref: { current: null },
      theme: defaultTheme,
      colorTheme: defaultColorTheme,
      resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
      systemTheme: 'light',
      isHydrated: false,
      setTheme: themeState.setTheme,
      setColorTheme: themeState.setColorTheme,

      switchTheme: async (theme: Theme, animationOff: boolean = false) =>
        themeState.setTheme(theme),
      switchThemeFromElement: async (theme: Theme) => themeState.setTheme(theme),
      switchColorTheme: themeState.switchColorTheme,

      toggleTheme: async (animationOff: boolean = false) => {
        const nextTheme = themeState.resolvedTheme === 'dark' ? 'light' : 'dark'
        themeState.setTheme(nextTheme)
      },
      toggleLightTheme: async (animationOff: boolean = false) => themeState.setTheme('light'),
      toggleDarkTheme: async (animationOff: boolean = false) => themeState.setTheme('dark'),
      toggleColorTheme: themeState.toggleColorTheme,

      createColorThemeToggle: themeState.createColorThemeToggle,
      isColorThemeActive: themeState.isColorThemeActive,
    }

    return (
      <TanStackThemeContext.Provider value={loadingContextValue}>
        {children}
      </TanStackThemeContext.Provider>
    )
  }

  // After hydration: full context with animations enabled
  const contextValue: TanStackThemeContextType = {
    ref: themeState.ref,
    theme: themeState.theme,
    colorTheme: themeState.colorTheme,
    resolvedTheme: themeState.resolvedTheme,
    systemTheme,
    isHydrated: true,
    setTheme: themeState.setTheme,
    setColorTheme: themeState.setColorTheme,

    switchTheme: switchThemeWithHydrationAwareness,
    switchThemeFromElement,
    switchColorTheme: themeState.switchColorTheme,

    toggleTheme: toggleThemeWithHydrationAwareness,
    toggleLightTheme: toggleLightThemeWithHydrationAwareness,
    toggleDarkTheme: toggleDarkThemeWithHydrationAwareness,
    toggleColorTheme: themeState.toggleColorTheme,

    createColorThemeToggle: themeState.createColorThemeToggle,
    isColorThemeActive: themeState.isColorThemeActive,
  }

  return (
    <TanStackThemeContext.Provider value={contextValue}>{children}</TanStackThemeContext.Provider>
  )
}

/**
 * Hook to consume the TanStack Theme context
 *
 * @returns Theme context value with all theme state and methods
 * @throws Error if used outside of TanStackThemeProvider
 */
export const useTanStackTheme = (): TanStackThemeContextType => {
  const context = useContext(TanStackThemeContext)
  if (context === undefined) {
    throw new Error('useTanStackTheme must be used within a TanStackThemeProvider')
  }
  return context
}
