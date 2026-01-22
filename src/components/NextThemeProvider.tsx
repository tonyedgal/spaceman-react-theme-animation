import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { Theme, ColorTheme, ThemeAnimationType } from '../types'

/**
 * Context type for the Next Theme Provider
 */
interface NextThemeContextType {
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

  switchThemeFromElement: (theme: Theme, element: HTMLButtonElement) => Promise<void>
}

const NextThemeContext = createContext<NextThemeContextType | undefined>(undefined)

/**
 * Props for the Next Theme Provider
 */
interface NextThemeProviderProps {
  children: ReactNode
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  storageKey?: string
  colorStorageKey?: string
  attribute?: 'class' | 'data-theme'
  globalClassName?: string
  colorThemePrefix?: string
  nonce?: string
  disableAnimationOnInit?: boolean
  disablePreHydrationScript?: boolean
}

/**
 * Pre-hydration script content generator
 * This script runs BEFORE React hydrates to prevent flash of wrong theme
 */
const generatePreHydrationScript = (
  storageKey: string,
  colorStorageKey: string,
  defaultTheme: Theme,
  defaultColorTheme: ColorTheme,
  attribute: 'class' | 'data-theme',
  globalClassName: string,
  colorThemePrefix: string
): string => {
  return `
(function() {
  try {
    var theme = localStorage.getItem('${storageKey}') || '${defaultTheme}';
    var colorTheme = localStorage.getItem('${colorStorageKey}') || '${defaultColorTheme}';
    var resolved = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    
    if ('${attribute}' === 'class') {
      if (resolved === 'dark') {
        document.documentElement.classList.add('${globalClassName}');
      } else {
        document.documentElement.classList.remove('${globalClassName}');
      }
    } else {
      document.documentElement.setAttribute('data-theme', resolved);
    }
    
    document.documentElement.style.colorScheme = resolved;
    document.documentElement.classList.add('${colorThemePrefix}' + colorTheme);
  } catch (e) {
    console.warn('Theme pre-hydration script failed:', e);
  }
})();
`
}

/**
 * Pre-hydration script component
 * Injects inline script before React hydration to prevent theme flash
 */
