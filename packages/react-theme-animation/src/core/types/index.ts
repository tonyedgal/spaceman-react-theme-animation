import type { RefObject } from 'react'

export enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
  SLIDE = 'slide',
}

export type SlideDirection =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type Theme = 'light' | 'dark' | 'system'

export type ColorTheme = string

export type SystemThemeMode = 'css' | 'js'

export interface UseThemeAnimationProps {
  readonly duration?: number
  readonly easing?: string
  readonly animationType?: ThemeAnimationType
  readonly blurAmount?: number
  readonly styleId?: string

  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme

  readonly globalClassName?: string
  readonly colorThemePrefix?: string
  readonly attribute?: 'class' | 'data-theme'
  readonly value?: Record<string, string>
  readonly enableColorScheme?: boolean

  readonly storageKey?: string
  readonly colorStorageKey?: string

  readonly theme?: Theme
  readonly colorTheme?: ColorTheme

  readonly onThemeChange?: (theme: Theme) => void
  readonly onColorThemeChange?: (colorTheme: ColorTheme) => void

  readonly initialTheme?: Theme
  readonly initialColorTheme?: ColorTheme
  readonly systemThemeMode?: SystemThemeMode

  // Slide animation options (only valid when animationType is SLIDE)
  readonly slideDirection?: SlideDirection
  readonly slideFromX?: number // custom from translate X (%)
  readonly slideFromY?: number // custom from translate Y (%)
  readonly slideToX?: number // custom to translate X (%)
  readonly slideToY?: number // custom to translate Y (%)
}

export interface UseThemeAnimationReturn {
  readonly ref: RefObject<HTMLButtonElement | null>

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
}

export interface ThemeSwitcherProps {
  readonly themes?: readonly Theme[]
  readonly currentTheme?: Theme
  readonly onThemeChange?: (theme: Theme) => void

  readonly animationType?: ThemeAnimationType
  readonly duration?: number

  readonly className?: string
  readonly size?: 'sm' | 'md' | 'lg'
  readonly variant?: 'default' | 'outline' | 'ghost'

  readonly icons?: {
    readonly light?: React.ReactNode
    readonly dark?: React.ReactNode
    readonly system?: React.ReactNode
  }
}

export interface ThemeSelectorProps {
  readonly themes?: readonly Theme[]
  readonly colorThemes?: readonly ColorTheme[]
  readonly currentTheme?: Theme
  readonly currentColorTheme?: ColorTheme

  readonly onThemeChange?: (theme: Theme) => void
  readonly onColorThemeChange?: (colorTheme: ColorTheme) => void

  readonly animationType?: ThemeAnimationType
  readonly duration?: number

  readonly className?: string
  readonly placeholder?: string

  readonly themeLabel?: string
  readonly colorThemeLabel?: string
}
