import type { ColorTheme } from '../../core/types'

export const defaultColorThemes = ['default'] as const

export const defaultThemes = ['light', 'dark', 'system'] as const

export interface ThemeSelectorViewProps {
  colorTheme: ColorTheme
  colorThemes: readonly ColorTheme[]
  onSelectColorTheme: (colorTheme: ColorTheme) => void
}
