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
  clipPathDirection?: TransitionDirection
  /** Fixed circle/triangle origin; SVG_LOGO always uses the viewport center. */
  animationPosition?: AnimationPosition
  /** Stationary logo width in CSS pixels or auto; default is 96 when both are omitted. */
  logoWidth?: number | 'auto'
  /** Logo height in CSS pixels or auto; omitted dimensions preserve the SVG aspect ratio. */
  logoHeight?: number | 'auto'
  /** Gradient wipe feather in CSS pixels; defaults to 80. */
  gradientWidth?: number
}

/** Choose one shared asset, or both destination-specific assets. */
export type ThemeLogoOptions =
  | { logo?: string; logoLight?: never; logoDark?: never }
  | { logo?: never; logoLight: string; logoDark: string }

export type ThemeAnimationOptions = ThemeAnimationSettings & ThemeLogoOptions

export interface AnimationConfig extends ThemeAnimationSettings {
  /** Asset already selected for the destination theme before capture. */
  logo?: string
  a?: number
  b?: number
  x: number
  y: number
  duration: number
  easing: string
  animationType: ThemeAnimationType
  blurAmount: number
  styleId: string
}

export type Theme = 'light' | 'dark' | 'system'

export type ColorTheme = string

export type SystemThemeMode = 'css' | 'js'

export type UseThemeAnimationProps = ThemeAnimationOptions & {
  duration?: number
  easing?: string
  animationType?: ThemeAnimationType
  blurAmount?: number
  styleId?: string

  themes?: Theme[]
  colorThemes?: ColorTheme[]
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme

  globalClassName?: string
  colorThemePrefix?: string
  attribute?: 'class' | 'data-theme'
  value?: Record<string, string>
  enableColorScheme?: boolean

  storageKey?: string
  colorStorageKey?: string

  theme?: Theme
  colorTheme?: ColorTheme

  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: ColorTheme) => void

  initialTheme?: Theme
  initialColorTheme?: ColorTheme
  systemThemeMode?: SystemThemeMode

  // Slide animation options (only valid when animationType is SLIDE)
  slideDirection?: SlideDirection
  slideFromX?: number // custom from translate X (%)
  slideFromY?: number // custom from translate Y (%)
  slideToX?: number // custom to translate X (%)
  slideToY?: number // custom to translate Y (%)
}

/** Per-call animation controls shared by all providers. */
export interface ThemeTransitionOptions {
  /** Skip the view transition (also automatically skipped for reduced motion). */
  animationOff?: boolean
  /** Trigger element; its viewport rectangle is read synchronously. */
  element?: Element | null
  /** Viewport-relative CSS pixels. Never multiply these coordinates by DPR. */
  origin?: { x: number; y: number }
}

/** Boolean arguments remain supported for backward compatibility. */
export type ThemeTransitionInput = boolean | ThemeTransitionOptions

export type ColorThemeToggle = (
  options?:
    | ThemeTransitionInput
    | Pick<React.MouseEvent<HTMLElement>, 'currentTarget' | 'detail'>,
) => Promise<void>

export interface UseThemeAnimationReturn {
  ref: RefObject<HTMLButtonElement | null>

  theme: Theme
  colorTheme: ColorTheme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'

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
}

export type ThemeSwitcherProps = ThemeAnimationOptions & {
  themes?: Theme[]
  currentTheme?: Theme
  onThemeChange?: (theme: Theme) => void

  animationType?: ThemeAnimationType
  duration?: number

  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'

  icons?: {
    light?: React.ReactNode
    dark?: React.ReactNode
    system?: React.ReactNode
  }
}

export type ThemeSelectorProps = ThemeAnimationOptions & {
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  currentTheme?: Theme
  currentColorTheme?: ColorTheme

  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: ColorTheme) => void

  animationType?: ThemeAnimationType
  duration?: number

  className?: string
  placeholder?: string

  themeLabel?: string
  colorThemeLabel?: string
}
