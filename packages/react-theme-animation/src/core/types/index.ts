import type { RefObject } from 'react'

export enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
  SLIDE = 'slide',
  CLIP_PATH = 'clip-path',
  POLYGON_GRADIENT = 'polygon-gradient',
  TRIANGLE = 'triangle',
  SVG_LOGO = 'svg-logo',
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

/** Clockwise from the top-left corner. */
export const TRANSITION_DIRECTIONS = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
] as const

export type TransitionDirection = (typeof TRANSITION_DIRECTIONS)[number]

export type AnimationPosition = TransitionDirection | 'center' | 'trigger'

interface ThemeAnimationSettings {
  /** Starting edge/corner for polygon wipes. Defaults to top-left. */
  readonly clipPathDirection?: TransitionDirection
  /** Fixed circle/triangle origin; SVG_LOGO always uses the viewport center. */
  readonly animationPosition?: AnimationPosition
  /** Stationary logo width in CSS pixels or auto; default is 96 when both are omitted. */
  readonly logoWidth?: number | 'auto'
  /** Logo height in CSS pixels or auto; omitted dimensions preserve the SVG aspect ratio. */
  readonly logoHeight?: number | 'auto'
  /** Gradient wipe feather in CSS pixels; defaults to 80. */
  readonly gradientWidth?: number
}

/** Choose one shared asset, or both destination-specific assets. */
export type ThemeLogoOptions =
  | {
      readonly logo?: string
      readonly logoLight?: never
      readonly logoDark?: never
    }
  | {
      readonly logo?: never
      readonly logoLight: string
      readonly logoDark: string
    }

export type ThemeAnimationOptions = ThemeAnimationSettings & ThemeLogoOptions

export interface AnimationConfig extends ThemeAnimationSettings {
  /** Asset already selected for the destination theme before capture. */
  readonly logo?: string
  readonly a?: number
  readonly b?: number
  readonly x: number
  readonly y: number
  readonly duration: number
  readonly easing: string
  readonly animationType: ThemeAnimationType
  readonly blurAmount: number
  readonly styleId: string
}

export type Theme = 'light' | 'dark' | 'system'

export type ColorTheme = string

export type SystemThemeMode = 'css' | 'js'

export type UseThemeAnimationProps = ThemeAnimationOptions & {
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

/** Per-call animation controls shared by all providers. */
export interface ThemeTransitionOptions {
  /** Skip the view transition (also automatically skipped for reduced motion). */
  readonly animationOff?: boolean
  /** Trigger element; its viewport rectangle is read synchronously. */
  readonly element?: Element | null
  /** Viewport-relative CSS pixels. Never multiply these coordinates by DPR. */
  readonly origin?: { readonly x: number; readonly y: number }
}

/** Boolean arguments remain supported for backward compatibility. */
export type ThemeTransitionInput = boolean | ThemeTransitionOptions

export type ColorThemeToggle = (
  options?:
    | ThemeTransitionInput
    | Pick<React.MouseEvent<HTMLElement>, 'currentTarget' | 'detail'>,
) => Promise<void>

export interface UseThemeAnimationReturn {
  readonly ref: RefObject<HTMLButtonElement | null>

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
}

export type ThemeSwitcherProps = ThemeAnimationOptions & {
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

export type ThemeSelectorProps = ThemeAnimationOptions & {
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
