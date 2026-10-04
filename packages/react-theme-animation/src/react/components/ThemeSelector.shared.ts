import type { ColorTheme, ThemeTransitionInput } from '../../core/types'

export const defaultColorThemes = ['default'] as const

export const defaultThemes = ['light', 'dark', 'system'] as const

export interface ThemeSelectorViewProps {
  readonly colorTheme: ColorTheme
  readonly colorThemes: readonly ColorTheme[]
  readonly onSelectColorTheme: (
    colorTheme: ColorTheme,
    options?: ThemeTransitionInput,
  ) => Promise<void>
}