const ThemePreHydrationScript: React.FC<{
  storageKey: string
  colorStorageKey: string
  defaultTheme: Theme
  defaultColorTheme: ColorTheme
  attribute: 'class' | 'data-theme'
  globalClassName: string
  colorThemePrefix: string
  nonce?: string
}> = React.memo(
  ({
    storageKey,
    colorStorageKey,
    defaultTheme,
    defaultColorTheme,
    attribute,
    globalClassName,
    colorThemePrefix,
    nonce,
  }) => {
    const scriptContent = generatePreHydrationScript(
      storageKey,
      colorStorageKey,
      defaultTheme,
      defaultColorTheme,
      attribute,
      globalClassName,
      colorThemePrefix
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

ThemePreHydrationScript.displayName = 'ThemePreHydrationScript'

/**
 * Next Theme Provider - Next.js optimized theme management with animations
 *
 * This provider is specifically optimized for Next.js and SSR frameworks with
 * pre-hydration script injection to prevent flash of wrong theme.
 *
 * Features:
 * - Pre-hydration script for flash prevention (SSR apps)
 * - Animated theme transitions via View Transitions API
 * - Multi-dimensional theming (theme + colorTheme)
 * - System theme detection
 * - CSP support via nonce prop
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
 * @param attribute - HTML attribute to use for theme ('class' or 'data-theme')
 * @param globalClassName - Class name for dark theme (when using 'class' attribute)
 * @param colorThemePrefix - Prefix for color theme classes
 * @param nonce - CSP nonce for inline script (SSR apps)
 * @param disableAnimationOnInit - Skip animation during initial hydration
 * @param disablePreHydrationScript - Disable flash prevention script (for SPAs without SSR)
 */
export const NextThemeProvider: React.FC<NextThemeProviderProps> = ({
  children,
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  animationType = ThemeAnimationType.CIRCLE,
  duration = 750,
  storageKey = 'theme',
  colorStorageKey = 'color-theme',
  attribute = 'class',
  globalClassName = 'dark',
  colorThemePrefix = 'theme-',
  nonce,
  disableAnimationOnInit = true,
  disablePreHydrationScript = false,
}) => {
  const [mounted, setMounted] = useState(false)

  const themeState = useThemeAnimation({
    themes,
    colorThemes,
    defaultTheme,
    defaultColorTheme,
    animationType,
    duration,
    storageKey,
    colorStorageKey,
    globalClassName: attribute === 'class' ? globalClassName : undefined,
    colorThemePrefix,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchThemeWithHydrationAwareness = useCallback(
    async (theme: Theme, animationOff: boolean = false) => {
      if (!mounted && disableAnimationOnInit) {
        themeState.setTheme(theme)
      } else {
        await themeState.switchTheme(theme, animationOff)
      }
    },
    [mounted, disableAnimationOnInit, themeState]
  )

  const switchThemeFromElement = useCallback(
    async (theme: Theme, element: HTMLButtonElement) => {
      if (!mounted && disableAnimationOnInit) {
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
    [mounted, disableAnimationOnInit, themeState]
  )

  const systemTheme =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

  if (!mounted) {
    const loadingContextValue: NextThemeContextType = {
      ref: { current: null },
      theme: defaultTheme,
      colorTheme: defaultColorTheme,
      resolvedTheme: defaultTheme === 'dark' ? 'dark' : 'light',
      systemTheme: 'light',
      setTheme: () => {},
      setColorTheme: () => {},

      switchTheme: async () => {},
      switchThemeFromElement: async () => {},
      switchColorTheme: () => {},

      toggleTheme: async () => {},
      toggleLightTheme: async () => {},
      toggleDarkTheme: async () => {},
      toggleColorTheme: () => {},

      createColorThemeToggle: () => () => {},
      isColorThemeActive: () => false,
    }

    return (
      <NextThemeContext.Provider value={loadingContextValue}>
        {!disablePreHydrationScript && (
          <ThemePreHydrationScript
            storageKey={storageKey}
            colorStorageKey={colorStorageKey}
            defaultTheme={defaultTheme}
            defaultColorTheme={defaultColorTheme}
            attribute={attribute}
            globalClassName={globalClassName}
            colorThemePrefix={colorThemePrefix}
            nonce={nonce}
          />
        )}
        {children}
      </NextThemeContext.Provider>
    )
  }

  const contextValue: NextThemeContextType = {
    ref: themeState.ref,
    theme: themeState.theme,
    colorTheme: themeState.colorTheme,
    resolvedTheme: themeState.resolvedTheme,
    systemTheme,
    setTheme: themeState.setTheme,
    setColorTheme: themeState.setColorTheme,

    switchTheme: switchThemeWithHydrationAwareness,
    switchThemeFromElement,
    switchColorTheme: themeState.switchColorTheme,

    toggleTheme: themeState.toggleTheme,
    toggleLightTheme: themeState.toggleLightTheme,
    toggleDarkTheme: themeState.toggleDarkTheme,
    toggleColorTheme: themeState.toggleColorTheme,

    createColorThemeToggle: themeState.createColorThemeToggle,
    isColorThemeActive: themeState.isColorThemeActive,
  }

  return (
    <NextThemeContext.Provider value={contextValue}>
      {!disablePreHydrationScript && (
        <ThemePreHydrationScript
          storageKey={storageKey}
          colorStorageKey={colorStorageKey}
          defaultTheme={defaultTheme}
          defaultColorTheme={defaultColorTheme}
          attribute={attribute}
          globalClassName={globalClassName}
          colorThemePrefix={colorThemePrefix}
          nonce={nonce}
        />
      )}
      {children}
    </NextThemeContext.Provider>
  )
}

/**
 * Hook to consume the Next Theme context
 *
 * @returns Theme context value with all theme state and methods
 * @throws Error if used outside of NextThemeProvider
 */
export const useNextTheme = (): NextThemeContextType => {
  const context = useContext(NextThemeContext)
  if (context === undefined) {
    throw new Error('useNextTheme must be used within a NextThemeProvider')
  }
  return context
}
